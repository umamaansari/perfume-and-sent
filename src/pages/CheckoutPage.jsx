import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Navigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Truck, MapPin, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, total, itemCount, removeFromCart } = useCart();
  const [step, setStep] = useState('shipping');
  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [shipping, setShipping] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zip: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [errors, setErrors] = useState({});

  const deliveryFee = total >= 2000 ? 0 : 150;
  const grandTotal = total + deliveryFee;

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  const handleShippingChange = (e) => {
    setShipping(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateShipping = () => {
    const newErrors = {};
    if (!shipping.name.trim()) newErrors.name = 'Name is required';
    if (!shipping.email.trim()) newErrors.email = 'Email is required';
    if (!shipping.phone.trim()) newErrors.phone = 'Phone is required';
    if (!shipping.address.trim()) newErrors.address = 'Address is required';
    if (!shipping.city.trim()) newErrors.city = 'City is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 'shipping') {
      if (!validateShipping()) return;
      setStep('payment');
    } else if (step === 'payment') {
      handlePlaceOrder();
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      const fullAddress = `${shipping.address}, ${shipping.city}, ${shipping.zip}`;
      const order = await orderService.createOrder(user.id, {
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          size: item.size,
          quantity: item.quantity,
        })),
        total_amount: grandTotal,
        address: fullAddress,
        phone: shipping.phone,
      });
      setOrderNumber(`SNS-${order.id}`);
      setOrderComplete(true);
      localStorage.removeItem('guest_cart');
      localStorage.removeItem('sns_cart');
    } catch (err) {
      console.error('Order failed:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (orderComplete) {
      navigate('/');
    } else if (step === 'payment') {
      setStep('shipping');
    } else {
      navigate(-1);
    }
  };

  if (cart.length === 0 && !orderComplete) {
    return (
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted text-lg mb-4">Your cart is empty</p>
          <button onClick={() => navigate('/shop')} className="btn-primary">Continue Shopping</button>
        </div>
      </motion.main>
    );
  }

  if (orderComplete) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center px-4 py-12"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-display font-bold mb-2">Order Placed!</h1>
          <p className="text-muted mb-6">
            Thank you for your order. We will send you a confirmation email shortly.
          </p>
          <div className="bg-soft-gray rounded-xl p-4 mb-6">
            <p className="text-sm font-medium">Order #{orderNumber}</p>
            <p className="text-xs text-muted mt-1">Estimated delivery: 3-5 business days</p>
          </div>
          <button onClick={() => navigate('/')} className="btn-primary w-full">
            Continue Shopping
          </button>
        </motion.div>
      </motion.main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="section-padding"
    >
      <div className="max-w-5xl mx-auto">
        <button onClick={handleBack} className="flex items-center gap-2 text-muted hover:text-primary mb-6 transition-colors">
          <ChevronLeft size={18} />
          {step === 'shipping' ? 'Back to Cart' : 'Back to Shipping'}
        </button>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${step === 'shipping' ? 'bg-primary text-white' : 'bg-green-100 text-green-700'}`}>
              <Truck size={16} />
              Shipping
            </div>
            <div className="w-12 h-0.5 bg-gray-200" />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${step === 'payment' ? 'bg-primary text-white' : 'bg-gray-100 text-muted'}`}>
              <CreditCard size={16} />
              Payment
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              {step === 'shipping' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                    <MapPin size={20} className="text-secondary" />
                    Shipping Details
                  </h2>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={shipping.name}
                      onChange={handleShippingChange}
                      className={`w-full px-4 py-3 bg-soft-gray rounded-xl border ${errors.name ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={shipping.email}
                        onChange={handleShippingChange}
                        className={`w-full px-4 py-3 bg-soft-gray rounded-xl border ${errors.email ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all`}
                        placeholder="john@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={shipping.phone}
                        onChange={handleShippingChange}
                        className={`w-full px-4 py-3 bg-soft-gray rounded-xl border ${errors.phone ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all`}
                        placeholder="+92 300 1234567"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Address</label>
                    <textarea
                      name="address"
                      value={shipping.address}
                      onChange={handleShippingChange}
                      rows={2}
                      className={`w-full px-4 py-3 bg-soft-gray rounded-xl border ${errors.address ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all resize-none`}
                      placeholder="House #, Street, Area"
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">City</label>
                      <input
                        type="text"
                        name="city"
                        value={shipping.city}
                        onChange={handleShippingChange}
                        className={`w-full px-4 py-3 bg-soft-gray rounded-xl border ${errors.city ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all`}
                        placeholder="Lahore"
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Postal Code</label>
                      <input
                        type="text"
                        name="zip"
                        value={shipping.zip}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 bg-soft-gray rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                        placeholder="54000"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 'payment' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                    <CreditCard size={20} className="text-secondary" />
                    Payment Method
                  </h2>

                  <div className="space-y-3">
                    {[
                      { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive your order' },
                      { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard accepted' },
                      { id: 'bank', label: 'Bank Transfer', desc: 'Direct bank payment' },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === method.id ? 'border-secondary bg-secondary/5' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="w-4 h-4 text-secondary focus:ring-secondary"
                        />
                        <div>
                          <p className="font-medium text-sm">{method.label}</p>
                          <p className="text-xs text-muted">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleNext}
                disabled={isLoading}
                className="w-full btn-primary mt-6 py-3.5 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : step === 'shipping' ? (
                  'Continue to Payment'
                ) : (
                  `Place Order - Rs. ${grandTotal.toLocaleString()}`
                )}
              </button>
            </motion.div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h3 className="font-display font-bold mb-4">Order Summary ({itemCount} items)</h3>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-3">
                    <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted">{item.size} x {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                      <button onClick={() => removeFromCart(item.id, item.size)} className="text-xs text-red-500 hover:underline">Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-green-600">Free delivery on orders above Rs. 2,000</p>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-soft-gray rounded-xl">
                <p className="text-xs text-muted flex items-center gap-2">
                  <Truck size={14} />
                  Estimated delivery: 3-5 business days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
};

export default CheckoutPage;
