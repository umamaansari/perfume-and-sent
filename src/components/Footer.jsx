import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-2">
              <h3 className="text-xl font-display font-bold tracking-wider">BADSHA</h3>
              <p className="text-secondary/60 text-xs tracking-widest uppercase">Royal Fragrance</p>
            </div>
            <p className="text-white/60 text-sm">
              Premium fragrances crafted with passion. Discover your signature scent.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Collections</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/collection/signature" className="hover:text-white transition-colors">Signature Series</Link></li>
              <li><Link to="/collection/dessert" className="hover:text-white transition-colors">Dessert Series</Link></li>
              <li><Link to="/collection/oud" className="hover:text-white transition-colors">Oud Perfumes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Order Tracking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm text-white/40">
          <p>&copy; 2026 BADSHA Royal Fragrance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
