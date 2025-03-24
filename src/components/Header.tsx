
import React from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header 
      className="py-8 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container px-4 mx-auto">
        <h1 className="text-3xl font-light text-center text-gray-900 md:text-4xl lg:text-5xl">
          <span className="font-semibold">Cache</span>Checker
        </h1>
        <p className="mt-2 text-base text-center text-gray-500 md:text-lg">
          Simplifying HTTP caching insights
        </p>
      </div>
    </motion.header>
  );
};

export default Header;
