import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';

function DailyAffirmation() {
  const { affirmations } = useApp();
  const [likedAffirmations, setLikedAffirmations] = useState(() => {
    const saved = localStorage.getItem('likedAffirmations');
    return saved ? JSON.parse(saved) : [];
  });

  const daySeed = useMemo(() => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  }, []);

  const [offset, setOffset] = useState(() => {
    const saved = localStorage.getItem('affirmationOffset');
    const savedDate = localStorage.getItem('affirmationDate');
    if (savedDate === daySeed && saved) {
      return parseInt(saved, 10);
    }
    return 0;
  });

  const index = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < daySeed.length; i++) {
      hash = ((hash << 5) - hash) + daySeed.charCodeAt(i);
      hash |= 0;
    }
    return (Math.abs(hash) + offset) % affirmations.length;
  }, [daySeed, offset, affirmations.length]);

  const current = affirmations[index];
  const isLiked = likedAffirmations.includes(index);

  function handleNext() {
    const next = offset + 1;
    setOffset(next);
    localStorage.setItem('affirmationOffset', String(next));
    localStorage.setItem('affirmationDate', daySeed);
  }

  function handleLike() {
    const next = isLiked
      ? likedAffirmations.filter((i) => i !== index)
      : [...likedAffirmations, index];
    setLikedAffirmations(next);
    localStorage.setItem('likedAffirmations', JSON.stringify(next));
  }

  return (
    <div className="daily-affirmation">
      <div className="daily-affirmation-header">
        <span className="daily-affirmation-icon">✨</span>
        <span className="daily-affirmation-label">Daily Affirmation</span>
      </div>
      <div className="daily-affirmation-card">
        <span className="daily-affirmation-quote">"</span>
        <p className="daily-affirmation-text">{current}</p>
      </div>
      <div className="daily-affirmation-actions">
        <button
          className={`daily-affirmation-like ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          title={isLiked ? 'Unlike' : 'Like'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <button className="daily-affirmation-next" onClick={handleNext} title="Next affirmation">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          <span>Another</span>
        </button>
      </div>
    </div>
  );
}

export default DailyAffirmation;
