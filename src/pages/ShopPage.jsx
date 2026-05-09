import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortBy, setSortBy] = useState('default');
  const [activeFilter, setActiveFilter] = useState('');

  useEffect(() => {
    let result = [...products];

    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const maxPrice = searchParams.get('maxPrice');
    const isNew = searchParams.get('new');
    const isGifting = searchParams.get('gifting');

    let filterLabel = 'All Perfumes';

    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
      filterLabel = `Search: "${search}"`;
    }

    if (category) {
      if (['oud', 'bundles', 'testers', 'bath'].includes(category)) {
        result = result.filter(p => p.series === category);
        const labels = { oud: 'Oud Perfumes', bundles: 'Bundles', testers: 'Tester Boxes', bath: 'Bath & Body' };
        filterLabel = labels[category] || category;
      } else {
        result = result.filter(p => p.badge.toLowerCase() === category);
        filterLabel = `${category.charAt(0).toUpperCase() + category.slice(1)}`;
      }
    }

    if (maxPrice) {
      result = result.filter(p => p.price <= parseInt(maxPrice));
      filterLabel = 'Under Rs. 1,600';
    }

    if (isNew) {
      result = result.filter(p => p.category === 'new');
      filterLabel = 'New Arrivals';
    }

    if (isGifting) {
      result = result.filter(p => p.category === 'bestseller' || p.subtitle.includes('Limited') || p.subtitle.includes('Exclusive'));
      filterLabel = 'Gifting';
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
    setActiveFilter(filterLabel);
  }, [searchParams, sortBy]);

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
