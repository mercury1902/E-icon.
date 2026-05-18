import { useState, useEffect, useRef } from 'react';
import { useParallel } from './ParallelContext';

const roleDescriptions = {
  shareStory: { share: 'share a story', hear: 'hear your story' },
  shareAdvice: { share: 'give advice', hear: 'receive advice' },
  hearStory: { share: 'hear a story', hear: 'share their story' },
  hearAdvice: { share: 'get advice', hear: 'offer advice' },
};

function FindMatchModal({ prefs, onClose }) {
  const { startMatching } = useParallel();
  const [phase, setPhase] = useState('listening');
  const [dots, setDots] = useState('');
  const [unavailable, setUnavailable] = useState(false);
  const modalRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    modalRef.current?.focus();

    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    const phaseTimer = setTimeout(() => {
      setPhase('searching');
    }, 1500);

    const defaultPrefs = prefs || { role: 'shareStory', genderPref: 'any' };

    startMatching(defaultPrefs).then((result) => {
      if (!result.success) {
        setUnavailable(true);
      }
    });

    return () => {
      clearInterval(dotInterval);
      clearTimeout(phaseTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const desc = roleDescriptions[prefs?.role] || roleDescriptions.shareStory;

  if (unavailable) {
    return (
      <div className="parallel-modal-overlay" onClick={onClose}>
        <div className="parallel-find-modal" onClick={(e) => e.stopPropagation()}>
          <div className="parallel-unavailable">
            <span className="parallel-unavailable-icon">🔍</span>
            <h2>No one available right now</h2>
            <p>
              We searched but could not find anyone who wants to {desc.hear}
              at this moment. Please try again later.
            </p>
            <div className="parallel-unavailable-actions">
              <button className="parallel-prefs-submit" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const phaseMessages = {
    listening: `Listening — you want to ${desc.share}`,
    searching: `Finding someone who wants to ${desc.hear}`,
  };

  return (
    <div
      className="parallel-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Finding a kindred spirit"
      aria-busy="true"
    >
      <div
        ref={modalRef}
        className="parallel-find-modal"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <button
          className="parallel-modal-close"
          onClick={onClose}
          aria-label="Cancel"
        >
          ✕
        </button>

        <div className="parallel-find-animation" aria-hidden="true">
          <div className="parallel-pulse-ring" />
          <div className="parallel-pulse-ring delay-1" />
          <div className="parallel-pulse-ring delay-2" />
          <div className="parallel-find-icon">💫</div>
        </div>

        <div role="status" aria-live="polite">
          <h2 className="parallel-find-title">
            {phaseMessages[phase]}
            <span className="parallel-dots" aria-hidden="true">{dots}</span>
          </h2>
        </div>

        <p className="parallel-find-subtitle">
          Someone out there is looking for the same kind of connection. We are finding them for you.
        </p>

        <button className="parallel-find-cancel" onClick={onClose} aria-label="Cancel search">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default FindMatchModal;
