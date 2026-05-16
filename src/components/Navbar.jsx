import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, ShoppingCart, X, ChevronDown, User, LogOut, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

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

            {user && (
              <div className="p-4 border-b bg-soft-gray">
                <p className="text-sm font-medium">{user.name || user.email}</p>
                <p className="text-xs text-muted">{user.email}</p>
              </div>
            )}

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
              {user ? (
                <div className="space-y-2">
                  {user.role === 'admin' && (
                    <button onClick={() => { handleNavigation('/admin'); }} className="w-full flex items-center justify-center gap-2 btn-secondary mb-2">
                      <Shield size={16} />
                      Admin Panel
                    </button>
                  )}
                  <button
                    onClick={() => { signOut(); onClose(); }}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-2xl text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button onClick={() => { handleNavigation('/signin'); }} className="w-full btn-primary mb-4">
                  Login
                </button>
              )}
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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();
  const { user, signOut } = useAuth();
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
              {user ? (
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1"
                    aria-label="Account"
                  >
                    <User size={20} />
                    <span className="text-xs font-medium max-w-[80px] truncate">{user.name || user.email}</span>
                  </button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                      >
                        {user.role === 'admin' && (
                          <button
                            onClick={() => { navigate('/admin'); setShowUserMenu(false); }}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-soft-gray transition-colors flex items-center gap-2"
                          >
                            <Shield size={14} />
                            Admin Panel
                          </button>
                        )}
                        <button
                          onClick={() => { signOut(); setShowUserMenu(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-soft-gray transition-colors flex items-center gap-2"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/signin')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden lg:flex"
                  aria-label="Account"
                >
                  <User size={20} />
                </button>
              )}
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
