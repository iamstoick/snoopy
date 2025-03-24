
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface UrlFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const UrlForm: React.FC<UrlFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      // Add https:// protocol if not present
      let processedUrl = url;
      if (!/^https?:\/\//i.test(url)) {
        processedUrl = 'https://' + url;
      }
      onSubmit(processedUrl);
    }
  };

  return (
    <motion.div
      className="w-full max-w-2xl px-4 mx-auto mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    >
      <form onSubmit={handleSubmit} className="relative flex">
        <div className="relative flex-grow">
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., google.com)"
            className="pr-4 text-base h-14 rounded-xl border-gray-200 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || !url}
          className="ml-2 h-14 px-6 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-white font-medium"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Search className="w-5 h-5" />
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default UrlForm;
