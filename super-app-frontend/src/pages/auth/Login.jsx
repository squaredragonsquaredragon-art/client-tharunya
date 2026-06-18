import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useNotification } from '../../context/NotificationContext';
import { Mail, Lock, LogIn, ShieldAlert, Wallet, Clapperboard, ShoppingBag, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuthStore();
  const { addToast } = useNotification();
  const navigate = useNavigate();
  const [activeApp, setActiveApp] = useState('all');

  useEffect(() => {
    const app = localStorage.getItem('sentinel_active_app') || 'all';
    setActiveApp(app);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      addToast('Please enter both credentials.', 'warning');
      return;
    }

    const res = await login({ username, password });
    if (res.success) {
      addToast(`Session decrypted successfully. Welcome back, ${res.user.username}!`, 'success');
      
      if (res.user.role === 'admin') {
        navigate('/admin');
        return;
      }

      // Route directly to the respective App Front Page!
      if (activeApp === 'payment') {
        navigate('/payment');
      } else if (activeApp === 'instagram') {
        navigate('/reels');
      } else if (activeApp === 'ecommerce') {
        navigate('/ecommerce');
      } else {
        navigate('/');
      }
    } else {
      addToast(res.error, 'error');
      
      if (res.details?.mfa_required) {
        navigate('/otp-verification');
      } else if (res.details?.status === 'suspicious') {
        navigate('/suspicious-login');
      }
    }
  };

  const getAppStyle = () => {
    switch (activeApp) {
      case 'payment':
        return {
          title: 'APEX PAY',
          subtitle: 'Secure Decentralized Capital Ledger',
          icon: <Wallet size={28} color="hsl(var(--accent-green))" />,
          accent: 'hsl(var(--accent-green))',
          glow: '0 0 20px rgba(0, 230, 118, 0.2)',
          buttonClass: 'btn-primary', // uses primary gradient
        };
      case 'instagram':
        return {
          title: 'INSTAGLANCE',
          subtitle: 'Secure Peer Reels & Chat Stream',
          icon: <Clapperboard size={28} color="hsl(var(--accent-purple))" />,
          accent: 'hsl(var(--accent-purple))',
          glow: '0 0 20px rgba(189, 0, 255, 0.2)',
          buttonClass: 'btn-premium', // uses premium gradient
        };
      case 'ecommerce':
        return {
          title: 'SENTINEL STORE',
          subtitle: 'Elite Security Hardware Boutique',
          icon: <ShoppingBag size={28} color="hsl(var(--accent-cyan))" />,
          accent: 'hsl(var(--accent-cyan))',
          glow: '0 0 20px rgba(0, 240, 255, 0.2)',
          buttonClass: 'btn-primary',
        };
      default:
        return {
          title: 'SENTINELAI',
          subtitle: 'Secure Multi-App Dashboard Access',
          icon: <LogIn size={28} color="hsl(var(--accent-cyan))" />,
          accent: 'hsl(var(--accent-cyan))',
          glow: 'var(--neon-glow-cyan)',
          buttonClass: 'btn-primary',
        };
    }
  };

  const style = getAppStyle();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <button
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'hsl(var(--text-muted))',
          fontSize: '12px',
          fontWeight: 600,
          marginBottom: '10px'
        }}
        onClick={() => {
          localStorage.removeItem('sentinel_active_app');
          window.location.href = '/';
        }}
      >
        <ArrowLeft size={14} />
        Back to App Portal
      </button>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div
          style={{
            display: 'inline-flex',
            padding: '10px',
            borderRadius: 'var(--border-radius-sm)',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: '12px',
            boxShadow: style.glow
          }}
        >
          {style.icon}
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>
          {style.title} <span style={{ fontSize: '12px', color: style.accent, verticalAlign: 'super' }}>Access Portal</span>
        </h2>
        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '13px', marginTop: '4px' }}>
          {style.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'hsl(var(--text-secondary))' }}>
            Username or Node Email
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="glass-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter credentials..."
              style={{ paddingLeft: '44px' }}
              disabled={loading}
              required
            />
            <Mail
              size={16}
              color="hsl(var(--text-muted))"
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'hsl(var(--text-secondary))' }}>
            Security Passphrase
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              className="glass-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ paddingLeft: '44px' }}
              disabled={loading}
              required
            />
            <Lock
              size={16}
              color="hsl(var(--text-muted))"
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>
        </div>

        <button
          type="submit"
          className={`btn ${style.buttonClass}`}
          style={{ width: '100%', marginTop: '10px', boxShadow: style.glow }}
          disabled={loading}
        >
          {loading ? 'Validating credentials...' : 'Unlock Node Session'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: 'hsl(var(--text-muted))' }}>
          New node user?{' '}
          <Link to="/register" style={{ color: style.accent, fontWeight: 700 }}>
            Create secure credentials
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
