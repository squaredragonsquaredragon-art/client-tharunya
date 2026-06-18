import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcommerceStore } from '../../store/ecommerceStore';
import { usePaymentStore } from '../../store/paymentStore';
import { useNotification } from '../../context/NotificationContext';
import Loader from '../../components/common/Loader';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const Checkout = () => {
  const { cart, checkout, loading: ecommerceLoading } = useEcommerceStore();
  const { balance, sendMoney } = usePaymentStore();
  const { addToast } = useNotification();
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (paymentMethod === 'wallet') {
      if (balance < total) {
        addToast('Insufficient digital wallet funds. Please fund your Apex wallet.', 'error');
        setIsProcessing(false);
        return;
      }
      
      // Deduct from wallet
      const transferRes = await sendMoney('Sentinel E-Commerce', total, 'Order payment');
      if (!transferRes.success) {
        addToast(transferRes.error, 'error');
        setIsProcessing(false);
        return;
      }
    }

    // Process E-Commerce checkout
    const checkoutRes = await checkout();
    setIsProcessing(false);

    if (checkoutRes.success) {
      addToast(`Order transaction authorized! ID: ${checkoutRes.orderId}`, 'success');
      navigate('/payment'); // Redirect to transactions
    } else {
      addToast(checkoutRes.error, 'error');
    }
  };

  if (isProcessing || ecommerceLoading) return <Loader message="Quorum consensus processing transaction block..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>Secure Checkout Portal</h1>
        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '13px', marginTop: '4px' }}>
          Select secure payment channel to clear transactions.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '24px' }}>
        {/* Payment options */}
        <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Payment Channels</h3>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              {/* Wallet Select Option */}
              <label
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 16px',
                  borderRadius: 'var(--border-radius-sm)',
                  background: paymentMethod === 'wallet' ? 'rgba(0, 240, 255, 0.03)' : 'rgba(255,255,255,0.01)',
                  border: `1px solid ${paymentMethod === 'wallet' ? 'hsl(var(--accent-cyan))' : 'rgba(255,255,255,0.06)'}`,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'wallet'}
                  onChange={() => setPaymentMethod('wallet')}
                  style={{ accentColor: 'hsl(var(--accent-cyan))' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 700, fontSize: '13px' }}>Digital E-Wallet</span>
                  <span style={{ fontSize: '11px', color: 'hsl(var(--text-muted))' }}>Balance: {formatCurrency(balance)}</span>
                </div>
              </label>

              {/* Credit Card option */}
              <label
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 16px',
                  borderRadius: 'var(--border-radius-sm)',
                  background: paymentMethod === 'card' ? 'rgba(0, 240, 255, 0.03)' : 'rgba(255,255,255,0.01)',
                  border: `1px solid ${paymentMethod === 'card' ? 'hsl(var(--accent-cyan))' : 'rgba(255,255,255,0.06)'}`,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  style={{ accentColor: 'hsl(var(--accent-cyan))' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 700, fontSize: '13px' }}>Credit / Debit Card</span>
                  <span style={{ fontSize: '11px', color: 'hsl(var(--text-muted))' }}>Biometric verification</span>
                </div>
              </label>
            </div>

            {/* Credit Card inputs */}
            {paymentMethod === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', color: 'hsl(var(--text-secondary))' }}>Card Number</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4111 2222 3333 4444"
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', color: 'hsl(var(--text-secondary))' }}>Expiry date</label>
                    <input
                      type="text"
                      className="glass-input"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', color: 'hsl(var(--text-secondary))' }}>Security CVV</label>
                    <input
                      type="password"
                      className="glass-input"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="•••"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-premium"
            style={{ width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <ShieldCheck size={16} />
            Authorize Cryptoprocessing Payment ({formatCurrency(total)})
          </button>
        </form>

        {/* Pricing specs summary */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: 'fit-content' }}>
          <h3 style={{ margin: 0, fontSize: '16px' }}>Checkout Total</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            {cart.map((item) => (
              <div key={item.product.id} className="flex-between">
                <span style={{ color: 'hsl(var(--text-secondary))' }}>
                  {item.product.name} (x{item.quantity})
                </span>
                <span>{formatCurrency(item.product.price * item.quantity)}</span>
              </div>
            ))}
            <div className="flex-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', fontSize: '15px', fontWeight: 800 }}>
              <span>Total due</span>
              <span className="text-gradient-cyan">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
