import { useState } from 'react';
import { useApp } from '../../context/AppContext';

function MoodIcon({ mood }) {
  const svgProps = { width: 48, height: 48, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" };

  const icons = {
    Happy: (
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 3 4 3 4-3 4-3" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
    Peaceful: (
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="8" y1="8" x2="10" y2="8" />
        <line x1="14" y1="8" x2="16" y2="8" />
      </svg>
    ),
    Sad: (
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="10" />
        <path d="M8 16s1.5-3 4-3 4 3 4 3" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
    Angry: (
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="10" />
        <path d="M8 15s1.5-1 4-1 4 1 4 1" />
        <line x1="9" y1="8" x2="10.5" y2="9.5" />
        <line x1="10.5" y1="8" x2="9" y2="9.5" />
        <line x1="13.5" y1="8" x2="15" y2="9.5" />
        <line x1="15" y1="8" x2="13.5" y2="9.5" />
      </svg>
    ),
  };

  return icons[mood] || null;
}

const MOODS = [
  { key: 'Happy', label: 'Happy' },
  { key: 'Peaceful', label: 'Peaceful' },
  { key: 'Sad', label: 'Sad' },
  { key: 'Angry', label: 'Angry' },
];

function MoodCheckin() {
  const { currentMood, setMood } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem('moodDismissed') === 'true');

  if (dismissed) return null;

  const selected = MOODS.find((m) => m.key === currentMood);

  function dismiss() {
    setDismissed(true);
    localStorage.setItem('moodDismissed', 'true');
  }

  return (
    <div className={`mood-checkin ${expanded ? 'expanded' : ''}`}>
      {expanded ? (
        <>
          <div className="mood-header">
            <span className="mood-label">How are you feeling?</span>
            <div className="mood-header-actions">
              {currentMood && (
                <button className="mood-clear" onClick={() => { setMood(null); setExpanded(false); }}>
                  Clear
                </button>
              )}
              <button className="mood-dismiss" onClick={dismiss} title="Hide">✕</button>
            </div>
          </div>
          <div className="mood-wheel">
            {MOODS.map((m) => (
              <button
                key={m.key}
                className={`mood-option ${currentMood === m.key ? 'active' : ''}`}
                onClick={() => { setMood(m.key); setExpanded(false); }}
                title={m.label}
              >
                <MoodIcon mood={m.key} />
                <span className="mood-label-text">{m.label}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <button className="mood-trigger" onClick={() => setExpanded(true)}>
          {selected ? (
            <>
              <MoodIcon mood={selected.key} />
              <span className="mood-current-label">Feeling {selected.label}</span>
              <span className="mood-change-hint">Change</span>
              <button className="mood-dismiss-trigger" onClick={(e) => { e.stopPropagation(); dismiss(); }} title="Hide">✕</button>
            </>
          ) : (
            <>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <circle cx="9" cy="9" r=".5" />
                <circle cx="15" cy="9" r=".5" />
              </svg>
              <span className="mood-current-label">How are you feeling?</span>
              <span className="mood-change-hint">Tap</span>
              <button className="mood-dismiss-trigger" onClick={(e) => { e.stopPropagation(); dismiss(); }} title="Hide">✕</button>
            </>
          )}
        </button>
      )}
    </div>
  );
}

export default MoodCheckin;
