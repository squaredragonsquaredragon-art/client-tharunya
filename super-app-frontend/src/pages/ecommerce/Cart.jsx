import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcommerceStore } from '../../store/ecommerceStore';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const Cart = () => {
  const { cart, fetchCart, removeFromCart, updateQuantity } = useEcommerceStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>Secure Shopping Cart</h1>
        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '13px', marginTop: '4px' }}>
          Verify purchase inventory parameters before routing cryptoprocessing transactions.
        </p>
      </div>

      {cart.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Items list */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map((item) => (
              <div
                key={item.product.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '16px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)'
                }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 700 }}>{item.product.name}</span>
                    <span style={{ fontSize: '12px', color: 'hsl(var(--accent-cyan))' }}>
                      {formatCurrency(item.product.price)} each
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Quantity controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}
                    >
                      -
                    </button>
                    <span style={{ width: '24px', textAlign: 'center', fontSize: '14px', fontWeight: 600 }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    style={{ background: 'none', border: 'none', color: 'hsl(var(--accent-red))', cursor: 'pointer', padding: '6px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing summary */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Order summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div className="flex-between">
                <span style={{ color: 'hsl(var(--text-muted))' }}>Order Volume</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex-between">
                <span style={{ color: 'hsl(var(--text-muted))' }}>Biometric Crypto Clearing fee</span>
                <span style={{ color: 'hsl(var(--accent-green))' }}>FREE</span>
              </div>
              <div className="flex-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', fontSize: '16px', fontWeight: 800 }}>
                <span>Total Cost</span>
                <span className="text-gradient-cyan">{formatCurrency(subtotal)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/ecommerce/checkout')}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              Proceed to Check Out
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
          <ShoppingBag size={48} style={{ display: 'block', margin: '0 auto 16px auto', opacity: 0.3 }} />
          <h3>Shopping cart is empty.</h3>
        </div>
      )}
    </div>
  );
};

export default Cart;
