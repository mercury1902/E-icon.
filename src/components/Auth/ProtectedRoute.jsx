import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="auth-error-page">
        <span className="auth-error-icon">{'\u{1F6AB}'}</span>
        <h1>Access Denied</h1>
        <p>You do not have permission to access this area.</p>
        <a href="/" className="auth-error-link">Return to Home</a>
      </div>
    );
  }

  return children;
}
