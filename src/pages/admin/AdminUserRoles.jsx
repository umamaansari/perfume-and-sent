import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, User } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import { isSuperAdmin } from './AdminLayout';

const roleColors = {
  admin: 'bg-amber-100 text-amber-700',
  viewer: 'bg-blue-100 text-blue-700',
  customer: 'bg-gray-100 text-gray-700',
};

const AdminUserRoles = () => {
  const { user } = useAuth();
  const canEdit = isSuperAdmin(user);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminService.getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await adminService.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, role: newRole } : u
      ));
    } catch (err) {
      console.error('Failed to update role:', err);
    } finally {
      setUpdatingId(null);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-6 space-y-6"
    >
      <div>
        <h1 className="text-2xl font-display font-bold">User Roles</h1>
        <p className="text-muted text-sm">Manage user permissions</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">User</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Current Role</th>
                {canEdit && <th className="text-left px-4 py-3 font-medium">Change Role</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={canEdit ? 4 : 3} className="px-4 py-8 text-center text-muted">No users found</td>
                </tr>
              ) : (
                users.map((u, i) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold text-xs">
                          {(u.name || u.email || '?')[0].toUpperCase()}
                        </div>
                        <span className="font-medium">{u.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted text-xs">{u.email || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1.5 w-fit ${roleColors[u.role] || 'bg-gray-100 text-gray-700'}`}>
                        {u.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                        {u.role || 'customer'}
                      </span>
                    </td>
                    {canEdit && (
                      <td className="px-4 py-3">
                        <select
                          value={u.role || 'customer'}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          disabled={updatingId === u.id || isSuperAdmin(u)}
                          className="px-2 py-1.5 bg-soft-gray rounded-lg text-xs border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 disabled:opacity-50"
                        >
                          <option value="customer">Customer</option>
                          <option value="viewer">Viewer</option>
                          <option value="admin">Admin</option>
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

export default AdminUserRoles;
