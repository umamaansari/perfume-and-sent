import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CollectionPage from './pages/CollectionPage';
import ContactPage from './pages/ContactPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminOrderList from './pages/admin/AdminOrderList';
import AdminProfiles from './pages/admin/AdminProfiles';
import AdminUserRoles from './pages/admin/AdminUserRoles';
import AdminAddresses from './pages/admin/AdminAddresses';
import AdminProducts from './pages/admin/AdminProducts';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }
  if (!user || (user.role !== 'admin' && user.role !== 'viewer')) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

function AppContent() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <CartDrawer />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/collection/:type" element={<CollectionPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminOverview />} />
              <Route path="orders" element={<AdminOrderList />} />
              <Route path="profiles" element={<AdminProfiles />} />
              <Route path="roles" element={<AdminUserRoles />} />
              <Route path="addresses" element={<AdminAddresses />} />
              <Route path="products" element={<AdminProducts />} />
            </Route>
          </Routes>
        </div>
        <Footer />
        <WhatsAppButton />
      </div>
    </CartProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
