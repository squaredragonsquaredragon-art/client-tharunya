import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f1b2e',
              color: '#e2e8f0',
              border: '1px solid rgba(56, 100, 180, 0.25)',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif',
              padding: '12px 16px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#0f1b2e' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#0f1b2e' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
