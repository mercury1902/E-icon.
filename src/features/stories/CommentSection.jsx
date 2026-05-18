import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { animalAvatars } from '../../data/mockData';
import ReportModal from '../shared/ReportModal';

function formatTime(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function CommentSection({ storyId, comments }) {
  const { addComment, addReply, reportComment } = useApp();
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [reportTarget, setReportTarget] = useState(null);
  const [avatar] = useState(() => animalAvatars[Math.floor(Math.random() * animalAvatars.length)]);
  const [replyAvatar] = useState(() => animalAvatars[Math.floor(Math.random() * animalAvatars.length)]);

  const topLevel = comments.filter((c) => c.parentId === null);
  const replies = comments.filter((c) => c.parentId !== null);

  function getReplies(parentId) {
    return replies.filter((r) => r.parentId === parentId);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    addComment(storyId, text.trim(), avatar);
    setText('');
  }

  function handleReplySubmit(e) {
    e.preventDefault();
    if (!replyText.trim() || !replyTo) return;
    addReply(storyId, replyTo, replyText.trim(), replyAvatar);
    setReplyText('');
    setReplyTo(null);
  }

  function handleReport(commentId) {
    reportComment(storyId, commentId);
    setReportTarget(null);
  }

  return (
    <div className="comment-section">
      <h3>Anonymous Comments</h3>
      <div className="comments-list">
        {topLevel.map((c) => (
          <div key={c.id}>
            <div className="comment">
              <span className="comment-avatar">{c.avatar}</span>
              <div className="comment-body">
                <p className="comment-text">{c.content}</p>
                <div className="comment-meta">
                  <span className="comment-time">{formatTime(c.timestamp)}</span>
                  <button className="comment-action" onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}>
                    ↩️ Reply
                  </button>
                  <button className="comment-action" onClick={() => setReportTarget(c.id)}>
                    🚩
                  </button>
                </div>
              </div>
            </div>
            {getReplies(c.id).map((r) => (
              <div key={r.id} className="comment comment-reply">
                <span className="comment-avatar">{r.avatar}</span>
                <div className="comment-body">
                  <p className="comment-text">{r.content}</p>
                  <div className="comment-meta">
                    <span className="comment-time">{formatTime(r.timestamp)}</span>
                    <button className="comment-action" onClick={() => setReportTarget(r.id)}>
                      🚩
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {replyTo === c.id && (
              <form className="comment-form reply-form" onSubmit={handleReplySubmit}>
                <span className="comment-avatar-input">{replyAvatar}</span>
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  autoFocus
                />
                <button type="submit" disabled={!replyText.trim()}>Reply</button>
                <button type="button" className="cancel-reply" onClick={() => { setReplyTo(null); setReplyText(''); }}>
                  ✕
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
      <form className="comment-form" onSubmit={handleSubmit}>
        <span className="comment-avatar-input">{avatar}</span>
        <input
          type="text"
          placeholder="Write an anonymous comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" disabled={!text.trim()}>Post</button>
      </form>
      {reportTarget && (
        <ReportModal
          onClose={() => setReportTarget(null)}
          onSubmit={() => handleReport(reportTarget)}
        />
      )}
    </div>
  );
}

export default CommentSection;
