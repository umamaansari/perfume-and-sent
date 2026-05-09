import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight, Truck, Shield, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import ProductGrid from '../components/ProductGrid';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('50ML');
  const [added, setAdded] = useState(false);

  const product = products.find(p => p.id === parseInt(id));
  const relatedProducts = products.filter(p => p.series === product?.series && p.id !== product?.id).slice(0, 4);

  if (!product) {
    return (
      <div className="section-padding text-center">
        <p className="text-muted text-lg">Product not found</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">Go Home</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const badgeColors = {
    UNISEX: 'bg-purple-100 text-purple-700',
    WOMEN: 'bg-pink-100 text-pink-700',
    MEN: 'bg-blue-100 text-blue-700',
    BUNDLE: 'bg-amber-100 text-amber-700',
    TESTER: 'bg-teal-100 text-teal-700',
    BODY: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted hover:text-primary mb-6 transition-colors">
          <ChevronLeft size={18} />
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden aspect-square"
          >
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            <span className={`absolute top-4 left-4 px-3 py-1.5 ${badgeColors[product.badge]} text-sm font-bold rounded-full backdrop-blur-sm`}>
              {product.badge}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <span className="text-secondary text-sm font-medium mb-2">{product.subtitle}</span>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={star <= Math.round(product.rating) ? 'fill-secondary text-secondary' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-muted text-sm">({product.reviews} reviews)</span>
            </div>

            <p className="text-muted mb-6">{product.description}</p>

            <div className="mb-6">
              <span className="text-sm font-medium mb-3 block">Select Size</span>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                      selectedSize === size
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-soft-gray text-primary hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold">Rs. {product.price.toLocaleString()}</span>
              <span className="text-lg text-muted line-through">Rs. {product.originalPrice.toLocaleString()}</span>
              <span className="text-green-600 text-sm font-medium">
                Save Rs. {(product.originalPrice - product.price).toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                added ? 'bg-green-500 text-white' : 'btn-primary'
              }`}
            >
              {added ? 'Added to Cart!' : 'Add to Cart'}
            </button>

            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center p-3 bg-soft-gray rounded-xl">
                <Truck size={20} className="mx-auto mb-1 text-secondary" />
                <span className="text-xs text-muted">Free Delivery</span>
              </div>
              <div className="text-center p-3 bg-soft-gray rounded-xl">
                <Shield size={20} className="mx-auto mb-1 text-secondary" />
                <span className="text-xs text-muted">Authentic</span>
              </div>
              <div className="text-center p-3 bg-soft-gray rounded-xl">
                <RefreshCw size={20} className="mx-auto mb-1 text-secondary" />
                <span className="text-xs text-muted">Easy Returns</span>
              </div>
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <ProductGrid products={relatedProducts} title="You May Also Like" showViewAll={false} />
        )}
      </div>
    </motion.main>
  );
};

export default ProductDetailPage;
