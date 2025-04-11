
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

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <ResultCard result={result} />
      
      {curlCommand && (
        <Collapsible
          open={isCurlExpanded}
          onOpenChange={setIsCurlExpanded}
          className="w-full"
        >
          <div className="bg-gray-900 text-gray-100 p-6 rounded-full shadow-lg">
            <CollapsibleTrigger className="flex justify-between items-center w-full">
              <h2 className="text-xl font-semibold">cURL Command</h2>
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-2">
                  {isCurlExpanded ? 'Click to collapse' : 'Click to expand'}
                </span>
                {isCurlExpanded ? (
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
              description="Use this curl command to fetch HTTP headers via command line:"
              code={curlCommand}
              fileName="terminal"
              language="bash"
              delay={0.1}
            />
          </CollapsibleContent>
        </Collapsible>
      )}
      
      {goCode && (
        <Collapsible
          open={isGoExpanded}
          onOpenChange={setIsGoExpanded}
          className="w-full"
        >
          <div className="bg-gray-900 text-gray-100 p-6 rounded-full shadow-lg">
            <CollapsibleTrigger className="flex justify-between items-center w-full">
              <h2 className="text-xl font-semibold">Equivalent Go Code</h2>
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-2">
                  {isGoExpanded ? 'Click to collapse' : 'Click to expand'}
                </span>
                {isGoExpanded ? (
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
              description="Here's a Go program that performs the same header check via command line. Copy this code, save it as"
              code={goCode}
              fileName="cachecheck.go"
              language="go run"
              delay={0.3}
            />
          </CollapsibleContent>
        </Collapsible>
      )}

      {phpCode && (
        <Collapsible
          open={isPhpExpanded}
          onOpenChange={setIsPhpExpanded}
          className="w-full"
        >
          <div className="bg-gray-900 text-gray-100 p-6 rounded-full shadow-lg">
            <CollapsibleTrigger className="flex justify-between items-center w-full">
              <h2 className="text-xl font-semibold">Equivalent PHP Code (PHP 8.1+)</h2>
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-2">
                  {isPhpExpanded ? 'Click to collapse' : 'Click to expand'}
                </span>
                {isPhpExpanded ? (
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
              description="Here's a PHP script that performs the same header check. Copy this code, save it as"
              code={phpCode}
              fileName="cachecheck.php"
              language="php"
              delay={0.5}
            />
          </CollapsibleContent>
        </Collapsible>
      )}
    </motion.div>
  );
};

export default ResultsDisplay;
