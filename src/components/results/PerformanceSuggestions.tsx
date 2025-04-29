
import React from 'react';
import { Zap, Globe, Cpu } from 'lucide-react';

interface PerformanceSuggestionsProps {
  suggestions: string[];
  httpVersion?: string;
  ipAddress?: string;
  ipLocation?: string;
  ipOrg?: string;
}

const PerformanceSuggestions: React.FC<PerformanceSuggestionsProps> = ({ 
  suggestions,
  httpVersion,
  ipAddress,
  ipLocation,
  ipOrg
}) => {
  return (
    <div className="space-y-4 my-6">
      {(httpVersion || ipAddress) && (
        <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400">
          <div className="flex items-center mb-3">
            <Globe className="w-5 h-5 mr-2 text-blue-500" />
            <h4 className="text-base font-medium text-gray-900">Connection Details</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {httpVersion && (
              <div className="p-3 bg-white rounded shadow-sm">
                <p className="text-sm font-medium text-gray-500">HTTP Protocol</p>
                <p className="text-base font-medium text-gray-900">{httpVersion}</p>
              </div>
            )}
            {ipAddress && (
              <div className="p-3 bg-white rounded shadow-sm">
                <p className="text-sm font-medium text-gray-500">IP Address</p>
                <p className="text-base font-medium text-gray-900">{ipAddress} - {ipOrg}</p>
                {ipLocation && <p className="text-sm text-gray-600 mt-1">{ipLocation}</p>}
              </div>
            )}
          </div>
        </div>
      )}

      {suggestions && suggestions.length > 0 && (
        <div className="p-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-400">
          <div className="flex items-center mb-2">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            <h4 className="text-base font-medium text-gray-900">Performance Suggestions</h4>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-gray-700">{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PerformanceSuggestions;
