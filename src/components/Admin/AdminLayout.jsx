import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/admin', label: 'Overview', icon: '\u{1F4CA}', end: true },
  { path: '/admin/users', label: 'Users', icon: '\u{1F465}' },
  { path: '/admin/posts', label: 'Posts', icon: '\u{1F4DD}' },
  { path: '/admin/comments', label: 'Comments', icon: '\u{1F4AC}' },
  { path: '/admin/reports', label: 'Reports', icon: '\u{1F6A8}' },
  { path: '/admin/activity', label: 'Activity Log', icon: '\u{1F4CB}' },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const isActive = (item) => {
    if (item.end) return location.pathname === '/admin';
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-logo">M</Link>
          <span className="admin-title">Admin</span>
        </div>

        <nav className="admin-nav" aria-label="Admin navigation">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item${isActive(item) ? ' active' : ''}`}
            >
              <span className="admin-nav-icon" aria-hidden="true">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-profile">
            <div className="admin-profile-avatar">
              {profile?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="admin-profile-info">
              <span className="admin-profile-name">{profile?.username || 'Admin'}</span>
              <span className="admin-profile-role">Administrator</span>
            </div>
          </div>
          <button className="admin-back-btn" onClick={() => navigate('/')}>
            {'\u{2190}'} Back to Site
          </button>
          <button className="admin-signout-btn" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-content-header">
          <h1 className="admin-page-title">
            {navItems.find((n) => isActive(n))?.label || 'Dashboard'}
          </h1>
        </header>
        <div className="admin-content-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
