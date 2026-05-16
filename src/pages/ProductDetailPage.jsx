import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ChevronLeft, Truck, Shield, RefreshCw, ChevronRight, ChevronLeft as ChevronLeftIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';
import ProductGrid from '../components/ProductGrid';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const data = await productService.getById(Number(id));
        if (data) {
          setProduct(data);
          setSelectedSize(data.sizes[0] || '');
          const related = await productService.getBySeries(data.series);
          setRelatedProducts(related.filter(p => p.id !== data.id).slice(0, 4));
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="section-padding text-center">
        <p className="text-muted text-lg">Product not found</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">Go Home</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      navigate('/signin');
      return;
    }
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
            className="space-y-3"
          >
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden aspect-square group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              <span className={`absolute top-4 left-4 px-3 py-1.5 ${badgeColors[product.badge]} text-sm font-bold rounded-full backdrop-blur-sm z-10`}>
                {product.badge}
              </span>
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => (prev - 1 + product.images.length) % product.images.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
                  >
                    <ChevronLeftIcon size={18} />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => (prev + 1) % product.images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-secondary ring-1 ring-secondary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
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

            {product.sizes.length > 0 && (
              <div className="mb-6">
                <span className="text-sm font-medium mb-3 block">Select Size</span>
                <div className="flex gap-3 flex-wrap">
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
            )}

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold">Rs. {product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-muted line-through">Rs. {product.originalPrice.toLocaleString()}</span>
                  <span className="text-green-600 text-sm font-medium">
                    Save Rs. {(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                added ? 'bg-green-500 text-white' : 'btn-primary'
              }`}
            >
              {added ? 'Added to Cart!' : 'Add to Cart'}
            </button>

            {!user && (
              <p className="text-xs text-muted text-center mt-2">
                Please <button onClick={() => navigate('/signin')} className="text-secondary underline">sign in</button> to add items to cart
              </p>
            )}

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
