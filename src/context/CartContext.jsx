/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../services/cartService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const lastUserId = useRef(null);

  const fetchCart = useCallback(async () => {
    if (!user?.id) {
      setCart([]);
      return;
    }

    try {
      setIsLoading(true);
      const items = await cartService.getCart(user.id);
      setCart(items || []);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (lastUserId.current !== user?.id) {
      lastUserId.current = user?.id || null;
      fetchCart();
    }
  }, [user, fetchCart]);

  const addToCart = async (product, size) => {
    if (!user?.id || !product?.id) return;

    try {
      await cartService.addItem(user.id, product.id, size);
      await fetchCart();
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const removeFromCart = async (productId, size) => {
    if (!user?.id) return;

    const item = cart.find(i => i.id === productId && i.size === size);
    if (!item?.cart_item_id) return;

    try {
      await cartService.removeItem(item.cart_item_id);
      await fetchCart();
    } catch (err) {
      console.error('Failed to remove from cart:', err);
    }
  };

  const updateQuantity = async (productId, size, quantity) => {
    if (!user?.id) return;

    const item = cart.find(i => i.id === productId && i.size === size);
    if (!item?.cart_item_id) return;

    try {
      await cartService.updateQuantity(item.cart_item_id, quantity);
      await fetchCart();
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const clearCart = async () => {
    if (!user?.id) return;

    try {
      await cartService.clearCart(user.id);
      setCart([]);
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        isCartOpen,
        setIsCartOpen,
        isLoading,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);