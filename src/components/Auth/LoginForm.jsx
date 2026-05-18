import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { validateUsername, validatePassword } from '../../lib/supabaseClient';

export default function LoginForm({ onSuccess, onSwitchToRegister }) {
  const { signIn } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (serverError) setServerError(null);
  };

  const validate = () => {
    const newErrors = {};
    const usernameErr = validateUsername(form.username);
    if (usernameErr) newErrors.username = usernameErr;

    const passwordErr = validatePassword(form.password);
    if (passwordErr) newErrors.password = passwordErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError(null);

    const result = await signIn({
      username: form.username.trim(),
      password: form.password,
    });

    setSubmitting(false);

    if (result.error) {
      setServerError(result.error);
    } else {
      onSuccess?.();
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <h2 className="auth-form-title">Đăng nhập</h2>
      <p className="auth-form-subtitle">
        Chào mừng bạn trở lại Murmur
      </p>

      {serverError && (
        <div className="auth-error-banner" role="alert">
          {serverError}
        </div>
      )}

      <div className="auth-field">
        <label htmlFor="login-username" className="auth-label">
          Tên người dùng <span className="required">*</span>
        </label>
        <input
          id="login-username"
          name="username"
          className={`auth-input${errors.username ? ' has-error' : ''}`}
          type="text"
          placeholder="Nhập tên người dùng"
          value={form.username}
          onChange={handleChange}
          autoComplete="username"
          aria-required="true"
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? 'login-username-err' : undefined}
        />
        {errors.username && (
          <span id="login-username-err" className="auth-error" role="alert">
            {errors.username}
          </span>
        )}
      </div>

      <div className="auth-field">
        <label htmlFor="login-password" className="auth-label">
          Mật khẩu <span className="required">*</span>
        </label>
        <input
          id="login-password"
          name="password"
          className={`auth-input${errors.password ? ' has-error' : ''}`}
          type="password"
          placeholder="Nhập mật khẩu"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          aria-required="true"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'login-password-err' : undefined}
        />
        {errors.password && (
          <span id="login-password-err" className="auth-error" role="alert">
            {errors.password}
          </span>
        )}
      </div>

      <button
        className="auth-submit"
        type="submit"
        disabled={submitting}
      >
        {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>

      <p className="auth-switch">
        Chưa có tài khoản?{' '}
        <button
          type="button"
          className="auth-link-btn"
          onClick={onSwitchToRegister}
        >
          Đăng ký
        </button>
      </p>
    </form>
  );
}
