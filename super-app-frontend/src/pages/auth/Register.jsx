import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useNotification } from '../../context/NotificationContext';
import { validateEmail, validatePassword, validateUsername } from '../../utils/validators';
import { Mail, Lock, User, UserCheck, Wallet, Clapperboard, ShoppingBag, ArrowLeft, Phone } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { register, loading } = useAuthStore();
  const { addToast } = useNotification();
  const navigate = useNavigate();
  const [activeApp, setActiveApp] = useState('all');

  useEffect(() => {
    const app = localStorage.getItem('sentinel_active_app') || 'all';
    setActiveApp(app);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateUsername(username)) {
      addToast('Username must be at least 3 alphanumeric characters.', 'warning');
      return;
    }
    if (!validateEmail(email)) {
      addToast('Please enter a valid email address.', 'warning');
      return;
    }
    if (!validatePassword(password) || password.length < 8) {
      addToast('Security password must be at least 8 characters.', 'warning');
      return;
    }

    const res = await register({
      username,
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
    });

    if (res.success) {
      addToast('Registration complete! Access credentials created in separate app datastore.', 'success');
      navigate('/login');
    } else {
      addToast(res.error, 'error');
    }
  };

  const getAppStyle = () => {
    switch (activeApp) {
      case 'payment':
        return {
          title: 'APEX PAY',
          subtitle: 'Create Secure Financial Wallet Keys',
          icon: <Wallet size={28} color="hsl(var(--accent-green))" />,
          accent: 'hsl(var(--accent-green))',
          glow: '0 0 20px rgba(0, 230, 118, 0.2)',
          buttonClass: 'btn-primary',
        };
      case 'instagram':
        return {
          title: 'INSTAGLANCE',
          subtitle: 'Join Secure Reels & Chats Stream',
          icon: <Clapperboard size={28} color="hsl(var(--accent-purple))" />,
          accent: 'hsl(var(--accent-purple))',
          glow: '0 0 20px rgba(189, 0, 255, 0.2)',
          buttonClass: 'btn-premium',
        };
      case 'ecommerce':
        return {
          title: 'SENTINEL STORE',
          subtitle: 'Create Elite Security Store Profile',
          icon: <ShoppingBag size={28} color="hsl(var(--accent-cyan))" />,
          accent: 'hsl(var(--accent-cyan))',
          glow: '0 0 20px rgba(0, 240, 255, 0.2)',
          buttonClass: 'btn-primary',
        };
      default:
        return {
          title: 'SENTINELAI',
          subtitle: 'Create General Sentinel Credentials',
          icon: <UserCheck size={28} color="hsl(var(--accent-cyan))" />,
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
        onClick={() => navigate('/login')}
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
      >
        <ArrowLeft size={14} />
        Back to Login
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
          {style.title} <span style={{ fontSize: '12px', color: style.accent, verticalAlign: 'super' }}>Register</span>
        </h2>
        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '13px', marginTop: '4px' }}>
          {style.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '12px', color: 'hsl(var(--text-secondary))' }}>Access Username</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="glass-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. cyber_sentinel"
              style={{ paddingLeft: '40px', fontSize: '13px', height: '40px' }}
              required
            />
            <User size={14} color="hsl(var(--text-muted))" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '12px', color: 'hsl(var(--text-secondary))' }}>Node Email Address</label>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              className="glass-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@domain.com"
              style={{ paddingLeft: '40px', fontSize: '13px', height: '40px' }}
              required
            />
            <Mail size={14} color="hsl(var(--text-muted))" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', color: 'hsl(var(--text-secondary))' }}>First Name</label>
            <input
              type="text"
              className="glass-input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Neo"
              style={{ fontSize: '13px', height: '40px' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', color: 'hsl(var(--text-secondary))' }}>Last Name</label>
            <input
              type="text"
              className="glass-input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Prime"
              style={{ fontSize: '13px', height: '40px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '12px', color: 'hsl(var(--text-secondary))' }}>
            WhatsApp Phone Number <span style={{ color: 'hsl(var(--accent-green))', fontSize: '10px' }}>📲 Security Alerts</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="tel"
              className="glass-input"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. +919876543210"
              style={{ paddingLeft: '40px', fontSize: '13px', height: '40px' }}
            />
            <Phone size={14} color="hsl(var(--accent-green))" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* WhatsApp Sandbox Join Button — appears when phone number is entered */}
          {phoneNumber.trim().length >= 10 && (
            <a
              href={`https://web.whatsapp.com/send?phone=14155238886&text=join%20point-fierce`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '6px',
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(37,211,102,0.18), rgba(37,211,102,0.08))',
                border: '1px solid rgba(37,211,102,0.4)',
                color: '#25d366',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 0 14px rgba(37,211,102,0.15)',
                animation: 'pulse-green 2s infinite',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37,211,102,0.28), rgba(37,211,102,0.18))';
                e.currentTarget.style.boxShadow = '0 0 24px rgba(37,211,102,0.3)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37,211,102,0.18), rgba(37,211,102,0.08))';
                e.currentTarget.style.boxShadow = '0 0 14px rgba(37,211,102,0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#25d366" style={{ flexShrink: 0 }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>📲 Click to Activate WhatsApp Alerts</span>
              <span style={{
                fontSize: '10px',
                opacity: 0.75,
                fontWeight: 400,
                background: 'rgba(37,211,102,0.15)',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid rgba(37,211,102,0.2)'
              }}>tap Send → done ✓</span>
            </a>
          )}

          <span style={{ fontSize: '10px', color: 'hsl(var(--text-muted))', paddingLeft: '2px' }}>
            🔒 One-time setup — get instant alerts when someone tries to hack your account
          </span>
        </div>


        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '12px', color: 'hsl(var(--text-secondary))' }}>Security Passphrase (min 8 chars)</label>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              className="glass-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ paddingLeft: '40px', fontSize: '13px', height: '40px' }}
              required
            />
            <Lock size={14} color="hsl(var(--text-muted))" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        <button
          type="submit"
          className={`btn ${style.buttonClass}`}
          style={{ width: '100%', marginTop: '10px', boxShadow: style.glow }}
          disabled={loading}
        >
          {loading ? 'Encrypting details...' : 'Generate App Access Key'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: 'hsl(var(--text-muted))' }}>
          Already have credentials?{' '}
          <Link to="/login" style={{ color: style.accent, fontWeight: 700 }}>
            Login Session
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
