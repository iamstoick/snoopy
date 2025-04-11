
import React from 'react';

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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-gray-50">
          <p className="text-sm font-medium text-gray-500">Cache-Control</p>
          <p className="text-base font-medium text-gray-900">{cacheControl || "Not specified"}</p>
        </div>
        
        <div className="p-4 rounded-lg bg-gray-50">
          <p className="text-sm font-medium text-gray-500">Age</p>
          <p className="text-base font-medium text-gray-900">{age || "Not specified"}</p>
        </div>
        
        <div className="p-4 rounded-lg bg-gray-50">
          <p className="text-sm font-medium text-gray-500">Last-Modified</p>
          <p className="text-base font-medium text-gray-900">{lastModified || "Not specified"}</p>
        </div>
        
        <div className="p-4 rounded-lg bg-gray-50">
          <p className="text-sm font-medium text-gray-500">ETag</p>
          <p className="text-base font-medium text-gray-900">{etag || "Not specified"}</p>
        </div>

        <div className="p-4 rounded-lg bg-gray-50">
          <p className="text-sm font-medium text-gray-500">X-Served-By</p>
          <p className="text-base font-medium text-gray-900">{servedBy || "Not specified"}</p>
        </div>
        
        <div className="p-4 rounded-lg bg-gray-50">
          <p className="text-sm font-medium text-gray-500">X-Cache-Hits</p>
          <p className="text-base font-medium text-gray-900">{cacheHits || "Not specified"}</p>
        </div>
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
