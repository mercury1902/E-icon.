import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useParallel } from './ParallelContext';

const roleLabels = {
  shareStory: '📖 Sharing your story',
  shareAdvice: '💡 Giving advice',
  hearStory: '👂 Listening to a story',
  hearAdvice: '🤝 Getting advice',
};

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getExpiresAt(expiresAt) {
  return new Date(expiresAt).getTime();
}

function formatRemaining(expiresAt, now) {
  const diff = getExpiresAt(expiresAt) - now;
  if (diff <= 0) return 'Expired';

  const hours = Math.floor(diff / (60 * 60 * 1000));
  const mins = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));

  if (hours > 0) return `${hours}h ${mins}m remaining`;
  return `${mins}m remaining`;
}

function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function Timer({ expiresAt, now }) {
  const display = useMemo(() => formatRemaining(expiresAt, now), [expiresAt, now]);

  return (
    <span
      className={`parallel-timer ${display === 'Expired' ? 'expired' : ''}`}
      role="timer"
      aria-label={`Conversation time remaining: ${display}`}
    >
      ⏱ {display}
    </span>
  );
}

function ScrollToBottom({ visible, onClick }) {
  if (!visible) return null;
  return (
    <button
      className="parallel-scroll-bottom"
      onClick={onClick}
      aria-label="Scroll to latest message"
    >
      ↓
    </button>
  );
}

function ParallelChat({ threadId, onClose }) {
  const { getThread, addMessage, closeThread } = useParallel();
  const thread = getThread(threadId);
  const [input, setInput] = useState('');
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [lastSentId, setLastSentId] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const confirmKeepRef = useRef(null);
  const now = useNow();

  function handleOverlayKeyDown(e) {
    if (e.key === 'Escape' && !showConfirmClose) {
      e.stopPropagation();
      setShowConfirmClose(true);
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.messages]);

  useEffect(() => {
    if (!showConfirmClose) {
      inputRef.current?.focus();
    } else {
      setTimeout(() => confirmKeepRef.current?.focus(), 100);
    }
  }, [showConfirmClose]);

  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollBtn(!isNearBottom);
  }, []);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollBtn(false);
  }

  if (!thread) {
    return (
      <div className="parallel-modal-overlay" onClick={onClose}>
        <div className="parallel-chat-modal" onClick={(e) => e.stopPropagation()}>
          <p className="parallel-empty-state">Conversation not found.</p>
          <button className="submit-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const isActive = thread.status === 'active' && getExpiresAt(thread.expiresAt) > now;
  const roleLabel = roleLabels[thread.prefs?.role] || 'A kindred spirit';

  function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || !isActive) return;
    const newId = Date.now();
    setLastSentId(newId);
    addMessage(threadId, input);
    setInput('');
    setTimeout(() => setLastSentId(null), 1500);
  }

  function handleClose() {
    closeThread(threadId);
    setShowConfirmClose(false);
    onClose();
  }

  function handleConfirmKeyDown(e) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      setShowConfirmClose(false);
    }
  }

  return (
    <div
      className="parallel-modal-overlay"
      onClick={() => !showConfirmClose && setShowConfirmClose(true)}
      onKeyDown={handleOverlayKeyDown}
    >
      <div
        className="parallel-chat-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Conversation with ${thread.partnerName}`}
        aria-describedby="parallel-chat-desc"
      >
        <div className="parallel-chat-header">
          <div className="parallel-chat-partner">
            <span className="parallel-chat-avatar" aria-hidden="true">
              {thread.partnerAvatar}
            </span>
            <div>
              <span className="parallel-chat-name" id="parallel-chat-desc">
                {thread.partnerName}
              </span>
              <span className="parallel-chat-tagline">
                {roleLabel}
              </span>
              {thread.description && (
                <span className="parallel-chat-description">
                  {thread.description}
                </span>
              )}
            </div>
          </div>
          <div className="parallel-chat-header-right">
            <Timer expiresAt={thread.expiresAt} now={now} />
            <button
              className="parallel-chat-close-btn"
              onClick={() => setShowConfirmClose(true)}
              aria-label="Close conversation"
            >
              ✕
            </button>
          </div>
        </div>

        <div
          ref={messagesContainerRef}
          className="parallel-chat-messages"
          onScroll={handleScroll}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          aria-label="Chat messages"
          tabIndex={0}
        >
          {thread.messages.map((msg, idx) => (
            <div
              key={msg.id}
              id={`parallel-msg-${msg.id}`}
              className={`parallel-msg ${msg.fromPartner ? 'partner' : 'self'} ${lastSentId === msg.id ? 'just-sent' : ''}`}
              role="listitem"
            >
              {msg.fromPartner && (
                <span className="parallel-msg-avatar" aria-hidden="true">
                  {thread.partnerAvatar}
                </span>
              )}
              <div className="parallel-msg-bubble">
                <p className="parallel-msg-text">{msg.content}</p>
                <span className="parallel-msg-time">
                  {formatTime(msg.timestamp)}
                  {!msg.fromPartner && idx === thread.messages.length - 1 && (
                    <span className="parallel-msg-read" aria-label="Delivered">✓</span>
                  )}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <ScrollToBottom visible={showScrollBtn} onClick={scrollToBottom} />

        {isActive ? (
          <form className="parallel-chat-input" onSubmit={handleSend} aria-label="Send a message">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Reply to ${thread.partnerName}...`}
              maxLength="500"
              aria-label={`Type your message to ${thread.partnerName}`}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="parallel-send-btn"
              aria-label={input.trim() ? 'Send message' : 'Type a message to send'}
            >
              Send
            </button>
          </form>
        ) : (
          <div className="parallel-chat-expired" role="status">
            <p>This conversation has ended. Thank you for sharing with each other.</p>
          </div>
        )}

        {showConfirmClose && (
          <div
            className="parallel-confirm-overlay"
            onKeyDown={handleConfirmKeyDown}
            role="alertdialog"
            aria-modal="true"
            aria-label="Confirm end conversation"
          >
            <div className="parallel-confirm-box">
              <p id="parallel-confirm-title">End this conversation?</p>
              <p className="parallel-confirm-hint" id="parallel-confirm-desc">
                You cannot undo this. The conversation will be saved as a memory.
              </p>
              <div className="parallel-confirm-actions">
                <button
                  ref={confirmKeepRef}
                  className="cancel-btn"
                  onClick={() => setShowConfirmClose(false)}
                  aria-label="Continue the conversation"
                >
                  Keep Talking
                </button>
                <button
                  className="parallel-end-btn"
                  onClick={handleClose}
                  aria-label="End and close this conversation forever"
                >
                  End Conversation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ParallelChat;
