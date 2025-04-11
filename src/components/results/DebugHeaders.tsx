import React from 'react';
import { Bug, Shield, Info } from 'lucide-react';

interface DebugHeadersProps {
  fastlyDebug?: string;
  pantheonDebug?: string;
  cloudflareDebug?: string;
  cloudfrontDebugHeaders?: string;
  securityHeaders?: string;
  usefulHeaders?: string;
}

const DebugHeaders: React.FC<DebugHeadersProps> = ({
  fastlyDebug,
  pantheonDebug,
  cloudflareDebug,
  cloudfrontDebugHeaders,
  securityHeaders,
  usefulHeaders
}) => {
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

  const hasDebugHeaders = fastlyDebug || pantheonDebug || cloudflareDebug || cloudfrontDebugHeaders;
  const hasSecurityHeaders = securityHeaders;
  const hasUsefulHeaders = usefulHeaders;

  if (!hasDebugHeaders && !hasSecurityHeaders && !hasUsefulHeaders) return null;

  return (
    <>
      {/* Security Headers Section */}
      {hasSecurityHeaders && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="mb-4 text-lg font-medium text-gray-900 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-500" />
            Security Related Headers
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 border-l-4 border-blue-500">
              <div className="space-y-1">
                {formatDebugContent(securityHeaders || '')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other Headers Section */}
      {hasUsefulHeaders && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="mb-4 text-lg font-medium text-gray-900 flex items-center">
            <Info className="w-5 h-5 mr-2 text-blue-500" />
            Random Headers
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 border-l-4 border-blue-500">
              <div className="space-y-1">
                {formatDebugContent(usefulHeaders || '')}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Debug Headers Section */}
      {hasDebugHeaders && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="mb-4 text-lg font-medium text-gray-900 flex items-center">
            <Bug className="w-5 h-5 mr-2 text-blue-500" />
            Debug Headers
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {fastlyDebug && (
              <div className="p-4 rounded-lg bg-gray-50 border-l-4 border-blue-500">
                <p className="text-sm font-medium text-gray-500 mb-2">Fastly-Debug Headers</p>
                <div className="space-y-1">
                  {formatDebugContent(fastlyDebug)}
                </div>
              </div>
            )}
            
            {pantheonDebug && (
              <div className="p-4 rounded-lg bg-gray-50 border-l-4 border-purple-500">
                <p className="text-sm font-medium text-gray-500 mb-2">Pantheon-Debug Headers</p>
                <div className="space-y-1">
                  {formatDebugContent(pantheonDebug)}
                </div>
              </div>
            )}

            {cloudflareDebug && (
              <div className="p-4 rounded-lg bg-gray-50 border-l-4 border-orange-500">
                <p className="text-sm font-medium text-gray-500 mb-2">Cloudflare Headers</p>
                <div className="space-y-1">
                  {formatDebugContent(cloudflareDebug)}
                </div>
              </div>
            )}

            {cloudfrontDebugHeaders && (
              <div className="p-4 rounded-lg bg-gray-50 border-l-4 border-orange-500">
                <p className="text-sm font-medium text-gray-500 mb-2">Cloudfront Headers</p>
                <div className="space-y-1">
                  {formatDebugContent(cloudfrontDebugHeaders)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DebugHeaders;
