import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp, signIn } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import { validateUsername, validatePassword, validateAge, validateEmail, checkUsernameExists, checkEmailExists, verifyEmailExternal } from '../../lib/supabaseClient';
import { useDebounce } from '../../hooks/useDebounce';
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

  // States cho việc xác thực bất đồng bộ (async validation)
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);

  // Debounced values
  const debouncedUsername = useDebounce(form.username, 500);
  const debouncedEmail = useDebounce(form.email, 500);

  // Kiểm tra trùng lặp Username
  useEffect(() => {
    const checkUsername = async () => {
      const trimmed = debouncedUsername.trim();
      // Nếu có lỗi đồng bộ, không kiểm tra database
      const syncErr = validateUsername(trimmed);
      if (syncErr) {
        setUsernameTaken(false);
        return;
      }

      setCheckingUsername(true);
      setUsernameTaken(false);
      try {
        const exists = await checkUsernameExists(trimmed);
        setUsernameTaken(exists);
      } catch (err) {
        console.error('Lỗi khi check username trùng lặp:', err);
      } finally {
        setCheckingUsername(false);
      }
    };

    checkUsername();
  }, [debouncedUsername]);

  // Kiểm tra trùng lặp và xác thực Email
  useEffect(() => {
    const checkEmail = async () => {
      const trimmed = debouncedEmail.trim();
      // Nếu rỗng hoặc có lỗi đồng bộ, không kiểm tra database
      if (!trimmed) {
        setEmailTaken(false);
        setErrors((prev) => ({ ...prev, email: '' }));
        return;
      }
      const syncErr = validateEmail(trimmed);
      if (syncErr) {
        setEmailTaken(false);
        setErrors((prev) => ({ ...prev, email: syncErr }));
        return;
      }

      setCheckingEmail(true);
      setEmailTaken(false);
      setErrors((prev) => ({ ...prev, email: '' }));

      try {
        // 1. Gọi dịch vụ xác thực ngoài trước (Disify / Abstract API)
        const externalErr = await verifyEmailExternal(trimmed);
        if (externalErr) {
          setErrors((prev) => ({ ...prev, email: externalErr }));
          return;
        }

        // 2. Nếu email thật, kiểm tra trùng lặp trong database
        const exists = await checkEmailExists(trimmed);
        setEmailTaken(exists);
      } catch (err) {
        console.error('Lỗi khi check email trùng lặp:', err);
      } finally {
        setCheckingEmail(false);
      }
    };

    checkEmail();
  }, [debouncedEmail]);

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

    // Giữ lại lỗi email được phát hiện từ trước đó bởi dịch vụ ngoài
    const emailErr = validateEmail(form.email) || errors.email;
    if (emailErr) newErrors.email = emailErr;

    // Chặn submit nếu đang kiểm tra trùng lặp hoặc đã phát hiện trùng lặp
    if (checkingUsername || checkingEmail) {
      setServerError('Đang kiểm tra thông tin tài khoản, vui lòng đợi...');
      return;
    }

    if (usernameTaken) {
      newErrors.username = 'Username already exists';
    }

    if (emailTaken) {
      newErrors.email = 'Email này đã được sử dụng bởi tài khoản khác';
    }

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
        setServerError('Username already exists');
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
              className={errors.username || usernameTaken ? 'input-error' : (form.username.trim() && !validateUsername(form.username) && !checkingUsername && !usernameTaken ? 'input-success' : '')}
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
            {!errors.username && usernameTaken && <span className="field-error">Username already exists</span>}
            {!errors.username && !usernameTaken && checkingUsername && (
              <span className="field-checking">
                <span className="field-checking-spinner" /> Đang kiểm tra tên người dùng...
              </span>
            )}
            {!errors.username && !usernameTaken && !checkingUsername && form.username.trim() && !validateUsername(form.username) && (
              <span className="field-success">✓ Tên người dùng hợp lệ và khả dụng</span>
            )}
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
              className={errors.email || emailTaken ? 'input-error' : (form.email.trim() && !validateEmail(form.email) && !checkingEmail && !emailTaken ? 'input-success' : '')}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
            {!errors.email && emailTaken && <span className="field-error">Email này đã được sử dụng bởi tài khoản khác</span>}
            {!errors.email && !emailTaken && checkingEmail && (
              <span className="field-checking">
                <span className="field-checking-spinner" /> Đang kiểm tra email...
              </span>
            )}
            {!errors.email && !emailTaken && !checkingEmail && form.email.trim() && !validateEmail(form.email) && (
              <span className="field-success">✓ Email hợp lệ và khả dụng</span>
            )}
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

          <button type="submit" className="auth-submit" disabled={submitting || checkingUsername || checkingEmail}>
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
