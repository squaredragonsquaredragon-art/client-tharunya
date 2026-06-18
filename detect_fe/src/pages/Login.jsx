import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { MdEmail, MdLock, MdShield, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { FiActivity } from 'react-icons/fi';

const Login = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Username or email is required';
    if (!form.password) e.password = 'Password is required';
    if (form.password && form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await login(form);
  };

  return (
    <div className="auth-card">
      {/* Logo */}
      <div className="auth-logo">
        <div style={{
          width: '48px', height: '48px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          borderRadius: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 30px rgba(59,130,246,0.4)',
        }}>
          <MdShield style={{ color: 'white', fontSize: '26px' }} />
        </div>
        <div>
          <div style={{
            fontSize: '1.3rem', fontWeight: 800,
            background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>SentinelAI</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)', marginTop: '1px' }}>
            Security Monitor
          </div>
        </div>
      </div>

      <h1 className="auth-title" style={{ fontSize: '1.4rem' }}>Welcome Back</h1>
      <p className="auth-subtitle">Sign in to your security dashboard</p>

      <form onSubmit={handleSubmit} noValidate>
        {/* Username */}
        <div className="form-group">
          <label className="form-label" htmlFor="login-username">Username or Email</label>
          <div className="form-input-icon">
            <span className="icon"><MdEmail /></span>
            <input
              id="login-username"
              type="text"
              className="form-input"
              placeholder="Enter username or email"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              autoComplete="username"
            />
          </div>
          {errors.username && <div className="form-error">⚠ {errors.username}</div>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label" htmlFor="login-password">Password</label>
          <div className="form-input-icon" style={{ position: 'relative' }}>
            <span className="icon"><MdLock /></span>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
              style={{ paddingRight: '44px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: '14px', top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--clr-text-muted)', fontSize: '1rem',
                display: 'flex', alignItems: 'center',
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
          </div>
          {errors.password && <div className="form-error">⚠ {errors.password}</div>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--clr-accent-blue)', cursor: 'pointer' }}>
            Forgot password?
          </span>
        </div>

        <Button type="submit" full isLoading={isLoading} size="lg" id="login-submit-btn">
          Sign In
        </Button>
      </form>

      <div className="auth-divider">
        <span>New to SentinelAI?</span>
      </div>

      <Link to="/register">
        <Button variant="secondary" full size="lg" id="goto-register-btn">
          Create an Account
        </Button>
      </Link>

      {/* Demo hint */}
      <div style={{
        marginTop: '20px', padding: '12px 16px',
        background: 'rgba(59,130,246,0.06)',
        border: '1px solid rgba(59,130,246,0.15)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.8rem', color: 'var(--clr-text-muted)',
        display: 'flex', alignItems: 'center', gap: '8px'
      }}>
        <FiActivity style={{ color: 'var(--clr-accent-blue)', flexShrink: 0 }} />
        <span>Protected by multi-layer AI anomaly detection & real-time monitoring</span>
      </div>
    </div>
  );
};

export default Login;
