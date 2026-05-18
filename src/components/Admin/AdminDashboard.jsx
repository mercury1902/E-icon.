import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import * as adminService from '../../services/adminService';
import AdminUsers from './AdminUsers';
import AdminModeration from './AdminModeration';
import AdminActivity from './AdminActivity';
import AdminAnalytics from './AdminAnalytics';
import './AdminDashboard.css';

const SECTIONS = [
  { id: 'users', label: 'User Management', icon: '\u{1F465}' },
  { id: 'moderation', label: 'Content Moderation', icon: '\u{1F6E1}\u{FE0F}' },
  { id: 'comments', label: 'Comments', icon: '\u{1F4AC}' },
  { id: 'activity', label: 'Activity Log', icon: '\u{1F4C8}' },
  { id: 'analytics', label: 'Analytics', icon: '\u{1F4CA}' },
  { id: 'health', label: 'System Health', icon: '\u{2699}\u{FE0F}' },
];

export default function AdminDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);
  const [section, setSection] = useState('users');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const verify = async () => {
      if (authLoading) return;
      if (!user) {
        window.location.href = '/auth?returnUrl=/admin';
        return;
      }
      try {
        const admin = await adminService.checkAdmin(user);
        if (cancelled) return;
        setIsAdmin(admin);
        if (!admin) {
          window.location.href = '/';
          return;
        }
      } catch (e) {
        console.error('Admin check failed:', e);
      } finally {
        if (!cancelled) setChecking(false);
      }
    };
    verify();
    return () => { cancelled = true; };
  }, [user, authLoading]);

  const handleLogout = () => {
    signOut();
    window.location.href = '/';
  };

  if (checking || authLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <span>Verifying access...</span>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <span className="admin-logo-icon">M</span>
            <span className="admin-logo-text">Murmur</span>
          </div>
          <span className="admin-badge">Admin</span>
        </div>

        <nav className="admin-nav" aria-label="Admin navigation">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className={`admin-nav-item${section === s.id ? ' active' : ''}`}
              onClick={() => setSection(s.id)}
              aria-current={section === s.id ? 'page' : undefined}
            >
              <span className="admin-nav-icon" aria-hidden="true">{s.icon}</span>
              <span className="admin-nav-label">{s.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-nav-item admin-back-btn" onClick={() => window.location.href = '/'}>
            <span aria-hidden="true">{'\u{2190}'}</span>
            <span>Back to App</span>
          </button>
          <button className="admin-nav-item admin-logout-btn" onClick={handleLogout}>
            <span aria-hidden="true">{'\u{1F6AA}'}</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1 className="admin-title">
            {SECTIONS.find((s) => s.id === section)?.label || 'Dashboard'}
          </h1>
          <div className="admin-header-meta">
            <span className="admin-user-info">
              {user?.email?.split('@')[0] || 'admin'}
            </span>
          </div>
        </header>

        <div className="admin-content">
          {section === 'users' && <AdminUsers />}
          {section === 'moderation' && <AdminModeration type="posts" />}
          {section === 'comments' && <AdminModeration type="comments" />}
          {section === 'activity' && <AdminActivity />}
          {(section === 'analytics' || section === 'health') && (
            <AdminAnalytics defaultTab={section === 'health' ? 'health' : 'analytics'} />
          )}
        </div>
      </main>
    </div>
  );
}
