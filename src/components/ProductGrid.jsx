import ProductCard from './ProductCard';

const ProductGrid = ({ products, title, showViewAll = true, onViewAll }) => {
  return (
    <section className="section-padding">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-display font-bold">{title}</h2>
        {showViewAll && onViewAll && (
          <button onClick={onViewAll} className="text-secondary text-sm font-medium hover:underline">
            VIEW ALL
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
