import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { MdEmail, MdLock, MdPerson, MdShield, MdVisibility, MdVisibilityOff, MdCheckCircle } from 'react-icons/md';

const Register = () => {
  const { register, isAuthenticated, isLoading } = useAuth();
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const passwordStrength = (p) => {
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strengthColor = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
  const strengthLabel = ['Weak', 'Fair', 'Good', 'Strong'];

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Username is required';
    else if (form.username.length < 3) e.username = 'Username must be at least 3 characters';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const { confirmPassword, ...payload } = form;
    await register(payload);
  };

  const strength = passwordStrength(form.password);

  return (
    <div className="auth-card" style={{ maxWidth: '460px' }}>
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
          <div style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)' }}>Security Monitor</div>
        </div>
      </div>

      <h1 className="auth-title" style={{ fontSize: '1.4rem' }}>Create Account</h1>
      <p className="auth-subtitle">Join the security monitoring platform</p>

      <form onSubmit={handleSubmit} noValidate>
        {/* Username */}
        <div className="form-group">
          <label className="form-label" htmlFor="reg-username">Username</label>
          <div className="form-input-icon">
            <span className="icon"><MdPerson /></span>
            <input
              id="reg-username"
              type="text"
              className="form-input"
              placeholder="Choose a username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              autoComplete="username"
            />
          </div>
          {errors.username && <div className="form-error">⚠ {errors.username}</div>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label" htmlFor="reg-email">Email Address</label>
          <div className="form-input-icon">
            <span className="icon"><MdEmail /></span>
            <input
              id="reg-email"
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
            />
          </div>
          {errors.email && <div className="form-error">⚠ {errors.email}</div>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label" htmlFor="reg-password">Password</label>
          <div className="form-input-icon" style={{ position: 'relative' }}>
            <span className="icon"><MdLock /></span>
            <input
              id="reg-password"
              type={showPass ? 'text' : 'password'}
              className="form-input"
              placeholder="Create a password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="new-password"
              style={{ paddingRight: '44px' }}
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-muted)', fontSize: '1rem', display: 'flex', alignItems: 'center' }}
            >
              {showPass ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
          </div>
          {/* Password strength */}
          {form.password && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} style={{
                    flex: 1, height: '3px', borderRadius: '2px',
                    background: i < strength ? strengthColor[strength - 1] : 'rgba(255,255,255,0.08)',
                    transition: 'background 0.3s ease'
                  }} />
                ))}
              </div>
              <div style={{ fontSize: '0.75rem', color: strength > 0 ? strengthColor[strength - 1] : 'var(--clr-text-muted)' }}>
                {strength > 0 ? strengthLabel[strength - 1] : 'Enter password'} password
              </div>
            </div>
          )}
          {errors.password && <div className="form-error">⚠ {errors.password}</div>}
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
          <div className="form-input-icon" style={{ position: 'relative' }}>
            <span className="icon">
              {form.confirmPassword && form.password === form.confirmPassword
                ? <MdCheckCircle style={{ color: 'var(--clr-accent-green)' }} />
                : <MdLock />
              }
            </span>
            <input
              id="reg-confirm"
              type={showConfirm ? 'text' : 'password'}
              className="form-input"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              autoComplete="new-password"
              style={{ paddingRight: '44px' }}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-muted)', fontSize: '1rem', display: 'flex', alignItems: 'center' }}
            >
              {showConfirm ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
          </div>
          {errors.confirmPassword && <div className="form-error">⚠ {errors.confirmPassword}</div>}
        </div>

        <Button type="submit" full isLoading={isLoading} size="lg" id="register-submit-btn">
          Create Account
        </Button>
      </form>

      <div className="auth-divider">
        <span>Already have an account?</span>
      </div>

      <Link to="/login">
        <Button variant="secondary" full size="lg" id="goto-login-btn">
          Sign In
        </Button>
      </Link>
    </div>
  );
};

export default Register;
