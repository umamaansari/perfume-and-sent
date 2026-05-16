import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

const CollectionPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [cat, prods] = await Promise.all([
          categoryService.getById(type),
          productService.getBySeries(type),
        ]);
        setCategory(cat || { id: type, name: type.charAt(0).toUpperCase() + type.slice(1), description: '' });
        setProducts(prods);
      } catch (err) {
        console.error('Failed to load collection:', err);
        setCategory(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [type]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="section-padding text-center">
        <p className="text-muted text-lg">Collection not found</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">Go Home</button>
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className="bg-primary text-white section-padding text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{category.name}</h1>
          <p className="text-white/60 max-w-md mx-auto">{category.description}</p>
        </motion.div>
      </section>

      {products.length === 0 ? (
        <div className="section-padding text-center">
          <p className="text-muted text-lg">No products in this collection yet</p>
        </div>
      ) : (
        <ProductGrid products={products} title="" showViewAll={false} />
      )}
    </motion.main>
  );
};

export default CollectionPage;
