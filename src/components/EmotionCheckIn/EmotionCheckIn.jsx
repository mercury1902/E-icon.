import React, { useState } from 'react';
import './EmotionCheckIn.css';
import { FacebookEmoji } from '../../utils/emojiHelper';

const emotions = [
  { id: 'exhausted', emoji: '\u{1F634}', label: 'Exhausted' },
  { id: 'anxious', emoji: '\u{1F630}', label: 'Anxious' },
  { id: 'lonely', emoji: '\u{1F622}', label: 'Lonely' },
  { id: 'numb', emoji: '\u{1F636}', label: 'Numb' },
  { id: 'hopeful', emoji: '\u{1F308}', label: 'Hopeful' },
  { id: 'overwhelmed', emoji: '\u{1F62D}', label: 'Overwhelmed' },
];

export default function EmotionCheckIn({ showToast, onEmotionChange }) {
  const [selected, setSelected] = useState(null);

  const handleClick = (id) => {
    if (selected === id) {
      setSelected(null);
      showToast('Check-in cleared. No data saved.');
      onEmotionChange?.(null);
    } else {
      setSelected(id);
      showToast(`You're feeling ${id}. We hear you. \u{1F49C}`);
      onEmotionChange?.(id);
    }
  };

  return (
    <section className="emotion-checkin animate-in" aria-labelledby="checkin-heading">
      <div className="section-header">
        <span className="shield" aria-hidden="true">
          <FacebookEmoji emoji={'\u{1F497}'} size={20} inline={true} />
        </span>
        <h2 id="checkin-heading">How are you feeling?</h2>
      </div>
      <div className="checkin-prompt">
        <p>
          <strong>This is just for you.</strong> Your selection is never saved
          or shared. It helps you check in with yourself.
        </p>
      </div>
      <div className="emotion-grid" role="group" aria-label="Emotion check-in buttons">
        {emotions.map((e) => (
          <button
            key={e.id}
            className={`emotion-btn${selected === e.id ? ' selected' : ''}`}
            type="button"
            onClick={() => handleClick(e.id)}
            aria-pressed={selected === e.id}
          >
            <span className="emoji" aria-hidden="true">
              <FacebookEmoji emoji={e.emoji} size={32} />
            </span>
            <span>{e.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
