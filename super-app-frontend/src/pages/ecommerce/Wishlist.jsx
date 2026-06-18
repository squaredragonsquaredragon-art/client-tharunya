import React from 'react';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  return (
    <div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>
      <Heart size={48} color="hsl(var(--accent-red))" style={{ display: 'block', margin: '0 auto 16px auto' }} />
      <h2>Wishlist Catalog</h2>
      <p style={{ color: 'hsl(var(--text-secondary))', maxWidth: '400px', margin: '8px auto 0 auto', fontSize: '13px' }}>
        Store security gear you plan to deploy on your servers later.
      </p>
    </div>
  );
};

export default Wishlist;
