import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import { blogs } from '../data/products';

const BlogDetailPage = () => {
  const { id } = useParams();
  const blog = blogs.find(b => b.id === parseInt(id));

  if (!blog) {
    return (
      <div className="section-padding text-center">
        <p className="text-muted text-lg">Blog post not found</p>
        <Link to="/blog" className="btn-primary mt-4 inline-block">Back to Blog</Link>
      </div>
    );
  }

  const contentSections = blog.content.split('\n\n').filter(Boolean);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
          <span className="inline-block px-3 py-1 bg-secondary/20 text-secondary text-xs font-bold rounded-full mb-3">
            {blog.category}
          </span>
          <h1 className="text-2xl md:text-4xl font-display font-bold text-white">{blog.title}</h1>
          <div className="flex items-center gap-2 text-white/60 text-sm mt-3">
            <Calendar size={14} />
            {blog.date}
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-lg max-w-none"
        >
          <p className="text-xl text-muted leading-relaxed mb-8">{blog.excerpt}</p>

          {contentSections.map((section, index) => {
            if (section.startsWith('## ')) {
              return (
                <div key={index} className="mt-8 mb-4">
                  <h2 className="text-xl md:text-2xl font-display font-bold mb-4">{section.replace('## ', '')}</h2>
                </div>
              );
            }
            return (
              <p key={index} className="text-muted leading-relaxed mb-6">
                {section}
              </p>
            );
          })}
        </motion.div>

        <div className="mt-12 pt-8 border-t">
          <Link to="/blog" className="inline-flex items-center gap-2 text-secondary font-medium hover:gap-3 transition-all">
            <ArrowLeft size={16} />
            Back to all posts
          </Link>
        </div>
      </article>
    </motion.main>
  );
};

export default BlogDetailPage;
