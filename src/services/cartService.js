import { supabase } from '../lib/supabase';
import { products as fallbackProducts } from '../data/products';

const CART_KEY = 'sns_cart';

const getLocalCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveLocalCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const cartService = {
  async getCart(userId) {
    if (!userId) return [];

    if (!supabase || userId === 'dev-user') {
      return getLocalCart()
        .filter(i => i.user_id === userId)
        .map(item => ({
          id: item.product_id,
          name: item.name,
          price: item.price,
          originalPrice: item.originalPrice,
          images: item.images,
          badge: item.badge,
          series: item.series,
          subtitle: item.subtitle,
          description: item.description,
          size: item.size,
          quantity: item.quantity,
          cart_item_id: item.cart_item_id || `${item.product_id}-${item.size}`,
        }));
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId);

    if (error) throw error;

    return (data || [])
      .filter(item => item.product)
      .map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: Number(item.product.price),
        originalPrice: Number(item.product.old_price),
        images:
          item.product.image_urls?.length > 0
            ? item.product.image_urls
            : item.product.image_url
              ? [item.product.image_url]
              : [],
        badge: item.product.product_type,
        series: item.product.series,
        subtitle: item.product.subtitle,
        description: item.product.description,
        size: item.size,
        quantity: item.quantity,
        cart_item_id: item.id,
      }));
  },

  async addItem(userId, productId, size, quantity = 1) {
    if (!userId) return;

    if (!supabase || userId === 'dev-user') {
      const localCart = getLocalCart();

      const existing = localCart.find(
        i => i.user_id === userId && i.product_id === productId && i.size === size
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        const product = fallbackProducts.find(p => p.id === productId);
        if (!product) return;

        localCart.push({
          user_id: userId,
          product_id: productId,
          size: size || product.sizes?.[0] || '',
          quantity,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          images: product.images,
          badge: product.badge,
          series: product.series,
          subtitle: product.subtitle,
          description: product.description,
          cart_item_id: `${productId}-${size || product.sizes?.[0] || ''}`,
        });
      }

      saveLocalCart(localCart);
      return;
    }

    const { data: existing, error: existingError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('size', size)
      .maybeSingle();

    if (existingError) throw existingError;

    if (existing) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id);

      if (error) throw error;
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .insert({
        user_id: userId,
        product_id: productId,
        size,
        quantity,
      });

    if (error) throw error;
  },

  async updateQuantity(cartItemId, quantity) {
    if (!cartItemId) return;

    if (quantity <= 0) {
      return this.removeItem(cartItemId);
    }

    if (String(cartItemId).includes('-')) {
      const localCart = getLocalCart();
      const item = localCart.find(i => i.cart_item_id === cartItemId);

      if (item) {
        item.quantity = quantity;
        saveLocalCart(localCart);
      }

      return;
    }

    if (!supabase) return;

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId);

    if (error) throw error;
  },

  async removeItem(cartItemId) {
    if (!cartItemId) return;

    if (String(cartItemId).includes('-')) {
      const localCart = getLocalCart();
      saveLocalCart(localCart.filter(i => i.cart_item_id !== cartItemId));
      return;
    }

    if (!supabase) return;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) throw error;
  },

  async clearCart(userId) {
    if (!userId) return;

    const localCart = getLocalCart();
    saveLocalCart(localCart.filter(i => i.user_id !== userId));

    if (!supabase || userId === 'dev-user') return;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  },
};