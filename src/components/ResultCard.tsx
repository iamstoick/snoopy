
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ServerIcon, Database, Clock, Bug } from 'lucide-react';

export interface HeaderResult {
  url: string;
  statusCode: number;
  server: string;
  cacheStatus: string;
  cacheControl: string;
  age: string;
  expires: string;
  lastModified: string;
  etag: string;
  responseTime: number;
  humanReadableSummary: string;
  cachingScore: number;
  fastlyDebug?: string;
  pantheonDebug?: string;
}

interface ResultCardProps {
  result: HeaderResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const getCacheStatusColor = (status: string) => {
    if (status.includes('hit')) return 'text-green-600';
    if (status.includes('miss')) return 'text-orange-500';
    return 'text-gray-600';
  };

  const getCachingScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  const renderMetric = (icon: React.ReactNode, title: string, value: string | number, color?: string) => (
    <div className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50">
      <div className="bg-white p-2 rounded-md shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className={`text-base font-medium ${color || 'text-gray-900'}`}>{value}</p>
      </div>
    </div>
  );

  // Helper to format multiline debug content
  const formatDebugContent = (content: string) => {
    if (!content) return null;
    
    return content.split('\n').map((line, index) => (
      <p key={index} className="text-base font-medium text-gray-900 py-1">{line}</p>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-4xl mx-auto px-4"
    >
      <Card className="overflow-hidden border-0 shadow-lg rounded-2xl">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-gray-900">{result.url}</h2>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                result.statusCode >= 200 && result.statusCode < 300 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {result.statusCode}
              </span>
            </div>
            <div className="mt-2">
              <p className="text-gray-700 leading-relaxed">
                {result.humanReadableSummary}
              </p>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderMetric(
              <ServerIcon className="w-5 h-5 text-blue-500" />,
              "Server Type",
              result.server || "Unknown"
            )}
            
            {renderMetric(
              <Database className="w-5 h-5 text-indigo-500" />,
              "Cache Status",
              result.cacheStatus || "Not specified",
              getCacheStatusColor(result.cacheStatus)
            )}
            
            {renderMetric(
              <Clock className="w-5 h-5 text-purple-500" />,
              "Response Time",
              `${result.responseTime} ms`
            )}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Caching Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-500">Cache-Control</p>
                  <p className="text-base font-medium text-gray-900">{result.cacheControl || "Not specified"}</p>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-500">Age</p>
                  <p className="text-base font-medium text-gray-900">{result.age || "Not specified"}</p>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-500">Last-Modified</p>
                  <p className="text-base font-medium text-gray-900">{result.lastModified || "Not specified"}</p>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-500">ETag</p>
                  <p className="text-base font-medium text-gray-900">{result.etag || "Not specified"}</p>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-700">Caching Score</p>
                  <p className={`text-lg font-semibold ${getCachingScoreColor(result.cachingScore)}`}>
                    {result.cachingScore}/100
                  </p>
                </div>
                <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      result.cachingScore >= 80 ? 'bg-green-500' : 
                      result.cachingScore >= 50 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${result.cachingScore}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Custom Debug Headers Section with improved formatting */}
              {(result.fastlyDebug || result.pantheonDebug) && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="mb-4 text-lg font-medium text-gray-900 flex items-center">
                    <Bug className="w-5 h-5 mr-2 text-blue-500" />
                    Debug Headers
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {result.fastlyDebug && (
                      <div className="p-4 rounded-lg bg-gray-50 border-l-4 border-blue-500">
                        <p className="text-sm font-medium text-gray-500 mb-2">Fastly-Debug:1</p>
                        <div className="space-y-1">
                          {formatDebugContent(result.fastlyDebug)}
                        </div>
                      </div>
                    )}
                    
                    {result.pantheonDebug && (
                      <div className="p-4 rounded-lg bg-gray-50 border-l-4 border-purple-500">
                        <p className="text-sm font-medium text-gray-500 mb-2">Pantheon-Debug:1</p>
                        <div className="space-y-1">
                          {formatDebugContent(result.pantheonDebug)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResultCard;
