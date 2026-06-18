// Mock E-Commerce Catalog & Checkout logic
import storageHelper from '../utils/storageHelper';

const PRODUCTS = [
  { id: 'prod_1', name: 'Sentinel AI Key Token', price: 120.00, rating: 4.9, category: 'Hardware Security', image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', desc: 'Secure FIDO2 physical hardware security key, custom engraved with the Sentinel laser brand. Waterproof, shockproof, and NFC compatible.' },
  { id: 'prod_2', name: 'Glassmorphic Cyber Shades', price: 299.00, rating: 4.8, category: 'Wearables', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', desc: 'Lightweight titanium smart eyewear with built-in AR notification screens, auto-polarizing glass layers, and 12-hour rechargeable batteries.' },
  { id: 'prod_3', name: 'Quantum Core Smart Watch', price: 450.00, rating: 4.7, category: 'Wearables', image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', desc: 'Sleek dark-alloy watch featuring real-time health diagnostics, dynamic threat alert widgets, and biometric payment authentication.' },
  { id: 'prod_4', name: 'Gridlock Tactical Backpack', price: 180.00, rating: 4.6, category: 'Apparel & Gear', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', desc: 'Anti-theft waterproof smart gear bag. Features dynamic solar charger panel, RFID blocking safe pockets, and 30L modular storage slots.' },
  { id: 'prod_5', name: 'Sentinel Neon Bomber Jacket', price: 240.00, rating: 4.9, category: 'Apparel & Gear', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', desc: 'Retro-futuristic lightweight windbreaker with fiber-optic active piping controllable via custom dashboard app.' }
];

export const ecommerceApi = {
  getProducts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(PRODUCTS), 400);
    });
  },

  getProductById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const prod = PRODUCTS.find(p => p.id === id);
        if (prod) resolve(prod);
        else reject(new Error('Product not found'));
      }, 300);
    });
  },

  getCategories: async () => {
    return ['All', 'Hardware Security', 'Wearables', 'Apparel & Gear'];
  },

  getCart: async () => {
    return storageHelper.get('sentinel_cart', []);
  },

  addToCart: async (product, quantity = 1) => {
    const cart = storageHelper.get('sentinel_cart', []);
    const existing = cart.find(item => item.product.id === product.id);
    
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }
    
    storageHelper.set('sentinel_cart', cart);
    return cart;
  },

  removeFromCart: async (productId) => {
    let cart = storageHelper.get('sentinel_cart', []);
    cart = cart.filter(item => item.product.id !== productId);
    storageHelper.set('sentinel_cart', cart);
    return cart;
  },

  updateQuantity: async (productId, quantity) => {
    const cart = storageHelper.get('sentinel_cart', []);
    const item = cart.find(item => item.product.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
    }
    storageHelper.set('sentinel_cart', cart);
    return cart;
  },

  checkout: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        storageHelper.set('sentinel_cart', []); // empty cart
        resolve({ success: true, orderId: `ord_${Date.now()}` });
      }, 1000);
    });
  }
};
