import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div
      className="auth-layout"
      style={{
        /* Static ambient gradient replaces animated orbs — zero GPU overhead */
        background: `
          radial-gradient(ellipse at 20% 30%, rgba(59,130,246,0.07) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 75%, rgba(139,92,246,0.07) 0%, transparent 50%),
          var(--gradient-hero)
        `
      }}
    >
      <Outlet />
    </div>
  );
};

export default AuthLayout;
