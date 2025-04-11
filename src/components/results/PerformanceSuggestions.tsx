
import React from 'react';
import { Zap } from 'lucide-react';

interface PerformanceSuggestionsProps {
  suggestions: string[];
}

const PerformanceSuggestions: React.FC<PerformanceSuggestionsProps> = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
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
  );
};

export default PerformanceSuggestions;
