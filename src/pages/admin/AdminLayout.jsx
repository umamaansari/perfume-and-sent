import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, ShoppingBag, Users, Shield, MapPin,
  Menu, X, LogOut, ChevronLeft, Package
} from 'lucide-react';
import { useAuth, isAdminEmail } from '../../context/AuthContext';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { id: 'orders', label: 'Order List', icon: ShoppingBag, path: '/admin/orders' },
  { id: 'profiles', label: 'Profiles', icon: Users, path: '/admin/profiles' },
  { id: 'roles', label: 'User Roles', icon: Shield, path: '/admin/roles' },
  { id: 'addresses', label: 'Addresses', icon: MapPin, path: '/admin/addresses' },
];

export const isSuperAdmin = (user) => {
  return isAdminEmail(user?.email);
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentTab = sidebarItems.find(
    item => item.path === location.pathname
  )?.id || 'dashboard';

  const handleNav = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="fixed inset-0 bg-black z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        className="fixed left-0 top-0 h-full w-64 bg-white z-50 shadow-xl lg:relative lg:translate-x-0 lg:shadow-none border-r border-gray-200 flex flex-col"
      >
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <button onClick={() => { navigate('/'); setSidebarOpen(false); }} className="font-display font-bold text-lg tracking-wider">BADSHA ADMIN</button>
            <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg lg:hidden">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-100 bg-soft-gray/50">
          <p className="text-sm font-medium truncate">{user?.name || 'Admin'}</p>
          <p className="text-xs text-muted truncate">{user?.email}</p>
          <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${
            isSuperAdmin(user) ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {isSuperAdmin(user) ? 'Super Admin' : 'Viewer'}
          </span>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => { signOut(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 lg:gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <Menu size={20} />
          </button>
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-sm text-muted"
          >
            <ChevronLeft size={16} />
            Back to Site
          </button>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/products')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                location.pathname === '/admin/products'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Package size={16} />
              Products
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
