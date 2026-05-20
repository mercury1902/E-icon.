import React, { useState, useEffect, useCallback } from 'react';
import { toggleReaction, getReactionsForPost, getCommentsForPost, addComment } from '../../services/posts';
import { generatePseudonym, getAvatarColor, getInitials } from '../../utils/pseudonyms';
import './PostCard.css';

const emojis = ['\u{1F44D}', '\u{2764}\u{FE0F}', '\u{1F60A}', '\u{1F622}'];
const tagVariants = ['primary', 'secondary', 'neutral'];

export default function PostCard({ post, index }) {
  const [reactions, setReactions] = useState({});
  const [commentCount, setCommentCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const loadReactions = useCallback(async () => {
    try {
      const data = await getReactionsForPost(post.id);
      const grouped = {};
      for (const r of data) {
        grouped[r.emoji] = (grouped[r.emoji] || 0) + 1;
      }
      setReactions(grouped);
    } catch {
      // silent
    }
  }, [post.id]);

  const loadComments = useCallback(async () => {
    try {
      const data = await getCommentsForPost(post.id);
      setComments(data);
      setCommentCount(data.length);
    } catch {
      // silent
    }
  }, [post.id]);

  useEffect(() => {
    loadReactions();
  }, [loadReactions]);

  const handleReact = async (emoji) => {
    try {
      await toggleReaction(post.id, emoji);
      loadReactions();
    } catch {
      // silent
    }
  };

  const toggleComments = async () => {
    if (!showComments) {
      await loadComments();
    }
    setShowComments((v) => !v);
  };

  const handleAddComment = async () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;

    setSubmittingComment(true);
    try {
      const pseudo = generatePseudonym();
      const color = getAvatarColor(pseudo.name);
      await addComment(post.id, trimmed, pseudo.name, color);
      setCommentText('');
      await loadComments();
    } catch {
      // silent
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 60000);
    if (diff < 1) return 'just now';
    if (diff < 60) return `${diff} min ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours} hr ago`;
    return d.toLocaleDateString();
  };

  return (
    <article
      className="post-card"
      style={{ animationDelay: `${index * 0.05}s` }}
      aria-label={`Post by ${post.post_pseudonym || 'Anonymous'}`}
    >
      <div className="post-card-header">
        <div
          className="post-avatar"
          style={{ background: post.avatar_color || '#A78BFA' }}
        >
          <span aria-hidden="true">
            {(post.post_pseudonym || '?').charAt(0).toUpperCase()}
          </span>
          <span className="shield-overlay" aria-hidden="true">{'\u{1F6E1}'}</span>
        </div>
        <div className="post-meta">
          <span className="post-author">{post.post_pseudonym || 'Anonymous'}</span>
          <span className="post-time">
            {formatDate(post.created_at)} &middot; <span className="post-anon-label">anonymous</span>
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
        {emojis.map((emoji) => {
          const count = reactions[emoji] || 0;
          return (
            <button
              key={emoji}
              className="reaction-btn"
              type="button"
              onClick={() => handleReact(emoji)}
              aria-label={`React with ${emoji}`}
            >
              <span aria-hidden="true">{emoji}</span>
              <span className="count">{count > 0 ? count : ''}</span>
            </button>
          );
        })}
        <button
          className={`comment-btn${showComments ? ' active' : ''}`}
          type="button"
          onClick={toggleComments}
          aria-label={`Comments: ${commentCount}`}
        >
          <span aria-hidden="true">{'\u{1F4AC}'}</span>
          <span>{commentCount > 0 ? commentCount : ''}</span>
        </button>
      </div>

      {showComments && (
        <div className="post-comments-section">
          <div className="comments-list">
            {comments.length === 0 && (
              <p className="comments-empty">No comments yet. Be the first to respond.</p>
            )}
            {comments.map((c) => (
              <div key={c.id} className="comment-item">
                <div
                  className="comment-avatar"
                  style={{ background: c.avatar_color || '#A78BFA' }}
                >
                  {(c.comment_pseudonym || '?').charAt(0).toUpperCase()}
                </div>
                <div className="comment-body">
                  <div className="comment-header">
                    <span className="comment-author">{c.comment_pseudonym || 'Anonymous'}</span>
                    <span className="comment-time">{formatDate(c.created_at)}</span>
                  </div>
                  <p className="comment-content">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="comment-composer">
            <input
              type="text"
              className="comment-input"
              placeholder="Share your thoughts anonymously..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              maxLength={500}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
            />
            <button
              className="comment-submit"
              onClick={handleAddComment}
              disabled={!commentText.trim() || submittingComment}
            >
              Post
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
