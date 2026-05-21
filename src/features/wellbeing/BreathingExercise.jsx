import { useState, useEffect, useRef } from 'react';

const PHASES = [
  { key: 'inhale', label: 'Breathe in', duration: 4000, scale: 1.6 },
  { key: 'hold', label: 'Hold', duration: 7000, scale: 1.6 },
  { key: 'exhale', label: 'Breathe out', duration: 8000, scale: 0.4 },
];

function BreathingExercise() {
  const [active, setActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const phase = PHASES[phaseIndex];
    timerRef.current = setTimeout(() => {
      setPhaseIndex((prev) => (prev + 1) % PHASES.length);
    }, phase.duration);
    return () => clearTimeout(timerRef.current);
  }, [active, phaseIndex]);

  function start() {
    setActive(true);
    setPhaseIndex(0);
  }

  function stop() {
    setActive(false);
    setPhaseIndex(0);
    clearTimeout(timerRef.current);
  }

  const phase = PHASES[phaseIndex];

  return (
    <div className={`breathing-exercise ${active ? 'active' : ''}`}>
      {!active ? (
        <div className="breathing-exercise-idle">
          <span className="breathing-exercise-icon">💨</span>
          <span className="breathing-exercise-title">Take a moment</span>
          <button className="breathing-exercise-start" onClick={start}>
            Breathe
          </button>
        </div>
      ) : (
        <div className="breathing-exercise-active">
          <button className="breathing-exercise-close" onClick={stop}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className="breathing-exercise-circles">
            <div className="breathing-exercise-pulse" />
            <div className="breathing-exercise-circle" style={{ transform: `scale(${phase.scale})` }}>
              <span className="breathing-exercise-phase-text">{phase.label}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BreathingExercise;
