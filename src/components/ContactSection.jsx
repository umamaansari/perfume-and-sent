import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactImages = [
    { src: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=400&h=300&fit=crop&q=80', alt: 'Our Store' },
    { src: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&h=300&fit=crop&q=80', alt: 'Packaging' },
    { src: 'https://images.unsplash.com/photo-1590739225287-bd31519780c3?w=400&h=300&fit=crop&q=80', alt: 'Lifestyle' },
  ];

  return (
    <section className="section-padding bg-cream" id="contact">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">Get In Touch</h2>
          <p className="text-muted">Have questions? We would love to hear from you.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all resize-none"
                placeholder="How can we help?"
              />
            </div>
            <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2">
              <Send size={18} />
              Send Message
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-3">
              {contactImages.map((img, index) => (
                <motion.div
                  key={index}
                  className={`relative overflow-hidden rounded-2xl shadow-md ${index === 0 ? 'col-span-2' : ''}`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`${index === 0 ? 'h-40 md:h-48' : 'h-32 md:h-40'} bg-gradient-to-br from-gray-50 to-gray-100`}>
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-3 bg-white p-4 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-secondary" />
                <span className="text-sm">info@badsha.pk</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-secondary" />
                <span className="text-sm">+92 300 1234567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-secondary" />
                <span className="text-sm">Lahore, Pakistan</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactSection;
