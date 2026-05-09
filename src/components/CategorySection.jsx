import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const HorizontalProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }}
      className="flex-shrink-0 w-44 md:w-56 bg-white rounded-2xl overflow-hidden shadow-sm card-hover group"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
            </div>
          )}
          {imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted">
              <ImageOff size={24} className="mb-1 opacity-50" />
              <span className="text-[10px]">Unavailable</span>
            </div>
          )}
          <img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } group-hover:scale-105`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
        </div>
        <div className="p-3">
          <h3 className="font-display font-bold text-sm mb-0.5 truncate">{product.name}</h3>
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={12}
                className={star <= Math.round(product.rating) ? 'fill-secondary text-secondary' : 'text-gray-200'}
              />
            ))}
          </div>
          <span className="text-sm font-bold">Rs. {product.price.toLocaleString()}</span>
        </div>
      </Link>
    </motion.div>
  );
};

const CategorySection = ({ category, products }) => {
  return (
    <section className="section-padding bg-cream">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-display font-bold mb-2">{category.name}</h2>
        <p className="text-muted text-sm">{category.description}</p>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
        {products.map((product) => (
          <HorizontalProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
