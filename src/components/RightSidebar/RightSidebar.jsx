import React, { useState, useEffect, useRef } from 'react';
import {
  communities,
  interactions,
  crisisResources,
  reflectionPrompts,
} from '../../data/sidebarData';
import './RightSidebar.css';

function MindfulnessTimer() {
  const [time, setTime] = useState(180);
  const [isActive, setIsActive] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(180);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((t) => t - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, time]);

  const presets = [
    { label: '3 min', value: 180 },
    { label: '5 min', value: 300 },
    { label: '10 min', value: 600 },
  ];

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handlePreset = (val) => {
    setSelectedPreset(val);
    setTime(val);
    setIsActive(false);
  };

  const progress = 1 - time / selectedPreset;

  return (
    <div className="timer-widget">
      <h4 className="widget-heading">Mindfulness Timer</h4>
      <div className="timer-display-wrap">
        <svg className="timer-ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle className="timer-ring-bg" cx="50" cy="50" r="44" />
          <circle
            className="timer-ring-fill"
            cx="50"
            cy="50"
            r="44"
            style={{
              strokeDasharray: `${2 * Math.PI * 44}`,
              strokeDashoffset: `${2 * Math.PI * 44 * (1 - progress)}`,
            }}
          />
        </svg>
        <span className="timer-display">{formatTime(time)}</span>
      </div>
      <div className="timer-presets">
        {presets.map((p) => (
          <button
            key={p.value}
            className={`preset-btn${selectedPreset === p.value ? ' active' : ''}`}
            onClick={() => handlePreset(p.value)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="timer-actions">
        <button
          className="timer-action-btn primary"
          onClick={() => setIsActive(!isActive)}
          aria-label={isActive ? 'Pause timer' : 'Start timer'}
        >
          {isActive ? '\u23F8\uFE0F' : '\u25B6\uFE0F'} {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          className="timer-action-btn"
          onClick={() => {
            setTime(selectedPreset);
            setIsActive(false);
          }}
          aria-label="Reset timer"
        >
          {'\u{1F504}'} Reset
        </button>
      </div>
    </div>
  );
}

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
                {item.type === 'support'
                  ? '\u{2764}\u{FE0F}'
                  : item.type === 'reaction'
                  ? '\u{1F44D}'
                  : '\u{1F4AC}'}
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
          <span className="reflection-icon" aria-hidden="true">{'\u{1F4AD}'}</span>
          <p className="reflection-prompt">{prompt}</p>
          <button
            className="reflection-btn"
            onClick={() => showToast?.('Take a moment to reflect. You are safe here.')}
          >
            Reflect in silence
          </button>
        </div>
      </section>

      <section className="sidebar-section crisis-section">
        <div className="crisis-header">
          <span className="crisis-icon" aria-hidden="true">{'\u{1F6E1}\u{FE0F}'}</span>
          <h3 className="sidebar-heading">Crisis Support</h3>
        </div>
        <p className="crisis-intro">
          If you're in distress, help is available 24/7. You matter.
        </p>
        <div className="crisis-list">
          {crisisResources.map((r) => (
            <a
              key={r.name}
              href={`tel:${r.number.replace(/[^0-9]/g, '')}`}
              className="crisis-item"
            >
              <span className="crisis-name">{r.name}</span>
              <span className="crisis-number">{r.number}</span>
              <span className="crisis-desc">{r.description}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="sidebar-section">
        <MindfulnessTimer />
      </section>
    </aside>
  );
}
