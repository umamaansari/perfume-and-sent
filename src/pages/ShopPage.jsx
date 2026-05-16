import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');
  const [activeFilter, setActiveFilter] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        const maxPrice = searchParams.get('maxPrice');
        const minPrice = searchParams.get('minPrice');
        const isNew = searchParams.get('new');
        const isGifting = searchParams.get('gifting');
        const productType = searchParams.get('productType');
        const series = searchParams.get('series');
        const color = searchParams.get('color');

        let filterLabel = 'All Perfumes';
        if (search) filterLabel = `Search: "${search}"`;
        else if (category) {
          const labels = { oud: 'Oud Perfumes', bundles: 'Bundles', testers: 'Tester Boxes', bath: 'Bath & Body', signature: 'Signature Series', dessert: 'Dessert Series', men: 'Men', women: 'Women', unisex: 'Unisex' };
          filterLabel = labels[category] || `${category.charAt(0).toUpperCase() + category.slice(1)}`;
        }
        else if (maxPrice) filterLabel = 'Under Rs. 1,600';
        else if (isNew) filterLabel = 'New Arrivals';
        else if (isGifting) filterLabel = 'Gifting';
        else if (series) filterLabel = series;
        else if (productType) filterLabel = productType;

        setActiveFilter(filterLabel);

        const result = await productService.getFiltered({
          search, category, maxPrice, minPrice, sortBy, isNew: isNew === 'true', isGifting: isGifting === 'true',
          productType, series, color,
        });
        setFilteredProducts(result);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams, sortBy]);

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
      className="section-padding"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">{activeFilter || 'Shop All'}</h1>
            <p className="text-muted text-sm mt-1">{filteredProducts.length} products</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-soft-gray rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
            >
              <option value="default">Sort by</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted text-lg">No products found</p>
            <p className="text-sm text-muted mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </motion.main>
  );
};

export default ShopPage;
