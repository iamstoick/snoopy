
import React from 'react';
import { motion } from 'framer-motion';

const InstructionBlock: React.FC = () => {
  return (
    <motion.div 
      key="instruction"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center py-16"
    >
      <p className="text-gray-500 max-w-xl mx-auto">
        Enter any website URL above to analyze its HTTP caching headers. 
        We'll explain the results in plain English so you can understand how 
        the website's caching is configured. Plus, we'll show you the equivalent code 
        in Go and PHP to perform the same analysis!
      </p>
    </motion.div>
  );
};

export default InstructionBlock;
