import { useState } from 'react';
import ReportModal from './ReportModal';
import ConfirmModal from './ConfirmModal';
import EditStory from '../stories/EditStory';
import { useApp } from '../../context/AppContext';

function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  );
}

function BookmarkIcon({ saved }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function HideIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function MoreMenu({ story, onHide }) {
  const { reportStory, deleteStory, toggleSave, savedStories } = useApp();
  const saved = savedStories.has(story.id);
  const [open, setOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="more-menu-wrapper">
      <button className="more-btn" onClick={() => setOpen((o) => !o)} title="More">
        <MoreIcon />
      </button>
      {open && (
        <>
          <div className="more-backdrop" onClick={() => setOpen(false)} />
          <div className="more-dropdown">
            <button className="more-option" onClick={() => { toggleSave(story.id); setOpen(false); }}>
              <BookmarkIcon saved={saved} /> {saved ? 'Unsave' : 'Save'}
            </button>
            <button className="more-option" onClick={() => { onHide(); setOpen(false); }}>
              <HideIcon /> Hide this post
            </button>
            <button className="more-option" onClick={() => { setShowReport(true); setOpen(false); }}>
              <FlagIcon /> Report
            </button>
            {story.isMine && (
              <>
                <button className="more-option" onClick={() => { setShowEdit(true); setOpen(false); }}>
                  <EditIcon /> Edit
                </button>
                <button className="more-option more-option-danger" onClick={() => { setShowDelete(true); setOpen(false); }}>
                  <TrashIcon /> Delete
                </button>
              </>
            )}
          </div>
        </>
      )}
      {showReport && (
        <ReportModal
          onClose={() => setShowReport(false)}
          onSubmit={() => { reportStory(story.id); setShowReport(false); }}
        />
      )}
      {showEdit && (
        <EditStory story={story} onClose={() => setShowEdit(false)} />
      )}
      {showDelete && (
        <ConfirmModal
          title="Delete story"
          message="This cannot be undone. The story and all its comments will be permanently removed."
          confirmLabel="Delete"
          onConfirm={() => { deleteStory(story.id); setShowDelete(false); }}
          onClose={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}

export default MoreMenu;
