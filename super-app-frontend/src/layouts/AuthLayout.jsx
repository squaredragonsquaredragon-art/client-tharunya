import React from 'react';
import { Outlet } from 'react-router-dom';
import { Shield } from 'lucide-react';
// CSS is imported globally in App.jsx — no need to re-import here

const AuthLayout = () => {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'center',
        /* Static multi-stop radial gradient replaces animated blur orbs — zero GPU cost */
        background: `
          radial-gradient(ellipse at 15% 20%, rgba(0, 240, 255, 0.06) 0%, transparent 45%),
          radial-gradient(ellipse at 85% 80%, rgba(139, 92, 246, 0.06) 0%, transparent 45%),
          radial-gradient(circle at center, #111827 0%, #030712 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
        padding: '20px',
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          zIndex: 10,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'var(--glass-shadow)',
          borderRadius: 'var(--border-radius-lg)',
          padding: '40px 32px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '12px',
              borderRadius: 'var(--border-radius-md)',
              background: 'rgba(0, 240, 255, 0.06)',
              border: '1px solid hsla(var(--accent-cyan), 0.2)',
              marginBottom: '16px',
              boxShadow: 'var(--neon-glow-cyan)',
            }}
          >
            <Shield size={32} color="hsl(var(--accent-cyan))" />
          </div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>SENTINEL<span className="text-gradient-cyan">AI</span></h1>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '13px', lineHeight: 1.6 }}>
            Autonomous login intelligence & secure user validation console.
          </p>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
