
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from 'lucide-react';

interface CachingDetailsProps {
  cacheControl: string;
  age: string;
  lastModified: string;
  etag: string;
  servedBy: string;
  cacheHits: string;
  cachingScore: number;
}

const CachingDetails: React.FC<CachingDetailsProps> = ({
  cacheControl,
  age,
  lastModified,
  etag,
  servedBy,
  cacheHits,
  cachingScore
}) => {
  const getCachingScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  const renderCacheItem = (title: string, value: string, tooltip: string) => (
    <div className="p-4 rounded-lg bg-gray-50">
      <div className="flex items-center space-x-1">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <Tooltip>
          <TooltipTrigger>
            <HelpCircle className="h-4 w-4 text-gray-400" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="text-base font-medium text-gray-900">{value || "Not specified"}</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderCacheItem(
          "Cache-Control", 
          cacheControl, 
          "Directives for caching mechanisms in requests/responses. Values like 'max-age=3600' indicate content can be cached for 1 hour."
        )}
        
        {renderCacheItem(
          "Age", 
          age, 
          "Indicates how many seconds the object has been in a proxy cache. Higher numbers mean the content has been cached longer."
        )}
        
        {renderCacheItem(
          "Last-Modified", 
          lastModified, 
          "The date and time the server believes the resource was last modified. Used for conditional requests to check if content has changed."
        )}
        
        {renderCacheItem(
          "ETag", 
          etag, 
          "A unique identifier assigned to a specific version of a resource. Used for efficient cache validation without transferring the entire resource."
        )}

        {renderCacheItem(
          "X-Served-By", 
          servedBy, 
          "Indicates which server or cache node handled the request. Useful for debugging CDN behavior."
        )}
        
        {renderCacheItem(
          "X-Cache-Hits", 
          cacheHits, 
          "Number of times this resource was served from cache. Higher numbers indicate effective caching."
        )}
      </div>
      
      <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-gray-700">Caching Score</p>
          <p className={`text-lg font-semibold ${getCachingScoreColor(cachingScore)}`}>
            {cachingScore}/100
          </p>
        </div>
        <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${
              cachingScore >= 80 ? 'bg-green-500' : 
              cachingScore >= 50 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${cachingScore}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CachingDetails;
