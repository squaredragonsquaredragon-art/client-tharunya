import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ecommerceApi } from '../../api/ecommerceApi';
import { useEcommerceStore } from '../../store/ecommerceStore';
import Loader from '../../components/common/Loader';
import { ArrowLeft, ShoppingCart, ShieldAlert } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useEcommerceStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProd = async () => {
      try {
        const data = await ecommerceApi.getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProd();
  }, [id]);

  if (loading) return <Loader message="Accessing hardware security blueprints..." />;
  if (!product) return <div style={{ color: 'hsl(var(--accent-red))', padding: '40px' }}>Blueprints quarantine. Node unreadable.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <button
        onClick={() => navigate('/ecommerce')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'hsl(var(--text-secondary))',
          fontWeight: 600,
          width: 'fit-content'
        }}
      >
        <ArrowLeft size={16} />
        Return to Catalog
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px' }}>
        {/* Left Side: Dynamic glassmorphic picture frame */}
        <div
          className="glass-card"
          style={{
            padding: 0,
            overflow: 'hidden',
            height: '420px',
            border: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Right Side: Specs list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'hsl(var(--accent-cyan))', textTransform: 'uppercase' }}>
              {product.category}
            </span>
            <h1 style={{ fontSize: '32px', margin: '4px 0 8px 0', fontWeight: 800 }}>{product.name}</h1>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'hsl(var(--text-primary))' }}>
              {formatCurrency(product.price)}
            </span>
          </div>

          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
            {product.desc}
          </p>

          {/* Secure validation warning card */}
          <div
            className="glass-panel"
            style={{
              padding: '16px',
              borderRadius: 'var(--border-radius-sm)',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              background: 'rgba(0, 240, 255, 0.02)',
              border: '1px solid rgba(0, 240, 255, 0.15)',
              fontSize: '12px',
            }}
          >
            <ShieldAlert size={18} color="hsl(var(--accent-cyan))" />
            <span style={{ color: 'hsl(var(--text-secondary))' }}>
              Purchases are cleared through instant wallet cryptoprocessing. MFA identity validation may trigger.
            </span>
          </div>

          <button
            onClick={() => {
              addToCart(product, 1);
              navigate('/ecommerce/cart');
            }}
            className="btn btn-primary animate-float"
            style={{ padding: '14px 28px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px', width: 'fit-content' }}
          >
            <ShoppingCart size={16} />
            Secure Order & Check Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
