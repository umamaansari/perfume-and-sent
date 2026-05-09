import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/923001234567"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-30 p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={24} />
    </motion.a>
  );
};

export default WhatsAppButton;
