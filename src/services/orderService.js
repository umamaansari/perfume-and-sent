import { supabase } from '../lib/supabase';

const ORDERS_KEY = 'sns_orders';

const getLocalOrders = () => {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveLocalOrders = (orders) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const orderService = {
  async createOrder(userId, { items, total_amount, address, phone }) {
    if (!supabase || userId === 'dev-user') {
      const localOrders = getLocalOrders();
      const order = {
        id: Date.now(),
        user_id: userId,
        total_amount,
        address,
        phone,
        status: 'pending',
        created_at: new Date().toISOString(),
        order_items: items.map(item => ({
          id: Date.now() + Math.random(),
          product_id: item.id,
          name: item.name,
          price: item.price,
          size: item.size,
          quantity: item.quantity,
        })),
      };
      localOrders.push(order);
      saveLocalOrders(localOrders);
      return order;
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount,
        address,
        phone,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      name: item.name,
      price: item.price,
      size: item.size,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;
    return order;
  },

  async getOrders(userId) {
    if (!supabase || userId === 'dev-user') {
      return getLocalOrders().filter(o => o.user_id === userId);
    }
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getAllOrders() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*), users(name, email)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async updateOrderStatus(orderId, status) {
    if (!supabase) return;
    const localOrders = getLocalOrders();
    const order = localOrders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      saveLocalOrders(localOrders);
      return;
    }
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    if (error) throw error;
  },
};
