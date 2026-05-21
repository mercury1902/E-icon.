import { useState } from 'react';

function ProfileHeader({ user, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function startEdit() {
    setForm({ ...user });
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
  }

  function saveEdit() {
    onSave(form);
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="profile-header">
        <div className="cover-image">
          <img src={user.coverImage} alt="" />
        </div>
        <div className="profile-info">
          <img className="avatar" src={user.avatar} alt={user.name} />
          <div className="details">
            <div className="edit-field">
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange} />
            </div>
            <p className="username">@{user.username}</p>
            <div className="edit-field">
              <label>Bio</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} rows="3" />
            </div>
            <div className="meta">
              <div className="edit-field">
                <label>Location</label>
                <input name="location" value={form.location} onChange={handleChange} />
              </div>
              <div className="edit-field">
                <label>Website</label>
                <input name="website" value={form.website} onChange={handleChange} />
              </div>
              <span>📅 Joined {user.joinedDate}</span>
            </div>
          </div>
          <div className="edit-actions">
            <button className="save-btn" onClick={saveEdit}>Save</button>
            <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-header">
      <div className="cover-image">
        <img src={user.coverImage} alt="" />
      </div>
      <div className="profile-info">
        <img className="avatar" src={user.avatar} alt={user.name} />
        <div className="details">
          <h1 className="name">{user.name}</h1>
          <p className="username">@{user.username}</p>
          <p className="bio">{user.bio}</p>
          <div className="meta">
            <span>📍 {user.location}</span>
            <span>🔗 <a href={user.website} target="_blank" rel="noopener noreferrer">{user.website}</a></span>
            <span>📅 Joined {user.joinedDate}</span>
          </div>
        </div>
        <button className="edit-btn" onClick={startEdit}>Edit Profile</button>
      </div>
    </div>
  );
}

export default ProfileHeader;
