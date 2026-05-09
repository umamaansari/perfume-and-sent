import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
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

function App() {
  return (
    <CartProvider>
      <Router>
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
            </Routes>
          </div>
          <Footer />
          <WhatsAppButton />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
