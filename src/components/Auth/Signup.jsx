import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp, signIn } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import { validateUsername, validatePassword, validateAge } from '../../lib/supabaseClient';
import './Auth.css';

export default function Signup() {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      navigate(isAdmin ? '/admin' : '/', { replace: true });
    }
  }, [user, isAdmin, authLoading, navigate]);

  if (authLoading || user) return null;

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const usernameErr = validateUsername(form.username);
    if (usernameErr) newErrors.username = usernameErr;

    const passwordErr = validatePassword(form.password);
    if (passwordErr) newErrors.password = passwordErr;
    else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    const ageErr = validateAge(form.age);
    if (ageErr) newErrors.age = ageErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setServerError('');

    try {
      await signUp({
        username: form.username.trim(),
        email: form.email.trim() || undefined,
        password: form.password,
        age: form.age,
      });
      try {
        await signIn({ username: form.username.trim(), password: form.password });
      } catch {
        // sign-in after signup may fail if auto-confirm hasn't propagated
        setServerError('Account created. Please try signing in.');
      }
    } catch (err) {
      if (err.message?.includes('already')) {
        setServerError('Tên người dùng này đã được đăng ký');
      } else {
        setServerError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">M</Link>
          <h1>Join Murmur</h1>
          <p className="auth-subtitle">Your anonymous wellbeing space</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {serverError && <div className="auth-server-error" role="alert">{serverError}</div>}

          <div className="auth-field">
            <label htmlFor="signup-username">Username</label>
            <input
              id="signup-username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              className={errors.username ? 'input-error' : ''}
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="signup-email">Email <span className="field-optional">(optional)</span></label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="signup-confirm">Confirm Password</label>
            <input
              id="signup-confirm"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'input-error' : ''}
            />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="signup-age">Age <span className="field-optional">(optional)</span></label>
            <input
              id="signup-age"
              name="age"
              type="number"
              min="13"
              max="120"
              placeholder="Your age"
              value={form.age}
              onChange={handleChange}
              className={errors.age ? 'input-error' : ''}
            />
            {errors.age && <span className="field-error">{errors.age}</span>}
          </div>

          <div className="auth-privacy-note">
            <span aria-hidden="true">{'\u{1F6E1}\u{FE0F}'}</span>
            Your identity is protected. We never store your real name or email.
          </div>

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create Anonymous Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
