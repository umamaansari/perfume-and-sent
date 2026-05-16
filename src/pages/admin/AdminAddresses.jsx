import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone } from 'lucide-react';
import { adminService } from '../../services/adminService';

const AdminAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await adminService.getAllAddresses();
        setAddresses(data);
      } catch (err) {
        console.error('Failed to load addresses:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  const uniqueAddresses = addresses.filter(
    (a, i, arr) => arr.findIndex(x => x.address === a.address && x.phone === a.phone) === i
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-6 space-y-6"
    >
      <div>
        <h1 className="text-2xl font-display font-bold">Addresses</h1>
        <p className="text-muted text-sm">{uniqueAddresses.length} delivery addresses</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {uniqueAddresses.length === 0 ? (
          <div className="md:col-span-3 text-center py-12 text-muted">No addresses found</div>
        ) : (
          uniqueAddresses.map((addr, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-2xl shadow-sm p-5"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-secondary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{addr.users?.name || 'Unknown'}</p>
                  <p className="text-xs text-muted">{addr.users?.email || ''}</p>
                </div>
              </div>
              <p className="text-sm mb-2 ml-12">{addr.address}</p>
              <div className="flex items-center gap-2 ml-12 text-xs text-muted">
                <Phone size={12} />
                {addr.phone || 'N/A'}
              </div>
              <p className="text-[10px] text-muted mt-2 ml-12">
                Ordered on {new Date(addr.created_at).toLocaleDateString()}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default AdminAddresses;
