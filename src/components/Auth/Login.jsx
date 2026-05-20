import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signIn } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import { validateLoginIdentifier, validatePassword } from '../../lib/supabaseClient';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      navigate(isAdmin ? '/admin' : from, { replace: true });
    }
  }, [user, isAdmin, authLoading, navigate, from]);

  if (authLoading || user) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const usernameErr = validateLoginIdentifier(form.username);
    const passwordErr = validatePassword(form.password);
    if (usernameErr) newErrors.username = usernameErr;
    if (passwordErr) newErrors.password = passwordErr;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setServerError('');

    try {
      await signIn({ username: form.username.trim(), password: form.password });
    } catch (err) {
      setServerError(err.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">M</Link>
          <h1>Welcome back</h1>
          <p className="auth-subtitle">Sign in to Murmur</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {serverError && <div className="auth-server-error" role="alert">{serverError}</div>}

          <div className="auth-field">
            <label htmlFor="login-username">Username or Email</label>
            <input
              id="login-username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Enter your username or email"
              value={form.username}
              onChange={handleChange}
              className={errors.username ? 'input-error' : ''}
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
