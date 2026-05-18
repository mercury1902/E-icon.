function ConfirmModal({ title, message, confirmLabel, onConfirm, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="confirm-title">{title}</h2>
        <p className="confirm-message">{message}</p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="submit-btn confirm-delete" onClick={onConfirm}>
            {confirmLabel || 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
