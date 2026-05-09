import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={star <= Math.round(rating) ? 'fill-secondary text-secondary' : 'text-gray-200'}
        />
      ))}
    </div>
  );
};

const badgeStyles = {
  UNISEX: { bg: 'bg-purple-100/90 backdrop-blur-sm', text: 'text-purple-700' },
  WOMEN: { bg: 'bg-rose-100/90 backdrop-blur-sm', text: 'text-rose-700' },
  MEN: { bg: 'bg-sky-100/90 backdrop-blur-sm', text: 'text-sky-700' },
  BUNDLE: { bg: 'bg-amber-100/90 backdrop-blur-sm', text: 'text-amber-700' },
  TESTER: { bg: 'bg-teal-100/90 backdrop-blur-sm', text: 'text-teal-700' },
  BODY: { bg: 'bg-emerald-100/90 backdrop-blur-sm', text: 'text-emerald-700' },
};

const gradientOverlays = {
  signature: 'from-violet-500/5 via-transparent to-amber-500/5',
  oud: 'from-amber-900/10 via-transparent to-amber-600/5',
  dessert: 'from-rose-400/5 via-transparent to-pink-300/5',
  bundles: 'from-amber-400/5 via-transparent to-yellow-300/5',
  testers: 'from-gray-400/5 via-transparent to-slate-300/5',
  bath: 'from-emerald-400/5 via-transparent to-teal-300/5',
};

const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const badge = badgeStyles[product.badge] || { bg: 'bg-gray-100/90 backdrop-blur-sm', text: 'text-gray-700' };
  const gradient = gradientOverlays[product.series] || gradientOverlays.signature;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-500 group cursor-pointer"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
            </div>
          )}

          {imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted">
              <ImageOff size={28} className="mb-2 opacity-50" />
              <span className="text-xs">Image unavailable</span>
            </div>
          )}

          <img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } group-hover:scale-110`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />

          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} pointer-events-none`} />

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />

          <span className={`absolute top-3 left-3 px-2.5 py-1 ${badge.bg} ${badge.text} text-[10px] font-bold rounded-full tracking-wide uppercase shadow-sm`}>
            {product.badge}
          </span>
        </div>

        <div className="p-3.5 md:p-4">
          <h3 className="font-display font-bold text-base md:text-lg mb-0.5 line-clamp-1">{product.name}</h3>
          <p className="text-muted text-[11px] md:text-xs mb-2.5 truncate">{product.subtitle}</p>

          <div className="flex items-center gap-1.5 mb-2.5">
            <StarRating rating={product.rating} />
            <span className="text-[10px] text-muted">({product.reviews})</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.sizes.map((size) => (
              <span
                key={size}
                className="px-2.5 py-1 bg-gray-50 text-[10px] font-medium rounded-full hover:bg-primary hover:text-white transition-all cursor-pointer border border-gray-100 hover:border-primary"
              >
                {size}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-base md:text-lg font-bold">Rs. {product.price.toLocaleString()}</span>
            <span className="text-xs text-muted line-through">Rs. {product.originalPrice.toLocaleString()}</span>
          </div>
          <p className="text-[10px] md:text-xs text-green-600 mt-0.5 font-medium">
            Save Rs. {(product.originalPrice - product.price).toLocaleString()}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
