import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroBanner from '../components/HeroBanner';
import ProductGrid from '../components/ProductGrid';
import CategorySection from '../components/CategorySection';
import ContactSection from '../components/ContactSection';
import { products, categories } from '../data/products';

const HomePage = () => {
  const navigate = useNavigate();
  const bestSellers = products.filter(p => p.category === 'bestseller');

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
        const categoryProducts = products.filter(p => p.series === category.id);
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
