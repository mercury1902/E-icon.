import { useState } from 'react';
import { useParallel } from './ParallelContext';

const roleOptions = [
  { value: 'shareStory', label: 'Share My Story', icon: '📖', desc: 'Tell your story to someone who will listen' },
  { value: 'shareAdvice', label: 'Give Advice', icon: '💡', desc: 'Help someone with your experience' },
  { value: 'hearStory', label: 'Hear a Story', icon: '👂', desc: 'Listen to someone else\'s journey' },
  { value: 'hearAdvice', label: 'Get Advice', icon: '🤝', desc: 'Receive guidance from someone' },
];

const genderOptions = [
  { value: 'any', label: 'Anyone', icon: '🌍' },
  { value: 'male', label: 'Male', icon: '♂️' },
  { value: 'female', label: 'Female', icon: '♀️' },
  { value: 'others', label: 'Others', icon: '⚧️' },
];

function ParallelMatchingPrefs({ onClose }) {
  const { startMatching } = useParallel();
  const [role, setRole] = useState(null);
  const [description, setDescription] = useState('');
  const [genderPref, setGenderPref] = useState('any');
  const [finding, setFinding] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  async function handleFind() {
    if (!role) return;
    setFinding(true);
    setUnavailable(false);
    const result = await startMatching({ role, genderPref });
    setFinding(false);
    if (!result.success) {
      setUnavailable(true);
    }
  }

  function handleRetry() {
    setUnavailable(false);
    handleFind();
  }

  const isValid = !!role;

  return (
    <div className="parallel-modal-overlay" onClick={finding ? null : onClose}>
      <div className="parallel-prefs-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="parallel-modal-close"
          onClick={finding ? null : onClose}
          aria-label="Close"
          disabled={finding}
        >
          ✕
        </button>

        {unavailable ? (
          <div className="parallel-unavailable">
            <span className="parallel-unavailable-icon">🔍</span>
            <h2>No one available right now</h2>
            <p>
              We searched but could not find anyone matching your preferences
              at this moment. Please try again later.
            </p>
            <div className="parallel-unavailable-actions">
              <button className="parallel-prefs-submit" onClick={handleRetry}>
                Try Again
              </button>
              <button className="parallel-find-cancel" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        ) : finding ? (
          <div className="parallel-searching">
            <div className="parallel-find-animation" aria-hidden="true">
              <div className="parallel-pulse-ring" />
              <div className="parallel-pulse-ring delay-1" />
              <div className="parallel-pulse-ring delay-2" />
              <div className="parallel-find-icon">💫</div>
            </div>
            <div role="status" aria-live="polite">
              <h2 className="parallel-find-title">
                Looking for someone who matches...
                <span className="parallel-dots" aria-hidden="true">...</span>
              </h2>
            </div>
            <p className="parallel-find-subtitle">
              Searching for someone who fits your preferences.
            </p>
          </div>
        ) : (
          <>
            <div className="parallel-prefs-header">
              <h2>Find Your Parallel</h2>
              <p>Match with a kindred spirit for a private 30-minute conversation.</p>
            </div>

            <div className="parallel-prefs-section">
              <label className="parallel-prefs-label">I want to...</label>
              <div className="parallel-prefs-grid" role="radiogroup" aria-label="What do you want to do">
                {roleOptions.map((opt) => (
                  <button
                    key={opt.value}
                    className={`parallel-prefs-card ${role === opt.value ? 'selected' : ''}`}
                    onClick={() => setRole(opt.value)}
                    role="radio"
                    aria-checked={role === opt.value}
                  >
                    <span className="parallel-prefs-card-icon">{opt.icon}</span>
                    <span className="parallel-prefs-card-label">{opt.label}</span>
                    <span className="parallel-prefs-card-desc">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="parallel-prefs-section">
              <label className="parallel-prefs-label">A short description (optional)</label>
              <textarea
                className="parallel-prefs-textarea"
                placeholder="What do you want to talk about? This helps others find you..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={300}
              />
            </div>

            <div className="parallel-prefs-section">
              <label className="parallel-prefs-label">I prefer to talk to...</label>
              <div className="parallel-prefs-chips" role="radiogroup" aria-label="Gender preference">
                {genderOptions.map((opt) => (
                  <button
                    key={opt.value}
                    className={`parallel-prefs-chip ${genderPref === opt.value ? 'selected' : ''}`}
                    onClick={() => setGenderPref(opt.value)}
                    role="radio"
                    aria-checked={genderPref === opt.value}
                  >
                    <span>{opt.icon}</span> {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="parallel-prefs-action">
              <button
                className="parallel-prefs-submit"
                onClick={handleFind}
                disabled={!isValid}
              >
                Find Someone ✨
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ParallelMatchingPrefs;
