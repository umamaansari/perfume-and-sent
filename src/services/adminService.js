import { supabase } from '../lib/supabase';
import { getLocal, setLocal } from '../lib/localStore';

const PRODUCTS_CACHE_KEY = 'sns_products_cache';

const getLocalProducts = () => getLocal(PRODUCTS_CACHE_KEY) || [];
const saveLocalProducts = (products) => setLocal(PRODUCTS_CACHE_KEY, products);
const nextId = (products) => products.reduce((max, p) => Math.max(max, p.id || 0), 0) + 1;

const toFrontendProduct = (form, id) => ({
  id,
  name: form.name,
  subtitle: form.subtitle || '',
  badge: form.productType || 'UNISEX',
  rating: Number(form.rating) || 0,
  reviews: Number(form.reviews) || 0,
  price: Number(form.price),
  originalPrice: Number(form.originalPrice) || Number(form.price),
  sizes: form.sizes || [],
  images: form.imageUrl ? [form.imageUrl] : [],
  description: form.description || '',
  category: form.category || 'bestseller',
  series: form.series || 'signature',
  stock: Number(form.stock) || 10,
  color: form.color || '',
});

export const adminService = {
  async addProduct(product) {
    if (supabase) {
      const dbProduct = {
        name: product.name,
        subtitle: product.subtitle || '',
        description: product.description || '',
        price: Number(product.price),
        old_price: Number(product.originalPrice) || Number(product.price),
        category: product.category || '',
        product_type: product.productType || '',
        series: product.series || '',
        size: product.sizes || [],
        color: product.color || '',
        image_urls: product.imageUrl ? [product.imageUrl] : [],
        stock: Number(product.stock) || 10,
        rating: Number(product.rating) || 0,
        reviews: Number(product.reviews) || 0,
      };
      const { data, error } = await supabase
        .from('products')
        .insert(dbProduct)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const products = getLocalProducts();
    const id = nextId(products);
    products.push(toFrontendProduct(product, id));
    saveLocalProducts(products);
    return { id };
  },

  async updateProduct(id, product) {
    if (supabase) {
      const dbProduct = {};
      if (product.name !== undefined) dbProduct.name = product.name;
      if (product.subtitle !== undefined) dbProduct.subtitle = product.subtitle;
      if (product.description !== undefined) dbProduct.description = product.description;
      if (product.price !== undefined) dbProduct.price = Number(product.price);
      if (product.originalPrice !== undefined) dbProduct.old_price = Number(product.originalPrice);
      if (product.category !== undefined) dbProduct.category = product.category;
      if (product.productType !== undefined) dbProduct.product_type = product.productType;
      if (product.series !== undefined) dbProduct.series = product.series;
      if (product.sizes !== undefined) dbProduct.size = product.sizes;
      if (product.color !== undefined) dbProduct.color = product.color;
      if (product.imageUrl !== undefined) dbProduct.image_urls = [product.imageUrl];
      if (product.stock !== undefined) dbProduct.stock = Number(product.stock);
      if (product.rating !== undefined) dbProduct.rating = Number(product.rating);
      if (product.reviews !== undefined) dbProduct.reviews = Number(product.reviews);

      const { data, error } = await supabase
        .from('products')
        .update(dbProduct)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const products = getLocalProducts();
    const idx = products.findIndex(p => p.id === Number(id));
    if (idx === -1) throw new Error('Product not found');
    Object.assign(products[idx], toFrontendProduct(product, Number(id)));
    saveLocalProducts(products);
  },

  async deleteProduct(id) {
    if (supabase) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return;
    }
    const products = getLocalProducts();
    saveLocalProducts(products.filter(p => p.id !== Number(id)));
  },

  async getAllUsers() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async updateUserRole(userId, role) {
    if (!supabase) return;
    const { error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId);
    if (error) throw error;
  },

  async deleteUser(userId) {
    if (!supabase) throw new Error('Database not connected');
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    if (error) throw error;
  },

  async getAllAddresses() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('orders')
      .select('address, phone, user_id, created_at, users(name, email)')
      .not('address', 'is', null)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};
