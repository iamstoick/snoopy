
import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer 
      className="py-8 mt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div className="container px-4 mx-auto">
        <p className="text-sm text-center text-gray-500">
          CacheChecker — Check HTTP caching headers with elegance and simplicity.
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
