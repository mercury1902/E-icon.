import React from 'react';
import './Toast.css';

export default function Toast({ message }) {
  return (
    <div
      className={`toast${message ? ' show' : ''}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      {message && <span dangerouslySetInnerHTML={{ __html: message }} />}
    </div>
  );
}
