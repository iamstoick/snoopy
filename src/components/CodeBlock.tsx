
import React from 'react';
import { motion } from 'framer-motion';
import { toast } from "@/components/ui/use-toast";

interface CodeBlockProps {
  title: string;
  description: string;
  code: string;
  fileName: string;
  language: string;
  delay: number;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ 
  title, 
  description, 
  code, 
  fileName, 
  language,
  delay 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay }}
      className="mt-8 bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="text-gray-300 mb-4">
        {description}
        <code className="bg-gray-800 px-2 py-1 rounded">{fileName}</code>, 
        and run with <code className="bg-gray-800 px-2 py-1 rounded">{language} {fileName} example.com</code>
      </p>
      <div className="relative">
        <pre className="overflow-x-auto text-sm p-4 bg-gray-800 rounded">
          <code>{code}</code>
        </pre>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(code);
            toast({
              title: `${title} copied!`,
              description: `The ${language} code has been copied to your clipboard.`,
            });
          }}
          className="absolute right-4 top-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Copy
        </button>
      </div>
    </motion.div>
  );
};

export default CodeBlock;
