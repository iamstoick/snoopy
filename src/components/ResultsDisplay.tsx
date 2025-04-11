
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ResultCard, { HeaderResult } from '@/components/ResultCard';
import CodeBlock from '@/components/CodeBlock';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ResultsDisplayProps {
  result: HeaderResult;
  goCode: string;
  phpCode: string;
  curlCommand: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, goCode, phpCode, curlCommand }) => {
  const [isGoExpanded, setIsGoExpanded] = useState(false);
  const [isPhpExpanded, setIsPhpExpanded] = useState(false);
  const [isCurlExpanded, setIsCurlExpanded] = useState(false);

  const CodeExpander = ({ 
    title, 
    isExpanded, 
    setIsExpanded, 
    code, 
    fileName, 
    language, 
    description, 
    delay 
  }: { 
    title: string;
    isExpanded: boolean;
    setIsExpanded: (value: boolean) => void;
    code: string;
    fileName: string;
    language: string;
    description: string;
    delay: number;
  }) => {
    if (!code) return null;
    
    return (
      <Collapsible
        open={isExpanded}
        onOpenChange={setIsExpanded}
        className="w-full"
      >
        <div className="bg-gray-900 text-gray-100 p-6 rounded-full shadow-lg">
          <CollapsibleTrigger className="flex justify-between items-center w-full">
            <h2 className="text-xl font-semibold">{title}</h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-400 mr-2">
                {isExpanded ? 'Click to collapse' : 'Click to expand'}
              </span>
              {isExpanded ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </div>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <CodeBlock
            title=""
            description={description}
            code={code}
            fileName={fileName}
            language={language}
            delay={delay}
          />
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <ResultCard result={result} />
      
      <CodeExpander
        title="cURL Command"
        isExpanded={isCurlExpanded}
        setIsExpanded={setIsCurlExpanded}
        code={curlCommand}
        fileName="terminal"
        language="bash"
        description="Use this curl command to fetch HTTP headers via command line:"
        delay={0.1}
      />
      
      <CodeExpander
        title="Equivalent Go Code"
        isExpanded={isGoExpanded}
        setIsExpanded={setIsGoExpanded}
        code={goCode}
        fileName="cachecheck.go"
        language="go run"
        description="Here's a Go program that performs the same header check via command line. Copy this code, save it as"
        delay={0.3}
      />

      <CodeExpander
        title="Equivalent PHP Code (PHP 8.1+)"
        isExpanded={isPhpExpanded}
        setIsExpanded={setIsPhpExpanded}
        code={phpCode}
        fileName="cachecheck.php"
        language="php"
        description="Here's a PHP script that performs the same header check. Copy this code, save it as"
        delay={0.5}
      />
    </motion.div>
  );
};

export default ResultsDisplay;
