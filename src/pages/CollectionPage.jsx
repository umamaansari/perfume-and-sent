import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { products, categories } from '../data/products';

const CollectionPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const category = categories.find(c => c.id === type);
  const collectionProducts = products.filter(p => p.series === type);

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

      {collectionProducts.length === 0 ? (
        <div className="section-padding text-center">
          <p className="text-muted text-lg">No products in this collection yet</p>
        </div>
      ) : (
        <ProductGrid products={collectionProducts} title="" showViewAll={false} />
      )}
    </motion.main>
  );
};

export default CollectionPage;
