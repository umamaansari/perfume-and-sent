import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { productService } from '../../services/productService';
import { adminService } from '../../services/adminService';

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: '', subtitle: '', description: '', price: '', originalPrice: '',
    category: 'bestseller', productType: 'UNISEX', series: 'signature',
    sizes: [], sizeInput: '', color: '', imageUrl: '', stock: '10',
    rating: '0', reviews: '0',
  });

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const resetForm = () => {
    setForm({
      name: '', subtitle: '', description: '', price: '', originalPrice: '',
      category: 'bestseller', productType: 'UNISEX', series: 'signature',
      sizes: [], sizeInput: '', color: '', imageUrl: '', stock: '10',
      rating: '0', reviews: '0',
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const openEdit = (product) => {
    setForm({
      name: product.name,
      subtitle: product.subtitle || '',
      description: product.description || '',
      price: String(product.price),
      originalPrice: String(product.originalPrice || ''),
      category: product.category || 'bestseller',
      productType: product.badge || 'UNISEX',
      series: product.series || 'signature',
      sizes: product.sizes || [],
      sizeInput: '',
      color: product.color || '',
      imageUrl: product.images?.[0] || '',
      stock: String(product.stock || '10'),
      rating: String(product.rating || '0'),
      reviews: String(product.reviews || '0'),
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAddSize = () => {
    if (form.sizeInput && !form.sizes.includes(form.sizeInput)) {
      setForm(prev => ({ ...prev, sizes: [...prev.sizes, prev.sizeInput], sizeInput: '' }));
    }
  };

  const removeSize = (size) => {
    setForm(prev => ({ ...prev, sizes: prev.sizes.filter(s => s !== size) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          rating: Number(form.rating),
          reviews: Number(form.reviews),
        });
      } else {
        await adminService.addProduct(form);
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await adminService.deleteProduct(id);
      fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

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
      className="section-padding"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-display font-bold">Products</h1>
              <p className="text-muted text-sm">{products.length} products</p>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-6 mb-6"
          >
            <h2 className="text-lg font-display font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  required className="w-full px-3 py-2 bg-soft-gray rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subtitle</label>
                <input type="text" value={form.subtitle} onChange={e => setForm(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-3 py-2 bg-soft-gray rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price *</label>
                <input type="number" value={form.price} onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
                  required className="w-full px-3 py-2 bg-soft-gray rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Old Price</label>
                <input type="number" value={form.originalPrice} onChange={e => setForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                  className="w-full px-3 py-2 bg-soft-gray rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 bg-soft-gray rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50">
                  <option value="bestseller">Bestseller</option>
                  <option value="new">New Arrival</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Product Type</label>
                <select value={form.productType} onChange={e => setForm(prev => ({ ...prev, productType: e.target.value }))}
                  className="w-full px-3 py-2 bg-soft-gray rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50">
                  <option value="UNISEX">Unisex</option>
                  <option value="MEN">Men</option>
                  <option value="WOMEN">Women</option>
                  <option value="BUNDLE">Bundle</option>
                  <option value="TESTER">Tester</option>
                  <option value="BODY">Body</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Series</label>
                <select value={form.series} onChange={e => setForm(prev => ({ ...prev, series: e.target.value }))}
                  className="w-full px-3 py-2 bg-soft-gray rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50">
                  <option value="signature">Signature</option>
                  <option value="dessert">Dessert</option>
                  <option value="oud">Oud</option>
                  <option value="bundles">Bundles</option>
                  <option value="testers">Testers</option>
                  <option value="bath">Bath & Body</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input type="number" value={form.stock} onChange={e => setForm(prev => ({ ...prev, stock: e.target.value }))}
                  className="w-full px-3 py-2 bg-soft-gray rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input type="url" value={form.imageUrl} onChange={e => setForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full px-3 py-2 bg-soft-gray rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <input type="text" value={form.color} onChange={e => setForm(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full px-3 py-2 bg-soft-gray rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <input type="number" step="0.1" min="0" max="5" value={form.rating}
                  onChange={e => setForm(prev => ({ ...prev, rating: e.target.value }))}
                  className="w-full px-3 py-2 bg-soft-gray rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reviews</label>
                <input type="number" value={form.reviews} onChange={e => setForm(prev => ({ ...prev, reviews: e.target.value }))}
                  className="w-full px-3 py-2 bg-soft-gray rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50" />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3} className="w-full px-3 py-2 bg-soft-gray rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 resize-none" />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium mb-1">Sizes</label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {form.sizes.map(size => (
                    <span key={size} className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                      {size}
                      <button type="button" onClick={() => removeSize(size)} className="hover:text-red-500">&times;</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={form.sizeInput}
                    onChange={e => setForm(prev => ({ ...prev, sizeInput: e.target.value.toUpperCase() }))}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                    placeholder="e.g. 50ML"
                    className="flex-1 px-3 py-2 bg-soft-gray rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50" />
                  <button type="button" onClick={handleAddSize} className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300">Add</button>
                </div>
              </div>
              <div className="md:col-span-2 lg:col-span-3 flex gap-3 mt-2">
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button type="button" onClick={resetForm} className="px-6 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-soft-gray">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Product</th>
                  <th className="text-left px-4 py-3 font-medium">Price</th>
                  <th className="text-left px-4 py-3 font-medium">Type</th>
                  <th className="text-left px-4 py-3 font-medium">Series</th>
                  <th className="text-left px-4 py-3 font-medium">Stock</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded-lg" />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">Rs. {product.price.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{product.badge}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">{product.series}</td>
                    <td className="px-4 py-3">
                      <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(product)} className="p-2 hover:bg-gray-100 rounded-lg mr-1">
                        <Edit2 size={16} className="text-blue-500" />
                      </button>
                      <button onClick={() => handleDelete(product.id, product.name)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.main>
  );
};

export default AdminProducts;
