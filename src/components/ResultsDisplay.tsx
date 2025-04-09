
import React from 'react';
import { motion } from 'framer-motion';
import ResultCard, { HeaderResult } from '@/components/ResultCard';
import CodeBlock from '@/components/CodeBlock';

interface ResultsDisplayProps {
  result: HeaderResult;
  goCode: string;
  phpCode: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, goCode, phpCode }) => {
  return (
    <motion.div
      key="result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <ResultCard result={result} />
      
      {goCode && (
        <CodeBlock
          title="Equivalent Go Code"
          description="Here's a Go program that performs the same header check via command line. Copy this code, save it as "
          code={goCode}
          fileName="cachecheck.go"
          language="go run"
          delay={0.3}
        />
      )}

      {phpCode && (
        <CodeBlock
          title="Equivalent PHP Code (PHP 8.1+)"
          description="Here's a PHP script that performs the same header check. Copy this code, save it as "
          code={phpCode}
          fileName="cachecheck.php"
          language="php"
          delay={0.5}
        />
      )}
    </motion.div>
  );
};

export default ResultsDisplay;
