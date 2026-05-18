import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import './AuthPage.css';

export default function AuthPage({ onAuthenticated }) {
  const { user, loading } = useAuth();
  const [view, setView] = useState('login');
  const [animating, setAnimating] = useState(false);

  const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '/';

  useEffect(() => {
    if (user) {
      const target = onAuthenticated ? undefined : returnUrl;
      if (onAuthenticated) {
        onAuthenticated(user);
      } else {
        window.location.href = returnUrl;
      }
    }
  }, [user, onAuthenticated, returnUrl]);

  const handleAuthSuccess = () => {
    window.location.href = returnUrl;
  };

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-loading">
          <div className="auth-logo">
            <span className="auth-logo-icon">M</span>
            <span className="auth-logo-text">Murmur</span>
          </div>
          <div className="auth-spinner" aria-label="Đang tải..." />
        </div>
      </div>
    );
  }

  const switchView = (newView) => {
    if (newView === view) return;
    setAnimating(true);
    setTimeout(() => {
      setView(newView);
      setAnimating(false);
    }, 200);
  };

  return (
    <div className="auth-page">
      <div className={`auth-card${animating ? ' auth-fade' : ''}`}>
        <div className="auth-card-header">
          <div className="auth-logo">
            <span className="auth-logo-icon" aria-hidden="true">M</span>
            <span className="auth-logo-text">Murmur</span>
          </div>
          <p className="auth-tagline">
            Your Anonymous Wellbeing Space
          </p>
        </div>

        <div className="auth-card-body">
          <div className="auth-tabs" role="tablist" aria-label="Phương thức xác thực">
            <button
              className={`auth-tab${view === 'login' ? ' active' : ''}`}
              role="tab"
              aria-selected={view === 'login'}
              aria-controls="auth-panel"
              id="tab-login"
              onClick={() => switchView('login')}
            >
              Đăng nhập
            </button>
            <button
              className={`auth-tab${view === 'register' ? ' active' : ''}`}
              role="tab"
              aria-selected={view === 'register'}
              aria-controls="auth-panel"
              id="tab-register"
              onClick={() => switchView('register')}
            >
              Đăng ký
            </button>
          </div>

          <div
            id="auth-panel"
            role="tabpanel"
            aria-labelledby={view === 'login' ? 'tab-login' : 'tab-register'}
          >
            {view === 'login' ? (
              <LoginForm
                onSuccess={handleAuthSuccess}
                onSwitchToRegister={() => switchView('register')}
              />
            ) : (
              <RegistrationForm
                onSuccess={handleAuthSuccess}
                onSwitchToLogin={() => switchView('login')}
              />
            )}
          </div>
        </div>

        <div className="auth-card-footer">
          <span className="auth-footer-shield" aria-hidden="true">{'\u{1F6E1}\u{FE0F}'}</span>
          <p>
            Danh tính của bạn được bảo vệ. Chúng tôi không bao giờ lưu trữ
            thông tin cá nhân.
          </p>
        </div>
      </div>
    </div>
  );
}
