import { supabase, transformProduct } from '../lib/supabase';
import { products as fallbackProducts } from '../data/products';
import { getLocal, setLocal } from '../lib/localStore';

const PRODUCTS_CACHE_KEY = 'sns_products_cache';

const applyFilters = (result, { search, category, series, maxPrice, isNew, isGifting, sortBy } = {}) => {
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q)
    );
  }
  if (category) {
    if (['oud', 'bundles', 'testers', 'bath', 'signature', 'dessert'].includes(category)) {
      result = result.filter(p => p.series === category);
    } else {
      result = result.filter(p => p.badge.toLowerCase() === category);
    }
  }
  if (series) result = result.filter(p => p.series === series);
  if (maxPrice) result = result.filter(p => p.price <= Number(maxPrice));
  if (isNew) result = result.filter(p => p.category === 'new');
  if (isGifting) {
    result = result.filter(p => p.category === 'bestseller' || p.subtitle.includes('Limited') || p.subtitle.includes('Exclusive'));
  }
  if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
  else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
  return result;
};

export const productService = {
  async getAll() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id');
        if (!error && data && data.length > 0) {
          const products = data.map(transformProduct);
          setLocal(PRODUCTS_CACHE_KEY, products);
          return products;
        }
      } catch {
        // fallback
      }
    }
    const cached = getLocal(PRODUCTS_CACHE_KEY);
    return cached || fallbackProducts;
  },

  async getById(id) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', Number(id))
          .maybeSingle();
        if (!error && data) return transformProduct(data);
      } catch {
        // fallback
      }
    }
    const cached = getLocal(PRODUCTS_CACHE_KEY);
    const all = cached || fallbackProducts;
    return all.find(p => p.id === Number(id)) || null;
  },

  async getBySeries(series) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('series', series);
        if (!error && data && data.length > 0) return data.map(transformProduct);
      } catch {
        // fallback
      }
    }
    const cached = getLocal(PRODUCTS_CACHE_KEY);
    const all = cached || fallbackProducts;
    return all.filter(p => p.series === series);
  },

  async getBestsellers() {
    const all = await this.getAll();
    return all.filter(p => p.category === 'bestseller');
  },

  async getFiltered(filters = {}) {
    const all = await this.getAll();
    return applyFilters([...all], filters);
  },
};
