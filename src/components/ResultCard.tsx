
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import HeaderSummary from './results/HeaderSummary';
import HeaderInfo from './results/HeaderInfo';
import CachingDetails from './results/CachingDetails';
import PerformanceSuggestions from './results/PerformanceSuggestions';
import DebugHeaders from './results/DebugHeaders';

export interface HeaderResult {
  headers: Record<string, string>;
  responseTime: string;
  url: string;
  status: number;
  humanReadableSummary: string;
  cachingScore: number;
  httpVersion?: string;
  ipAddress?: string;
  ipLocation?: string;
  ipOrg?: string;
  securityHeaders?: string;
  usefulHeaders?: string;
  fastlyDebug?: string;
  pantheonDebug?: string;
  cloudflareDebug?: string;
  cloudfrontDebugHeaders?: string;
  performanceSuggestions?: string[];
}

interface ResultCardProps {
  result: HeaderResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-4xl mx-auto px-4"
    >
      <Card className="overflow-hidden border-0 shadow-lg rounded-2xl">
        <HeaderSummary 
          url={result.url} 
          status={result.status} 
          summary={result.humanReadableSummary}
        />
        
        <CardContent className="p-6">
          <HeaderInfo
            server={result.headers['server'] || ''}
            cacheStatus={result.headers['x-cache'] || ''}
            responseTime={result.headers['response-time'] || '0'}
            status={result.status}
          />
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Caching Details</h3>
            <CachingDetails
              cacheControl={result.headers['cache-control'] || ''}
              age={result.headers['age'] || ''}
              lastModified={result.headers['last-modified'] || ''}
              etag={result.headers['etag'] || ''}
              servedBy={result.headers['x-served-by'] || ''}
              cacheHits={result.headers['x-cache-hits'] || ''}
              cachingScore={result.cachingScore}
            />
            
            <PerformanceSuggestions 
              suggestions={result.performanceSuggestions || []} 
              httpVersion={result.httpVersion}
              ipAddress={result.ipAddress}
              ipLocation={result.ipLocation}
              ipOrg={result.ipOrg}
            />

            <DebugHeaders
              fastlyDebug={result.fastlyDebug}
              pantheonDebug={result.pantheonDebug}
              cloudflareDebug={result.cloudflareDebug}
              cloudfrontDebugHeaders={result.cloudfrontDebugHeaders}
              securityHeaders={result.securityHeaders}
              usefulHeaders={result.usefulHeaders}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResultCard;
