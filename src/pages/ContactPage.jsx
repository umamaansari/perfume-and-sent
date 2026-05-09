import { motion } from 'framer-motion';
import ContactSection from '../components/ContactSection';

const ContactPage = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className="bg-primary text-white section-padding text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Contact Us</h1>
          <p className="text-white/60 max-w-md mx-auto">
            Have questions about our perfumes? Need help with an order? We are here to help.
          </p>
        </motion.div>
      </section>

      <ContactSection />

      <section className="section-padding">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { title: 'Our Outlets', desc: 'Visit our stores across Pakistan for a personalized fragrance experience.' },
            { title: 'Order Tracking', desc: 'Track your order status with your order number and email address.' },
            { title: 'Returns & Exchanges', desc: 'Easy 7-day return policy. No questions asked.' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-soft-gray rounded-2xl text-center"
            >
              <h3 className="font-display font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-muted">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.main>
  );
};

export default ContactPage;
