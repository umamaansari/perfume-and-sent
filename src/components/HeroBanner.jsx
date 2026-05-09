import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Truck, Shield, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { banners } from '../data/products';

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const goTo = (index) => {
    setCurrent(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 12000);
  };

  const next = () => goTo((current + 1) % banners.length);
  const prev = () => goTo((current - 1 + banners.length) % current.length);

  const handleCta = () => {
    navigate(banners[current].ctaLink);
  };

  const slide = banners[current];

  return (
    <section className="relative w-full overflow-hidden bg-dark">
      <div className="relative h-[26rem] sm:h-[28rem] md:h-[32rem] lg:h-[38rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <motion.div
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute top-0 right-0 w-1/3 h-full overflow-hidden opacity-20 pointer-events-none"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-20 -right-20 w-80 h-80 border border-secondary/40 rounded-full"
              />
              <motion.div
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                className="absolute top-10 right-10 w-60 h-60 border border-secondary/30 rounded-full"
              />
            </motion.div>

            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 flex items-center">
              <motion.div className="max-w-xl">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/20 backdrop-blur-sm border border-secondary/30 rounded-full mb-4 md:mb-5"
                >
                  <Sparkles size={14} className="text-secondary" />
                  <span className="text-secondary text-xs font-bold tracking-widest uppercase">
                    {slide.tag}
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-2 md:mb-3 leading-tight"
                >
                  {slide.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-lg md:text-xl text-secondary font-medium mb-2"
                >
                  {slide.subtitle}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-white/70 text-sm md:text-base mb-5 md:mb-8 max-w-md leading-relaxed"
                >
                  {slide.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex flex-wrap items-center gap-3"
                >
                  <motion.button
                    onClick={handleCta}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 bg-secondary text-white px-6 md:px-8 py-3 md:py-3.5 rounded-xl md:rounded-2xl font-semibold text-sm hover:bg-amber-600 transition-all duration-300 shadow-lg shadow-secondary/30"
                  >
                    {slide.cta}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                  <motion.button
                    onClick={() => navigate('/shop')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 border border-white/30 text-white px-6 md:px-8 py-3 md:py-3.5 rounded-xl md:rounded-2xl font-semibold text-sm hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                  >
                    Shop All
                  </motion.button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="hidden md:flex items-center gap-6 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/10"
                >
                  <div className="flex items-center gap-2">
                    <Truck size={16} className="text-secondary" />
                    <span className="text-white/60 text-xs">Free Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-secondary" />
                    <span className="text-white/60 text-xs">100% Authentic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw size={16} className="text-secondary" />
                    <span className="text-white/60 text-xs">Easy Returns</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={prev}
          className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/20 transition-all duration-300 group"
          aria-label="Previous banner"
        >
          <ChevronLeft size={18} className="text-white group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/20 transition-all duration-300 group"
          aria-label="Next banner"
        >
          <ChevronRight size={18} className="text-white group-hover:translate-x-0.5 transition-transform" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="hidden md:flex flex-1 max-w-xs items-center gap-3">
              <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  key={current}
                  className="h-full bg-secondary/70 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 6, ease: 'linear' }}
                />
              </div>
              <span className="text-white/50 text-xs tabular-nums font-medium">
                {String(current + 1).padStart(2, '0')} / {String(banners.length).padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  className={`transition-all duration-500 rounded-full ${
                    index === current
                      ? 'w-8 md:w-10 h-2 md:h-2.5 bg-secondary shadow-lg shadow-secondary/30'
                      : 'w-2 h-2 md:w-2.5 md:h-2.5 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="hidden md:block flex-1 max-w-xs" />
          </div>
        </div>
      </div>

      <div className="bg-cream border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-10 text-xs md:text-sm font-medium text-muted">
            {[
              { icon: '✨', text: 'Premium Quality' },
              { icon: '🎁', text: 'Gift Wrapping' },
              { icon: '💎', text: 'Luxury Packaging' },
              { icon: '🚀', text: 'Express Shipping' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="text-sm">{item.icon}</span>
                <span className="hidden xs:inline">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
