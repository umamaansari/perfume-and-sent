import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, ShoppingCart, X, ChevronDown, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Sidebar = ({ isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const navigate = useNavigate();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    {
      label: 'Shop All',
      expandable: true,
      section: 'shop',
      children: [
        { label: 'All Perfumes', path: '/shop' },
        { label: 'Men', path: '/shop?category=men' },
        { label: 'Women', path: '/shop?category=women' },
        { label: 'Bundles', path: '/collection/bundles' },
        { label: 'Tester Boxes', path: '/collection/testers' },
        { label: 'Oud', path: '/collection/oud' },
        { label: 'Bath & Body', path: '/collection/bath' },
      ],
    },
    { label: 'Signature Series', path: '/collection/signature' },
    { label: 'Dessert Perfume Series', path: '/collection/dessert' },
    { label: 'Oud Perfumes', path: '/collection/oud' },
    { label: 'Bundles', path: '/collection/bundles' },
    { label: 'Tester Boxes', path: '/collection/testers' },
    { label: 'Bath & Body', path: '/collection/bath' },
    { label: 'Under 1600', path: '/shop?maxPrice=1600' },
    { label: 'New Arrivals', path: '/shop?new=true' },
    { label: 'Gifting', path: '/shop?gifting=true' },
    { label: 'Our Outlets', path: '/contact' },
    {
      label: 'Contact Us',
      expandable: true,
      section: 'contact',
      children: [
        { label: 'Blogs', path: '/blog' },
        { label: 'Contact', path: '/contact' },
        { label: 'Order Tracking', path: '/contact' },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-white z-50 shadow-2xl overflow-y-auto lg:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold font-display">MENU</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <nav className="p-4">
              {menuItems.map((item, index) => (
                <div key={index} className="mb-1">
                  <button
                    onClick={() => item.expandable ? toggleSection(item.section) : handleNavigation(item.path)}
                    className="w-full flex items-center justify-between py-3 px-2 text-left hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.expandable && (
                      <ChevronDown size={16} className={`transition-transform duration-200 ${expandedSections[item.section] ? '' : '-rotate-90'}`} />
                    )}
                  </button>
                  <AnimatePresence>
                    {item.expandable && expandedSections[item.section] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        {item.children.map((child, childIndex) => (
                          <button
                            key={childIndex}
                            onClick={() => handleNavigation(child.path)}
                            className="w-full text-left py-2 px-6 text-sm text-muted hover:text-primary transition-colors"
                          >
                            {child.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            <div className="p-4 border-t mt-4">
              <button onClick={() => { handleNavigation('/signin'); }} className="w-full btn-primary mb-4">
                Login
              </button>
              <div className="flex justify-center gap-4">
                <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const DesktopNav = () => {
  const navigate = useNavigate();
  const [hoveredMenu, setHoveredMenu] = useState(null);

  const navLinks = [
    { label: 'Home', path: '/' },
    {
      label: 'Shop',
      dropdown: [
        { label: 'All Perfumes', path: '/shop' },
        { label: 'Men', path: '/shop?category=men' },
        { label: 'Women', path: '/shop?category=women' },
        { label: 'Oud', path: '/shop?category=oud' },
        { label: 'Bundles', path: '/collection/bundles' },
        { label: 'Tester Boxes', path: '/collection/testers' },
        { label: 'Bath & Body', path: '/collection/bath' },
      ],
    },
    { label: 'Signature', path: '/collection/signature' },
    { label: 'Dessert Series', path: '/collection/dessert' },
    { label: 'Oud Perfumes', path: '/collection/oud' },
    { label: 'Bundles', path: '/collection/bundles' },
    { label: 'Testers', path: '/collection/testers' },
    { label: 'Bath & Body', path: '/collection/bath' },
    { label: 'Under 1600', path: '/shop?maxPrice=1600' },
    { label: 'New Arrivals', path: '/shop?new=true' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="hidden lg:flex items-center gap-0.5">
      {navLinks.map((link, index) => (
        <div
          key={index}
          className="relative"
          onMouseEnter={() => link.dropdown && setHoveredMenu(index)}
          onMouseLeave={() => setHoveredMenu(null)}
        >
          <button
            onClick={() => !link.dropdown && navigate(link.path)}
            className="px-2.5 py-2 text-xs xl:text-sm font-medium text-muted hover:text-primary transition-colors flex items-center gap-1 whitespace-nowrap"
          >
            {link.label}
            {link.dropdown && <ChevronDown size={12} />}
          </button>
          <AnimatePresence>
            {link.dropdown && hoveredMenu === index && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
              >
                {link.dropdown.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(item.path)}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-soft-gray transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </nav>
  );
};

export const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { itemCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16 gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors lg:hidden shrink-0"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <Link to="/" className="text-base md:text-lg lg:text-xl font-display font-bold tracking-wider">
              BADSHA
            </Link>

            <DesktopNav />

            <div className="flex items-center gap-1 ml-auto shrink-0">
              <button
                onClick={() => navigate('/signin')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden lg:flex"
                aria-label="Account"
              >
                <User size={20} />
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                aria-label="Open cart"
              >
                <ShoppingCart size={22} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-3">
          <form onSubmit={handleSearch} className="relative lg:max-w-xl xl:max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search perfumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 px-4 pr-10 bg-soft-gray rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors">
              <Search size={18} />
            </button>
          </form>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};
