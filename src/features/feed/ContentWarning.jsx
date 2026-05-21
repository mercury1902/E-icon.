import { useState } from 'react';

function ContentWarning({ warning, children }) {
  const [revealed, setRevealed] = useState(false);

  if (revealed) return children;

  return (
    <div className="content-warning" onClick={() => setRevealed(true)}>
      <div className="cw-icon">⚠️</div>
      <div className="cw-label">Sensitive Content</div>
      <div className="cw-tag">{warning}</div>
      <div className="cw-hint">Click to view</div>
    </div>
  );
}

export default ContentWarning;
