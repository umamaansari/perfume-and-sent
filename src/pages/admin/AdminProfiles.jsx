import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../../services/adminService';

const roleColors = {
  admin: 'bg-amber-100 text-amber-700',
  viewer: 'bg-blue-100 text-blue-700',
  customer: 'bg-gray-100 text-gray-700',
};

const AdminProfiles = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminService.getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

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
        <h1 className="text-2xl font-display font-bold">Profiles</h1>
        <p className="text-muted text-sm">{users.length} registered users</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.length === 0 ? (
          <div className="md:col-span-3 text-center py-12 text-muted">No users found</div>
        ) : (
          users.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-2xl shadow-sm p-5"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold text-lg">
                  {(u.name || u.email || '?')[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-bold truncate">{u.name || 'No Name'}</p>
                  <p className="text-xs text-muted truncate">{u.email || 'No Email'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded-full font-medium capitalize ${roleColors[u.role] || 'bg-gray-100'}`}>
                  {u.role || 'customer'}
                </span>
                <span className="text-muted">
                  Joined {new Date(u.created_at).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default AdminProfiles;
