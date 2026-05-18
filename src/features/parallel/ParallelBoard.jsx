import { useState, useMemo } from 'react';
import { useParallel } from './ParallelContext';
import { useApp } from '../../context/AppContext';
import ParallelChat from './ParallelChat';

const roleLabels = {
  shareStory: { label: 'Share My Story', icon: '📖', short: 'Sharing story' },
  shareAdvice: { label: 'Give Advice', icon: '💡', short: 'Giving advice' },
  hearStory: { label: 'Hear a Story', icon: '👂', short: 'Hearing story' },
  hearAdvice: { label: 'Get Advice', icon: '🤝', short: 'Getting advice' },
};

const roleOptions = [
  { value: 'shareStory', label: 'Share My Story', icon: '📖', desc: 'Your turn to talk, their turn to listen' },
  { value: 'shareAdvice', label: 'Give Advice', icon: '💡', desc: 'Share your wisdom with someone who needs it' },
  { value: 'hearStory', label: 'Hear a Story', icon: '👂', desc: 'Lend an ear to someone who needs to be heard' },
  { value: 'hearAdvice', label: 'Get Advice', icon: '🤝', desc: 'Seek guidance from someone who understands' },
];

function formatTime(ts) {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function ParallelBoard({ onClose }) {
  const { user } = useApp();
  const {
    getOpenListings, getMyListings, getPendingRequestsForListing,
    getAllRequests, createListing, requestToJoin,
    approveRequest, denyRequest,
    getNotifications, markNotificationsRead,
  } = useParallel();

  const [tab, setTab] = useState('browse');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [activeListings, setActiveListings] = useState(null);
  const [joinSuccess, setJoinSuccess] = useState(null);
  const [openChatId, setOpenChatId] = useState(null);

  const openListings = useMemo(() => getOpenListings(user.id), [getOpenListings, user.id]);
  const myListings = useMemo(() => getMyListings(user.id), [getMyListings, user.id]);
  const allRequests = useMemo(() => getAllRequests(), [getAllRequests]);
  const notifications = useMemo(() => getNotifications(user.id), [getNotifications, user.id]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  function handleCreatePost() {
    if (!newRole) return;
    createListing({ userId: user.id, userName: user.name, role: newRole, description: newDesc });
    setShowNewPost(false);
    setNewRole('');
    setNewDesc('');
    setTab('mine');
  }

  function handleRequestJoin(listingId) {
    requestToJoin({ listingId, userId: user.id, userName: user.name });
    setJoinSuccess(listingId);
    setTimeout(() => setJoinSuccess(null), 2000);
  }

  function handleApprove(requestId) {
    const thread = approveRequest(requestId);
    if (thread) {
      setOpenChatId(thread.id);
    }
  }

  function handleDeny(requestId) {
    denyRequest(requestId);
  }

  function handleViewRequests(listing) {
    setActiveListings(listing);
  }

  const pendingReqs = activeListings
    ? getPendingRequestsForListing(activeListings.id)
    : [];

  if (openChatId) {
    return (
      <ParallelChat
        threadId={openChatId}
        onClose={() => { setOpenChatId(null); setActiveListings(null); }}
      />
    );
  }

  if (activeListings) {
    return (
      <div className="parallel-modal-overlay" onClick={() => setActiveListings(null)}>
        <div className="parallel-board-modal" onClick={(e) => e.stopPropagation()}>
          <button className="parallel-modal-close" onClick={() => setActiveListings(null)} aria-label="Back">✕</button>
          <h2 className="parallel-board-subtitle">Requests for "{activeListings.description || roleLabels[activeListings.role]?.label}"</h2>

          {pendingReqs.length === 0 ? (
            <div className="parallel-board-empty">
              <p>No pending requests yet.</p>
            </div>
          ) : (
            <div className="parallel-board-reqs">
              {pendingReqs.map((req) => (
                <div key={req.id} className="parallel-board-req-card">
                  <div className="parallel-board-req-info">
                    <span className="parallel-board-req-name">{req.userName}</span>
                    <span className="parallel-board-req-time">{formatTime(req.createdAt)}</span>
                  </div>
                  <div className="parallel-board-req-actions">
                    <button className="parallel-board-approve" onClick={() => handleApprove(req.id)}>
                      Accept
                    </button>
                    <button className="parallel-board-deny" onClick={() => handleDeny(req.id)}>
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className="parallel-find-cancel" onClick={() => setActiveListings(null)} style={{ marginTop: 16, width: '100%' }}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="parallel-modal-overlay" onClick={onClose}>
      <div className="parallel-board-modal" onClick={(e) => e.stopPropagation()}>
        <button className="parallel-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="parallel-board-header">
          <h2>Parallel Board</h2>
          <p>Post what you are looking for, or browse others who are seeking a connection.</p>
        </div>

        {unreadCount > 0 && (
          <div className="parallel-board-notif-bar" onClick={() => { markNotificationsRead(); setTab('mine'); }}>
            <span>🔔</span>
            <span>{unreadCount} new {unreadCount === 1 ? 'notification' : 'notifications'}</span>
          </div>
        )}

        <div className="parallel-board-tabs">
          <button className={`parallel-board-tab ${tab === 'browse' ? 'active' : ''}`} onClick={() => setTab('browse')}>
            Browse ({openListings.length})
          </button>
          <button className={`parallel-board-tab ${tab === 'mine' ? 'active' : ''}`} onClick={() => setTab('mine')}>
            My Posts ({myListings.length})
          </button>
        </div>

        <div className="parallel-board-content">
          {tab === 'browse' ? (
            openListings.length === 0 ? (
              <div className="parallel-board-empty">
                <p>No one has posted yet. Be the first!</p>
              </div>
            ) : (
              <div className="parallel-board-list">
                {openListings.map((listing) => (
                  <div key={listing.id} className="parallel-board-card">
                    <div className="parallel-board-card-top">
                      <span className="parallel-board-card-icon">{roleLabels[listing.role]?.icon}</span>
                      <div className="parallel-board-card-info">
                        <span className="parallel-board-card-role">{roleLabels[listing.role]?.label}</span>
                        <span className="parallel-board-card-user">{listing.userName}</span>
                      </div>
                      <span className="parallel-board-card-time">{formatTime(listing.createdAt)}</span>
                    </div>
                    {listing.description && (
                      <p className="parallel-board-card-desc">{listing.description}</p>
                    )}
                    {joinSuccess === listing.id ? (
                      <span className="parallel-board-sent">Request sent ✓</span>
                    ) : (
                      <button className="parallel-board-join-btn" onClick={() => handleRequestJoin(listing.id)}>
                        Request to Join
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            <>
              <button className="parallel-board-new-btn" onClick={() => setShowNewPost(!showNewPost)}>
                {showNewPost ? '− Cancel' : '+ New Post'}
              </button>

              {showNewPost && (
                <div className="parallel-board-new-form">
                  <label className="parallel-prefs-label">What do you want to do?</label>
                  <div className="parallel-board-role-grid">
                    {roleOptions.map((opt) => (
                      <button
                        key={opt.value}
                        className={`parallel-prefs-card ${newRole === opt.value ? 'selected' : ''}`}
                        onClick={() => setNewRole(opt.value)}
                      >
                        <span className="parallel-prefs-card-icon">{opt.icon}</span>
                        <span className="parallel-prefs-card-label">{opt.label}</span>
                        <span className="parallel-prefs-card-desc">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="parallel-prefs-textarea"
                    placeholder="Describe what you want to talk about..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={3}
                    maxLength={300}
                  />
                  <button className="parallel-prefs-submit" onClick={handleCreatePost} disabled={!newRole}>
                    Post to Board
                  </button>
                </div>
              )}

              {myListings.length === 0 && !showNewPost ? (
                <div className="parallel-board-empty">
                  <p>You haven't posted anything yet.</p>
                </div>
              ) : (
                <div className="parallel-board-list">
                  {myListings.map((listing) => {
                    const reqs = allRequests.filter((r) => r.listingId === listing.id);
                    const pendingCount = reqs.filter((r) => r.status === 'pending').length;
                    return (
                      <div key={listing.id} className={`parallel-board-card ${listing.status === 'matched' ? 'matched' : ''}`}>
                        <div className="parallel-board-card-top">
                          <span className="parallel-board-card-icon">{roleLabels[listing.role]?.icon}</span>
                          <div className="parallel-board-card-info">
                            <span className="parallel-board-card-role">{roleLabels[listing.role]?.label}</span>
                            <span className={`parallel-board-card-status ${listing.status}`}>{listing.status}</span>
                          </div>
                          <span className="parallel-board-card-time">{formatTime(listing.createdAt)}</span>
                        </div>
                        {listing.description && (
                          <p className="parallel-board-card-desc">{listing.description}</p>
                        )}
                        <div className="parallel-board-card-bottom">
                          {pendingCount > 0 && (
                            <button className="parallel-board-reqs-btn" onClick={() => handleViewRequests(listing)}>
                              {pendingCount} pending {pendingCount === 1 ? 'request' : 'requests'}
                            </button>
                          )}
                          {reqs.filter((r) => r.status === 'approved').length > 0 && (
                            <span className="parallel-board-approved-label">
                              {reqs.filter((r) => r.status === 'approved').length} approved
                            </span>
                          )}
                          {reqs.filter((r) => r.status === 'denied').length > 0 && (
                            <span className="parallel-board-denied-label">
                              {reqs.filter((r) => r.status === 'denied').length} declined
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ParallelBoard;
