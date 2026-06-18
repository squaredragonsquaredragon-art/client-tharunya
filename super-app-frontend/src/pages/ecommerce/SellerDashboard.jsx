import React from 'react';
import { ShoppingBag } from 'lucide-react';

const SellerDashboard = () => {
  return (
    <div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>
      <ShoppingBag size={48} color="hsl(var(--accent-purple))" style={{ display: 'block', margin: '0 auto 16px auto' }} />
      <h2>Seller Terminal</h2>
      <p style={{ color: 'hsl(var(--text-secondary))', maxWidth: '400px', margin: '8px auto 0 auto', fontSize: '13px' }}>
        Add new products to the secure catalog, track store orders, and monitor sales metrics.
      </p>
    </div>
  );
};

export default SellerDashboard;
