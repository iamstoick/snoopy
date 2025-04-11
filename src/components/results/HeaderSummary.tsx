
import React from 'react';

interface HeaderSummaryProps {
  url: string;
  status: number;
  summary: string;
}

const HeaderSummary: React.FC<HeaderSummaryProps> = ({ url, status, summary }) => {
  const getStatusCodeColor = (code: number) => {
    if (code >= 200 && code < 300) return 'bg-green-100 text-green-800';
    if (code >= 300 && code < 400) return 'bg-blue-100 text-blue-800';
    if (code >= 400 && code < 500) return 'bg-orange-100 text-orange-800';
    if (code >= 500) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-gray-900">{url}</h2>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusCodeColor(status)}`}>
            {status}
          </span>
        </div>
        <div className="mt-2">
          <p className="text-gray-700 leading-relaxed">
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeaderSummary;
