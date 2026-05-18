import { useState } from 'react';
import { useParallel } from './ParallelContext';
import ParallelChat from './ParallelChat';

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatRemaining(expiresAt) {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return null;
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const mins = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function getLastMessagePreview(messages) {
  if (messages.length === 0) return 'No messages yet';
  const last = messages[messages.length - 1];
  const prefix = last.fromPartner ? '' : 'You: ';
  return prefix + last.content.slice(0, 80) + (last.content.length > 80 ? '...' : '');
}

function ParallelHistory({ onBack }) {
  const { getActiveThreads, getExpiredThreads } = useParallel();
  const [openChatId, setOpenChatId] = useState(null);

  const active = getActiveThreads();
  const expired = getExpiredThreads();

  return (
    <div className="parallel-history-page">
      <div className="parallel-history-header">
        <button className="back-link" onClick={onBack}>← Back</button>
        <h2>Parallel Connections</h2>
      </div>

      {active.length === 0 && expired.length === 0 && (
        <div className="parallel-empty" role="status">
          <span className="parallel-empty-icon" aria-hidden="true">💬</span>
          <p className="parallel-empty-text">
            No parallel connections yet. Share a story and find someone who gets it.
          </p>
        </div>
      )}

      {active.length > 0 && (
        <section className="parallel-section" aria-labelledby="parallel-active-heading">
          <h3 className="parallel-section-title" id="parallel-active-heading">
            Active ({active.length})
          </h3>
          <div className="parallel-thread-list" role="list">
            {active.map((thread) => (
              <button
                key={thread.id}
                className="parallel-thread-card"
                onClick={() => setOpenChatId(thread.id)}
                role="listitem"
                aria-label={`Active conversation with ${thread.partnerName}: ${getLastMessagePreview(thread.messages)}`}
              >
                <div className="parallel-thread-left">
                  <span className="parallel-thread-avatar" aria-hidden="true">
                    {thread.partnerAvatar}
                  </span>
                </div>
                <div className="parallel-thread-middle">
                  <span className="parallel-thread-name">{thread.partnerName}</span>
                  <span className="parallel-thread-preview">
                    {getLastMessagePreview(thread.messages)}
                  </span>
                </div>
                <div className="parallel-thread-right">
                  <span className="parallel-thread-time">{formatDate(thread.createdAt)}</span>
                  {formatRemaining(thread.expiresAt) && (
                    <span className="parallel-thread-remaining">
                      {formatRemaining(thread.expiresAt)}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {expired.length > 0 && (
        <section className="parallel-section" aria-labelledby="parallel-memories-heading">
          <h3 className="parallel-section-title" id="parallel-memories-heading">
            Memories ({expired.length})
          </h3>
          <div className="parallel-thread-list" role="list">
            {expired.map((thread) => (
              <button
                key={thread.id}
                className="parallel-thread-card expired"
                onClick={() => setOpenChatId(thread.id)}
                role="listitem"
                aria-label={`Expired conversation with ${thread.partnerName}: ${getLastMessagePreview(thread.messages)}`}
              >
                <div className="parallel-thread-left">
                  <span className="parallel-thread-avatar" aria-hidden="true">
                    {thread.partnerAvatar}
                  </span>
                </div>
                <div className="parallel-thread-middle">
                  <span className="parallel-thread-name">{thread.partnerName}</span>
                  <span className="parallel-thread-preview">
                    {getLastMessagePreview(thread.messages)}
                  </span>
                </div>
                <div className="parallel-thread-right">
                  <span className="parallel-thread-time">{formatDate(thread.createdAt)}</span>
                  <span className="parallel-thread-expired-label">Expired</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {openChatId && (
        <ParallelChat threadId={openChatId} onClose={() => setOpenChatId(null)} />
      )}
    </div>
  );
}

export default ParallelHistory;
