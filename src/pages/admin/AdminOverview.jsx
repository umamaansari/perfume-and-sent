import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Users, TrendingUp, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { adminService } from '../../services/adminService';
import { isSuperAdmin } from './AdminLayout';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  delivering: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const AdminOverview = () => {
  const { user } = useAuth();
  const canEdit = isSuperAdmin(user);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchData = async () => {
    try {
      const [ordersData, usersData] = await Promise.all([
        orderService.getAllOrders(),
        adminService.getAllUsers(),
      ]);
      setOrders(ordersData);
      setUsers(usersData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o =>
        o.id === orderId ? { ...o, status: newStatus } : o
      ));
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const deliveringOrders = orders.filter(o => o.status === 'delivering').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

  const statCards = [
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'Total Users', value: users.length, icon: Users, color: 'bg-indigo-500' },
    { label: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Pending', value: pendingOrders, icon: Clock, color: 'bg-amber-500' },
    { label: 'Delivering', value: deliveringOrders, icon: Truck, color: 'bg-blue-500' },
    { label: 'Completed', value: completedOrders, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Cancelled', value: cancelledOrders, icon: XCircle, color: 'bg-red-500' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-6 space-y-6"
    >
      <div>
        <h1 className="text-2xl font-display font-bold">Dashboard</h1>
        <p className="text-muted text-sm">Overview of your store</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl shadow-sm p-4"
          >
            <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center text-white mb-3`}>
              <card.icon size={18} />
            </div>
            <p className="text-xl font-bold">{typeof card.value === 'number' ? card.value.toLocaleString() : card.value}</p>
            <p className="text-xs text-muted mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm">
        <div className="p-4 md:p-6 border-b border-gray-100">
          <h2 className="text-lg font-display font-bold">Order Management</h2>
          <p className="text-xs text-muted mt-0.5">Update order statuses in real-time</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Order #</th>
                <th className="text-left px-4 py-3 font-medium">Customer</th>
                <th className="text-left px-4 py-3 font-medium">Amount</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                {canEdit && <th className="text-left px-4 py-3 font-medium">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={canEdit ? 6 : 5} className="px-4 py-8 text-center text-muted">No orders yet</td>
                </tr>
              ) : (
                orders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">#SNS-{order.id}</td>
                    <td className="px-4 py-3">{order.users?.name || order.users?.email || 'N/A'}</td>
                    <td className="px-4 py-3">Rs. {Number(order.total_amount).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted text-xs">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    {canEdit && (
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                          className="px-2 py-1.5 bg-soft-gray rounded-lg text-xs border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 disabled:opacity-50"
                        >
                          <option value="pending">Pending</option>
                          <option value="delivering">Delivering</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminOverview;
