import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import {
  validateUsername,
  validatePassword,
  validateAge,
} from '../../lib/supabaseClient';

export default function RegistrationForm({ onSuccess, onSwitchToLogin }) {
  const { signUp } = useAuth();
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    email: '',
    age: '',
  });
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

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    const ageErr = validateAge(form.age);
    if (ageErr) newErrors.age = ageErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError(null);

    const result = await signUp({
      username: form.username.trim(),
      password: form.password,
      nickname: form.nickname.trim() || null,
      email: form.email.trim() || null,
      age: form.age || null,
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
      <h2 className="auth-form-title">Tạo tài khoản mới</h2>
      <p className="auth-form-subtitle">
        Tham gia cộng đồng ẩn danh Murmur
      </p>

      {serverError && (
        <div className="auth-error-banner" role="alert">
          {serverError}
        </div>
      )}

      <div className="auth-field">
        <label htmlFor="reg-username" className="auth-label">
          Tên người dùng <span className="required">*</span>
        </label>
        <input
          id="reg-username"
          name="username"
          className={`auth-input${errors.username ? ' has-error' : ''}`}
          type="text"
          placeholder="VD: calm_oak_92"
          value={form.username}
          onChange={handleChange}
          autoComplete="username"
          maxLength={30}
          aria-required="true"
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? 'reg-username-err' : undefined}
        />
        {errors.username && (
          <span id="reg-username-err" className="auth-error" role="alert">
            {errors.username}
          </span>
        )}
      </div>

      <div className="auth-field">
        <label htmlFor="reg-password" className="auth-label">
          Mật khẩu <span className="required">*</span>
        </label>
        <input
          id="reg-password"
          name="password"
          className={`auth-input${errors.password ? ' has-error' : ''}`}
          type="password"
          placeholder="Ít nhất 6 ký tự"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          aria-required="true"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'reg-password-err' : undefined}
        />
        {errors.password && (
          <span id="reg-password-err" className="auth-error" role="alert">
            {errors.password}
          </span>
        )}
      </div>

      <div className="auth-field">
        <label htmlFor="reg-confirm-password" className="auth-label">
          Xác nhận mật khẩu <span className="required">*</span>
        </label>
        <input
          id="reg-confirm-password"
          name="confirmPassword"
          className={`auth-input${errors.confirmPassword ? ' has-error' : ''}`}
          type="password"
          placeholder="Nhập lại mật khẩu"
          value={form.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          aria-required="true"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={
            errors.confirmPassword ? 'reg-confirm-err' : undefined
          }
        />
        {errors.confirmPassword && (
          <span id="reg-confirm-err" className="auth-error" role="alert">
            {errors.confirmPassword}
          </span>
        )}
      </div>

      <fieldset className="auth-fieldset">
        <legend className="auth-legend">Thông tin thêm (không bắt buộc)</legend>

        <div className="auth-field">
          <label htmlFor="reg-nickname" className="auth-label">
            Biệt danh
          </label>
          <input
            id="reg-nickname"
            name="nickname"
            className="auth-input"
            type="text"
            placeholder="Tên hiển thị tùy chọn"
            value={form.nickname}
            onChange={handleChange}
            maxLength={50}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="reg-email" className="auth-label">
            Email
          </label>
          <input
            id="reg-email"
            name="email"
            className="auth-input"
            type="email"
            placeholder="Để khôi phục mật khẩu (tùy chọn)"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </div>

        <div className="auth-field">
          <label htmlFor="reg-age" className="auth-label">
            Tuổi
          </label>
          <input
            id="reg-age"
            name="age"
            className={`auth-input${errors.age ? ' has-error' : ''}`}
            type="number"
            placeholder="Từ 13 đến 120"
            value={form.age}
            onChange={handleChange}
            min={13}
            max={120}
            aria-invalid={!!errors.age}
            aria-describedby={errors.age ? 'reg-age-err' : undefined}
          />
          {errors.age && (
            <span id="reg-age-err" className="auth-error" role="alert">
              {errors.age}
            </span>
          )}
        </div>
      </fieldset>

      <button
        className="auth-submit"
        type="submit"
        disabled={submitting}
      >
        {submitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
      </button>

      <p className="auth-switch">
        Đã có tài khoản?{' '}
        <button
          type="button"
          className="auth-link-btn"
          onClick={onSwitchToLogin}
        >
          Đăng nhập
        </button>
      </p>
    </form>
  );
}
