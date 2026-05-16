import { supabase } from '../lib/supabase';
import { categories as fallbackCategories } from '../data/products';

export const categoryService = {
  async getAll() {
    if (!supabase) return fallbackCategories;
    try {
      const result = await Promise.race([
        supabase.from('categories').select('*').order('created_at'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
      ]);
      const { data, error } = result;
      if (error) throw error;
      return data && data.length > 0 ? data : fallbackCategories;
    } catch {
      return fallbackCategories;
    }
  },

  async getById(id) {
    if (!supabase) return fallbackCategories.find(c => c.id === id) || null;
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data || fallbackCategories.find(c => c.id === id) || null;
  },
};
