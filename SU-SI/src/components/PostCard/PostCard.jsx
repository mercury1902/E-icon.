import React, { useState } from 'react';
import './PostCard.css';

const tagVariants = ['primary', 'secondary', 'neutral'];

export default function PostCard({ post, index }) {
  const [reactions, setReactions] = useState(post.reactions || {});
  const [reacted, setReacted] = useState({});

  const handleReact = (emoji) => {
    setReacted((prev) => {
      const isReacted = !prev[emoji];
      setReactions((r) => ({
        ...r,
        [emoji]: (r[emoji] || 0) + (isReacted ? 1 : -1),
      }));
      return { ...prev, [emoji]: isReacted };
    });
  };

  return (
    <article
      className="post-card"
      style={{ animationDelay: `${index * 0.05}s` }}
      aria-label={`Post by ${post.author}`}
    >
      <div className="post-card-header">
        <div
          className="post-avatar"
          style={{ background: post.avatarColor || '#A78BFA' }}
        >
          <span aria-hidden="true">{post.initial || '?'}</span>
          <span className="shield-overlay" aria-hidden="true">{'\u{1F6E1}'}</span>
        </div>
        <div className="post-meta">
          <span className="post-author">{post.author || 'Anonymous'}</span>
          <span className="post-time">
            {post.time} &middot; <span className="post-anon-label">anonymous</span>
          </span>
        </div>
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="post-tags">
          {post.tags.map((t, i) => (
            <span
              key={t}
              className={`post-tag ${tagVariants[i % tagVariants.length]}`}
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      <p className="post-content">{post.content}</p>

      <div className="post-actions">
        {['\u{1F44D}', '\u{2764}\u{FE0F}', '\u{1F60A}', '\u{1F622}'].map(
          (emoji) => {
            const count = reactions[emoji] || 0;
            return (
              <button
                key={emoji}
                className={`reaction-btn${reacted[emoji] ? ' reacted' : ''}`}
                type="button"
                onClick={() => handleReact(emoji)}
                aria-label={`${reacted[emoji] ? 'Remove' : 'Add'} reaction ${emoji}`}
              >
                <span aria-hidden="true">{emoji}</span>
                <span className="count">{count}</span>
              </button>
            );
          }
        )}
        <button
          className="comment-btn"
          type="button"
          aria-label={`Comments: ${post.comments || 0}`}
        >
          <span aria-hidden="true">{'\u{1F4AC}'}</span>
          <span>{post.comments || 0}</span>
        </button>
      </div>
    </article>
  );
}
