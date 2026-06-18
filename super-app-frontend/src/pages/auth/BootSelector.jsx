import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ShieldCheck, Wallet, Clapperboard, ShoppingBag } from 'lucide-react';

const BootSelector = () => {
  const navigate = useNavigate();

  const handleSelectApp = (appType) => {
    // Save target app in localStorage
    localStorage.setItem('sentinel_active_app', appType);
    navigate('/login');
  };

  const apps = [
    {
      type: 'payment',
      name: 'Apex Pay',
      desc: 'Secure high-end digital wallet & financial ledger operations console.',
      icon: <Wallet size={36} color="hsl(var(--accent-green))" />,
      glow: '0 0 30px rgba(0, 230, 118, 0.15)',
      borderColor: 'hsla(var(--accent-green), 0.15)',
      themeClass: 'theme-pay'
    },
    {
      type: 'instagram',
      name: 'InstaGlance',
      desc: 'Encrypted social media network. View short reels & active chat logs.',
      icon: <Clapperboard size={36} color="hsl(var(--accent-purple))" />,
      glow: '0 0 30px rgba(189, 0, 255, 0.15)',
      borderColor: 'hsla(var(--accent-purple), 0.15)',
      themeClass: 'theme-social'
    },
    {
      type: 'ecommerce',
      name: 'Sentinel Store',
      desc: 'Elite hardware-security boutique storefront & checkout operations.',
      icon: <ShoppingBag size={36} color="hsl(var(--accent-cyan))" />,
      glow: '0 0 30px rgba(0, 240, 255, 0.15)',
      borderColor: 'hsla(var(--accent-cyan), 0.15)',
      themeClass: 'theme-store'
    }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100vw',
        background: 'radial-gradient(circle at center, #0c0f16 0%, #020408 100%)',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Static glow panels — no blur filter or animation (was blur(50px) + float, very heavy) */}
      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.04) 0%, transparent 65%)',
          top: '-15%',
          left: '-15%',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(189, 0, 255, 0.04) 0%, transparent 65%)',
          bottom: '-15%',
          right: '-15%',
          pointerEvents: 'none'
        }}
      />

      <div style={{ textAlign: 'center', marginBottom: '40px', zIndex: 10 }} className="animate-fade-in">
        <div
          style={{
            display: 'inline-flex',
            padding: '12px',
            borderRadius: 'var(--border-radius-md)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '16px',
            boxShadow: 'var(--glass-shadow)'
          }}
        >
          <ShieldCheck size={32} color="hsl(var(--accent-cyan))" style={{ animation: 'spinSlow 16s linear infinite', willChange: 'transform' }} />
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
          Anu<span className="text-gradient-cyan">AI</span>
        </h1>
        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '14px', marginTop: '6px', maxWidth: '460px', lineHeight: 1.6 }}>
          Select secure micro-application gateway node. Separate credentials and datastores apply.
        </p>
      </div>

      {/* Grid selector cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 320px))',
          gap: '24px',
          zIndex: 10,
          width: '100%',
          maxWidth: '1024px',
          justifyContent: 'center'
        }}
        className="animate-slide-up"
      >
        {apps.map((app) => (
          <div
            key={app.type}
            onClick={() => handleSelectApp(app.type)}
            className="glass-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              cursor: 'pointer',
              border: `1px solid ${app.borderColor}`,
              boxShadow: app.glow,
              padding: '32px 24px',
              transition: 'all var(--transition-normal)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = app.borderColor;
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                padding: '16px',
                borderRadius: 'var(--border-radius-md)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                width: 'fit-content'
              }}
            >
              {app.icon}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>{app.name}</h2>
              <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                {app.desc}
              </p>
            </div>

            <div
              style={{
                marginTop: 'auto',
                fontSize: '13px',
                fontWeight: 700,
                color: 'hsl(var(--accent-cyan))',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              Boot Gateway →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BootSelector;
