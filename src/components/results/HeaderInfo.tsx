
import React from 'react';
import { ServerIcon, Database, Clock } from 'lucide-react';

interface HeaderInfoProps {
  server: string;
  cacheStatus: string;
  responseTime: string;
  status: number;
}

const HeaderInfo: React.FC<HeaderInfoProps> = ({ server, cacheStatus, responseTime, status }) => {
  const getCacheStatusColor = (status: string) => {
    if (status.includes('hit')) return 'text-green-600';
    if (status.includes('miss')) return 'text-orange-500';
    return 'text-gray-600';
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {renderMetric(
        <ServerIcon className="w-5 h-5 text-blue-500" />,
        "Server Type",
        server || "Unknown"
      )}
      
      {renderMetric(
        <Database className="w-5 h-5 text-indigo-500" />,
        "Cache Status",
        cacheStatus || "Not specified",
        getCacheStatusColor(cacheStatus)
      )}
      
      {renderMetric(
        <Clock className="w-5 h-5 text-purple-500" />,
        "Response Time",
        `${responseTime} ms`
      )}
    </div>
  );
};

export default HeaderInfo;
