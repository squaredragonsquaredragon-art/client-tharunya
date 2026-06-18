import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcommerceStore } from '../../store/ecommerceStore';
import Loader from '../../components/common/Loader';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const ProductsList = () => {
  const { products, categories, activeCategory, setActiveCategory, fetchProducts, addToCart, loading } = useEcommerceStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  if (loading && products.length === 0) {
    return <Loader message="Accessing Sentinel secure e-commerce catalog..." size="large" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Page Header */}
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>Secure Smart Store</h1>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '13px', marginTop: '4px' }}>
            Browse physical hardware tokens, augmented wearables, and premium security gear.
          </p>
        </div>
        <button
          onClick={() => navigate('/ecommerce/cart')}
          className="btn btn-primary"
          style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ShoppingCart size={16} />
          View Shopping Cart
        </button>
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCategory(cat)}
            className="btn"
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              borderRadius: 'var(--border-radius-sm)',
              background: activeCategory === cat ? 'linear-gradient(135deg, hsl(var(--accent-cyan)), hsl(var(--accent-blue)))' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${activeCategory === cat ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
              color: activeCategory === cat ? '#000' : 'hsl(var(--text-secondary))',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all var(--transition-fast)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid-cols-3">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="glass-card premium"
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: 0,
              overflow: 'hidden',
              height: '100%',
              border: '1px solid rgba(255,255,255,0.05)',
              position: 'relative'
            }}
          >
            {/* Image Container */}
            <div style={{ width: '100%', height: '200px', position: 'relative', overflow: 'hidden' }}>
              <img
                src={prod.image}
                alt={prod.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(3, 7, 18, 0.75)',
                  backdropFilter: 'blur(4px)',
                  padding: '4px 8px',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'hsl(var(--accent-cyan))',
                  border: '1px solid rgba(0, 240, 255, 0.2)'
                }}
              >
                {prod.category}
              </span>
            </div>

            {/* Info details */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justify: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div className="flex-between">
                  <h3 style={{ fontSize: '16px', margin: 0, fontWeight: 700 }}>{prod.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'hsl(var(--accent-orange))' }}>
                    <Star size={12} fill="currentColor" />
                    <span>{prod.rating}</span>
                  </div>
                </div>
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'hsl(var(--text-primary))' }}>
                  {formatCurrency(prod.price)}
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <button
                  onClick={() => navigate(`/ecommerce/product/${prod.id}`)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Eye size={14} />
                  Inspect Specs
                </button>
                <button
                  onClick={() => addToCart(prod, 1)}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <ShoppingCart size={14} />
                  Secure Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
