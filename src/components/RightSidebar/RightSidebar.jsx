import React, { useState } from 'react';
import {
  communities,
  interactions,
  reflectionPrompts,
} from '../../data/sidebarData';
import './RightSidebar.css';
import { FacebookEmoji } from '../../utils/emojiHelper';

export default function RightSidebar({ showToast }) {
  const [prompt] = useState(
    () => reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)]
  );

  return (
    <aside className="right-sidebar" aria-label="Community sidebar">
      <section className="sidebar-section">
        <h3 className="sidebar-heading">Supportive Communities</h3>
        <div className="community-list">
          {communities.map((c) => (
            <button
              key={c.name}
              className={`community-item${c.active ? '' : ' inactive'}`}
              onClick={() =>
                showToast?.(
                  c.active
                    ? `Joined ${c.name} — welcome!`
                    : `${c.name} is currently inactive`
                )
              }
            >
              <span
                className="community-dot"
                style={{ background: c.color }}
                aria-hidden="true"
              />
              <div className="community-info">
                <span className="community-name">{c.name}</span>
                <span className="community-meta">
                  {c.members} members{c.active ? ' \u{2022} active now' : ''}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="sidebar-section">
        <h3 className="sidebar-heading">Recent Interactions</h3>
        <div className="interactions-list">
          {interactions.map((item, i) => (
            <div key={i} className="interaction-item">
              <span className="interaction-dot" aria-hidden="true">
                <FacebookEmoji
                  emoji={
                    item.type === 'support'
                      ? '\u{2764}\u{FE0F}'
                      : item.type === 'reaction'
                      ? '\u{1F44D}'
                      : '\u{1F4AC}'
                  }
                  size={16}
                  inline={true}
                />
              </span>
              <div className="interaction-content">
                <p className="interaction-message">{item.message}</p>
                <span className="interaction-time">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="sidebar-section reflection-section">
        <h3 className="sidebar-heading">Daily Reflection</h3>
        <div className="reflection-card">
          <span className="reflection-icon" aria-hidden="true">
            <FacebookEmoji emoji={'\u{1F4AD}'} size={24} inline={true} />
          </span>
          <p className="reflection-prompt">{prompt}</p>
          <button
            className="reflection-btn"
            onClick={() => showToast?.('Take a moment to reflect. You are safe here.')}
          >
            Reflect in silence
          </button>
        </div>
      </section>

    </aside>
  );
}
