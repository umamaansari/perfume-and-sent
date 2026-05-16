import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroBanner from '../components/HeroBanner';
import ProductGrid from '../components/ProductGrid';
import CategorySection from '../components/CategorySection';
import ContactSection from '../components/ContactSection';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { categories as staticCategories } from '../data/products';

const withTimeout = (promise, ms = 5000) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);

const HomePage = () => {
  const navigate = useNavigate();
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState(staticCategories);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const [bestsellers, products, cats] = await Promise.all([
          withTimeout(productService.getBestsellers()),
          withTimeout(productService.getAll()),
          categoryService.getAll(),
        ]);
        if (cancelled) return;
        setBestSellers(bestsellers);
        setAllProducts(products);
        if (cats.length > 0) setCategories(cats);
      } catch (err) {
        if (!cancelled) console.error('Failed to load products:', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <HeroBanner />

      <ProductGrid
        products={bestSellers}
        title="BEST SELLER PERFUMES"
        onViewAll={() => navigate('/shop')}
      />

      {categories.map((category) => {
        const categoryProducts = allProducts.filter(p => p.series === category.id);
        if (categoryProducts.length === 0) return null;
        return (
          <CategorySection
            key={category.id}
            category={category}
            products={categoryProducts}
          />
        );
      })}

      <section className="section-padding bg-primary text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">Join Our Fragrance Family</h2>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            Subscribe to receive exclusive offers, new launches, and fragrance tips.
          </p>
          <div className="flex max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <button className="btn-secondary whitespace-nowrap">Subscribe</button>
          </div>
        </motion.div>
      </section>

      <ContactSection />
    </motion.main>
  );
};

export default HomePage;
