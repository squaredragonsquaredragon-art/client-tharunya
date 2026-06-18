import { create } from 'zustand';
import { ecommerceApi } from '../api/ecommerceApi';

export const useEcommerceStore = create((set, get) => ({
  products: [],
  categories: ['All'],
  activeCategory: 'All',
  cart: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const prods = await ecommerceApi.getProducts();
      const cats = await ecommerceApi.getCategories();
      set({ products: prods, categories: cats, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchCart: async () => {
    try {
      const items = await ecommerceApi.getCart();
      set({ cart: items });
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  },

  setActiveCategory: (cat) => {
    set({ activeCategory: cat });
  },

  addToCart: async (product, qty = 1) => {
    try {
      const updated = await ecommerceApi.addToCart(product, qty);
      set({ cart: updated });
    } catch (err) {
      console.error('Add to cart error:', err);
    }
  },

  removeFromCart: async (productId) => {
    try {
      const updated = await ecommerceApi.removeFromCart(productId);
      set({ cart: updated });
    } catch (err) {
      console.error('Remove from cart error:', err);
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      const updated = await ecommerceApi.updateQuantity(productId, quantity);
      set({ cart: updated });
    } catch (err) {
      console.error('Update quantity error:', err);
    }
  },

  checkout: async () => {
    set({ loading: true });
    try {
      const result = await ecommerceApi.checkout();
      set({ cart: [], loading: false });

      // Log activity to backend
      try {
        const { securityApi } = await import('../api/securityApi');
        await securityApi.logActivity({
          activity_type: 'Sentinel Store',
          action: 'Checkout Order',
          description: `Completed checkout for order ID: ${result.orderId}.`,
          source_app: 'ecommerce'
        });
      } catch (logErr) {
        console.error('Failed to log checkout activity:', logErr);
      }

      return { success: true, orderId: result.orderId };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  }

}));
