
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ServerIcon, Database, Clock, Bug, Zap, Shield, Info } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export interface HeaderResult {
  headers: Record<string, string>;
  url: string;
  status: number;
  humanReadableSummary: string;
  cachingScore: number;
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

  const getStatusCodeColor = (code: number) => {
    if (code >= 200 && code < 300) return 'bg-green-100 text-green-800';
    if (code >= 300 && code < 400) return 'bg-blue-100 text-blue-800';
    if (code >= 400 && code < 500) return 'bg-orange-100 text-orange-800';
    if (code >= 500) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
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

  return content.split('\n').map((line, index) => {
    const parts = line.split(': '); // Split each line by the colon and space
    const key = parts[0];
    const value = parts.slice(1).join(': '); // Join back in case the value has colons

    return (
      <p key={index} className="text-sm font-small text-gray-500 py-0">
        <span style={{ color: 'green', fontWeight: 'bold' }}>{key}</span>: {value}
      </p>
    );
  });
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
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusCodeColor(result.statusCode)}`}>
                {result.status}
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
              result.headers['server'] || "Unknown"
            )}
            
            {renderMetric(
              <Database className="w-5 h-5 text-indigo-500" />,
              "Cache Status",
              result.headers['x-cache'] || "Not specified",
              getCacheStatusColor(result.headers['x-cache'])
            )}
            
            {renderMetric(
              <Clock className="w-5 h-5 text-purple-500" />,
              "Response Time",
              `${result.headers['response-time']} ms`
            )}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Caching Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-500">Cache-Control</p>
                  <p className="text-base font-medium text-gray-900">{result.headers['cache-control'] || "Not specified"}</p>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-500">Age</p>
                  <p className="text-base font-medium text-gray-900">{result.headers['age'] || "Not specified"}</p>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-500">Last-Modified</p>
                  <p className="text-base font-medium text-gray-900">{result.headers['lastModified'] || "Not specified"}</p>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-500">ETag</p>
                  <p className="text-base font-medium text-gray-900">{result.headers['etag'] || "Not specified"}</p>
                </div>

                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-500">X-Served-By</p>
                  <p className="text-base font-medium text-gray-900">{result.headers['x-served-by'] || "Not specified"}</p>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-500">X-Cache-Hits</p>
                  <p className="text-base font-medium text-gray-900">{result.headers['x-cache-hits'] || "Not specified"}</p>
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
              
              {/* Performance Suggestions Section */}
              {result.performanceSuggestions && result.performanceSuggestions.length > 0 && (
                <div className="p-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-400">
                  <div className="flex items-center mb-2">
                    <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                    <h4 className="text-base font-medium text-gray-900">Performance Suggestions</h4>
                  </div>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.performanceSuggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-gray-700">{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Security Headers Section */}
              {(result.securityHeaders) && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="mb-4 text-lg font-medium text-gray-900 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-blue-500" />
                    Security Related Headers
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {result.fastlyDebug && (
                      <div className="p-4 rounded-lg bg-gray-50 border-l-4 border-blue-500">
                        <div className="space-y-1">
                          {formatDebugContent(result.securityHeaders)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
 
              {/* Other Headers Section */}
              {(result.usefulHeaders) && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="mb-4 text-lg font-medium text-gray-900 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-blue-500" />
                    Random Headers
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {result.fastlyDebug && (
                      <div className="p-4 rounded-lg bg-gray-50 border-l-4 border-blue-500">
                        <div className="space-y-1">
                          {formatDebugContent(result.usefulHeaders)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Debug Headers Section with improved formatting */}
              {(result.fastlyDebug || result.pantheonDebug || result.cloudflareDebug || result.cloudfrontDebugHeaders) && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="mb-4 text-lg font-medium text-gray-900 flex items-center">
                    <Bug className="w-5 h-5 mr-2 text-blue-500" />
                    Debug Headers
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {result.fastlyDebug && (
                      <div className="p-4 rounded-lg bg-gray-50 border-l-4 border-blue-500">
                        <p className="text-sm font-medium text-gray-500 mb-2">Fastly-Debug Headers</p>
                        <div className="space-y-1">
                          {formatDebugContent(result.fastlyDebug)}
                        </div>
                      </div>
                    )}
                    
                    {result.pantheonDebug && (
                      <div className="p-4 rounded-lg bg-gray-50 border-l-4 border-purple-500">
                        <p className="text-sm font-medium text-gray-500 mb-2">Pantheon-Debug Headers</p>
                        <div className="space-y-1">
                          {formatDebugContent(result.pantheonDebug)}
                        </div>
                      </div>
                    )}

                    {result.cloudflareDebug && (
                      <div className="p-4 rounded-lg bg-gray-50 border-l-4 border-orange-500">
                        <p className="text-sm font-medium text-gray-500 mb-2">Cloudflare Headers</p>
                        <div className="space-y-1">
                          {formatDebugContent(result.cloudflareDebug)}
                        </div>
                      </div>
                    )}

                    {result.cloudfrontDebugHeaders && (
                      <div className="p-4 rounded-lg bg-gray-50 border-l-4 border-orange-500">
                        <p className="text-sm font-medium text-gray-500 mb-2">Cloudfront Headers</p>
                        <div className="space-y-1">
                          {formatDebugContent(result.cloudfrontDebugHeaders)}
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
