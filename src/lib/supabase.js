import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Running without database.');
}

export { supabase };

export const transformProduct = (dbProduct) => ({
  id: dbProduct.id,
  name: dbProduct.name,
  subtitle: dbProduct.subtitle || '',
  badge: dbProduct.product_type || '',
  rating: dbProduct.rating || 0,
  reviews: dbProduct.reviews || 0,
  price: Number(dbProduct.price),
  originalPrice: Number(dbProduct.old_price),
  sizes: dbProduct.size || [],
  images: dbProduct.image_urls && dbProduct.image_urls.length > 0
    ? dbProduct.image_urls
    : dbProduct.image_url
      ? [dbProduct.image_url]
      : [],
  description: dbProduct.description || '',
  category: dbProduct.category || '',
  series: dbProduct.series || '',
  stock: dbProduct.stock || 0,
  color: dbProduct.color || '',
  created_at: dbProduct.created_at,
});

export const toDbProduct = (product) => ({
  name: product.name,
  subtitle: product.subtitle || '',
  description: product.description || '',
  price: Number(product.price),
  old_price: Number(product.originalPrice) || Number(product.price),
  category: product.category || '',
  product_type: product.badge || product.product_type || '',
  series: product.series || '',
  size: product.sizes || [],
  color: product.color || '',
  image_urls: Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : product.image_url
      ? [product.image_url]
      : [],
  stock: product.stock ?? 10,
  rating: product.rating || 0,
  reviews: product.reviews || 0,
});
