import { useState } from 'react';

const REPORT_REASONS = [
  'Harassment or hate speech',
  'Self-harm or suicide',
  'Violence or threats',
  'Spoiler',
  'Spam',
  'Other',
];

function ReportModal({ onClose, onSubmit }) {
  const [reason, setReason] = useState('');
  const [custom, setCustom] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!reason && !custom.trim()) return;
    onSubmit(reason === 'Other' ? custom.trim() : reason);
  }

  return (
    <div className="modal-overlay report-modal-overlay" onClick={onClose}>
      <div className="modal report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Report</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="report-options">
            {REPORT_REASONS.map((r) => (
              <label key={r} className="report-option">
                <input
                  type="radio"
                  name="reason"
                  value={r}
                  checked={reason === r}
                  onChange={(e) => setReason(e.target.value)}
                />
                <span>{r}</span>
              </label>
            ))}
          </div>
          {reason === 'Other' && (
            <textarea
              className="report-custom"
              placeholder="Describe the issue..."
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              rows="3"
            />
          )}
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={!reason && !custom.trim()}>
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportModal;
