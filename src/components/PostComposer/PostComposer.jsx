import React, { useState, useCallback } from 'react';
import {
  generatePseudonym,
  getAvatarColor,
  getInitials,
} from '../../utils/pseudonyms';
import './PostComposer.css';
import { FacebookEmoji } from '../../utils/emojiHelper';

const availableTags = [
  { id: 'mentalhealth', label: '#mentalhealth' },
  { id: 'hope', label: '#hope' },
  { id: 'gratitude', label: '#gratitude' },
  { id: 'selfcare', label: '#selfcare' },
  { id: 'vent', label: '#vent' },
  { id: 'advice', label: '#advice' },
];

function createPseudo() {
  const p = generatePseudonym();
  return {
    name: p.name,
    color: getAvatarColor(p.name),
    initial: getInitials(p.name),
  };
}

export default function PostComposer({ onPost }) {
  const [pseudo, setPseudo] = useState(createPseudo);
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState(['mentalhealth']);
  const [animating, setAnimating] = useState(false);

  const handleShuffle = useCallback(() => {
    setAnimating(true);
    setPseudo(createPseudo());
    setTimeout(() => setAnimating(false), 400);
  }, []);

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((t) => t !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    onPost({
      author: pseudo.name,
      avatarColor: pseudo.color,
      initial: pseudo.initial,
      content: trimmed,
      tags: selectedTags.length ? selectedTags : ['mentalhealth'],
      reactions: {},
      comments: 0,
      time: 'just now',
    });

    setContent('');
    setSelectedTags(['mentalhealth']);
    setPseudo(createPseudo());
  };

  return (
    <section
      className="post-composer animate-in animate-in-delay-1"
      aria-labelledby="composer-heading"
    >
      <div className="section-header composer-section-header">
        <span className="shield" aria-hidden="true">
          <FacebookEmoji emoji={'\u{1F4AC}'} size={20} inline={true} />
        </span>
        <h2 id="composer-heading">Share what's on your mind</h2>
      </div>

      <div className="composer-header">
        <div className="pseudo-badge">
          <div
            className={`pseudo-avatar${animating ? ' refresh' : ''}`}
            style={{ background: pseudo.color }}
            aria-hidden="true"
          >
            {pseudo.initial}
          </div>
          <div className="pseudo-info">
            <span className="pseudo-name">{pseudo.name}</span>
            <span className="pseudo-label">
              <span className="shield-small" aria-hidden="true">
                <FacebookEmoji emoji={'\u{1F6E1}'} size={12} inline={true} />
              </span>
              Anonymous identity &middot; changes each post
            </span>
          </div>
        </div>
        <button
          className="shuffle-btn"
          type="button"
          onClick={handleShuffle}
          aria-label="Generate new anonymous name"
          title="New random name"
        >
          <FacebookEmoji emoji={'\u{1F504}'} size={16} inline={true} />
        </button>
      </div>

      <label htmlFor="post-input" className="sr-only">
        Write your anonymous post
      </label>
      <textarea
        id="post-input"
        className="composer-textarea"
        placeholder="What's been on your mind? This space is yours — share freely, without judgment."
        maxLength={1000}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        aria-describedby="char-count privacy-composer-note"
      />

      <div className="composer-meta">
        <span id="char-count" className={`char-count${content.length > 900 ? ' warn' : ''}`}>
          {content.length} / 1000
        </span>
        <span className="privacy-hint" id="privacy-composer-note">
          No one will know this came from you
        </span>
      </div>

      <div className="composer-tags" role="group" aria-label="Post tags">
        {availableTags.map((t) => (
          <button
            key={t.id}
            className={`composer-tag${selectedTags.includes(t.id) ? ' selected' : ''}`}
            type="button"
            onClick={() => toggleTag(t.id)}
            aria-pressed={selectedTags.includes(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="composer-actions">
        <span className="privacy-notice">
          <span className="lock" aria-hidden="true">
            <FacebookEmoji emoji={'\u{1F512}'} size={14} inline={true} />
          </span>
          Your identity is encrypted end-to-end. Never share personal info.
        </span>
        <button
          className="submit-btn"
          type="button"
          disabled={!content.trim()}
          onClick={handleSubmit}
        >
          <span aria-hidden="true">
            <FacebookEmoji emoji={'\u{27A1}'} size={14} inline={true} />
          </span>
          Post Anonymously
        </button>
      </div>
    </section>
  );
}
