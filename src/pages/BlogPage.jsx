import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { blogs } from '../data/products';

const BlogPage = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="section-padding"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Our Blog</h1>
          <p className="text-muted max-w-md mx-auto">
            Discover tips, guides, and stories about the world of fragrances.
          </p>
        </motion.div>

        <div className="space-y-8">
          {blogs.map((blog, index) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm card-hover"
            >
              <div className="md:flex">
                <div className="md:w-2/5 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-48 md:h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 md:w-3/5 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full">
                      {blog.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <Calendar size={14} />
                      {blog.date}
                    </span>
                  </div>
                  <h2 className="text-xl font-display font-bold mb-2">{blog.title}</h2>
                  <p className="text-muted text-sm mb-4">{blog.excerpt}</p>
                  <Link
                    to={`/blog/${blog.id}`}
                    className="inline-flex items-center gap-2 text-secondary font-medium hover:gap-3 transition-all"
                  >
                    Read More
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.main>
  );
};

export default BlogPage;
