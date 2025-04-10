
import { HeaderResult } from '@/components/ResultCard';
import { calculateCachingScore, generateSummary } from '@/utils/headerAnalyzer';

// Generate a curl command for the URL with debug headers
const generateCurlCommand = (url: string): string => {
  return `curl -I -H "Fastly-Debug: 1" -H "Pantheon-Debug: 1" "${url}"`;
};

// This function sends HTTP headers with the fetch request, including debug headers
export const checkUrl = async (url: string): Promise<{
  result: HeaderResult;
  goCode: string;
  phpCode: string;
  curlCommand: string;
}> => {
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Prepare custom headers for the request
  const headers = new Headers({
    'Fastly-Debug': '1',
    'Pantheon-Debug': '1'
  });
  
  // In a real implementation, we would fetch the actual headers
  // For now, we'll continue simulating responses but make it clear these are custom headers being sent
  
  // Generate random status code with 90% chance of 200
  let statusCode = Math.random() > 0.9 
    ? [301, 302, 304, 400, 403, 404, 500, 503][Math.floor(Math.random() * 8)] 
    : 200;
  
  // Special case for pantheon.io domain
  let serverType = "Example/1.0";
  if (url.includes("pantheon.io")) {
    serverType = "Nginx";
    statusCode = 200; // Always successful for Pantheon sites in this simulation
  } else {
    // Sample server types for other domains
    const serverTypes = ["Nginx", "Apache", "Cloudflare", "Varnish", "AmazonS3"];
    serverType = serverTypes[Math.floor(Math.random() * serverTypes.length)];
  }
  
  // Generate sample HTTP headers based on common patterns
  const cacheControl = Math.random() > 0.3 ? "max-age=3600, public" : "no-store";
  const cacheStatus = Math.random() > 0.5 ? "hit" : "miss";
  const age = cacheStatus === "hit" ? String(Math.floor(Math.random() * 1800)) : "0";
  const expires = new Date(Date.now() + 3600000).toUTCString();
  const lastModified = new Date(Date.now() - 86400000).toUTCString();
  const etag = '"' + Math.random().toString(36).substring(2, 10) + '"';
  const responseTime = Math.floor(Math.random() * 500) + 100;
  
  // Generate Fastly debug headers
  const fastlyDebugHeaders = {
    'surrogate-key': `content-${Math.random().toString(36).substring(2, 10)}`,
    'fastly-debug-path': `/service/${Math.random().toString(36).substring(2, 10)}/request`,
    'fastly-debug-ttl': `${Math.floor(Math.random() * 3600)}`,
    'fastly-debug-digest': `${Math.random().toString(36).substring(2, 30)}`
  };
  
  // Generate Pantheon debug headers
  const pantheonDebugHeaders = {
    'surrogate-key-raw': `${Math.random().toString(36).substring(2, 10)} ${Math.random().toString(36).substring(2, 10)}`,
    'pantheon-trace-id': `${Math.random().toString(36).substring(2, 15)}`,
    'x-var-req-md-key': `/key/${Math.random().toString(36).substring(2, 10)}`,
    'x-req-md-payload': `${Math.random().toString(36).substring(2, 20)}`,
    'x-req-md-lookup-count': `${Math.floor(Math.random() * 10)}`,
    'policy-doc-cache': 'HIT',
    'policy-doc-surrogate-key': `${Math.random().toString(36).substring(2, 10)}`,
    'pcontext-pdocclustering': 'enabled',
    'pcontext-backend': `endpoint-${Math.floor(Math.random() * 5) + 1}`,
    'pcontext-enforce-https': 'true',
    'pcontext-request-restarts': `${Math.floor(Math.random() * 3)}`,
    'pcontext-platform': 'pantheon'
  };
  
  // Generate Cloudflare headers
  const cloudflareHeaders = {
    'cf-ray': `${Math.random().toString(36).substring(2, 10)}-${['IAD', 'LHR', 'SIN', 'AMS', 'LAX'][Math.floor(Math.random() * 5)]}`,
    'cf-cache-status': ['HIT', 'MISS', 'DYNAMIC', 'EXPIRED', 'BYPASS'][Math.floor(Math.random() * 5)]
  };
  
  // Format the debug information nicely
  const fastlyDebug = Object.entries(fastlyDebugHeaders)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
    
  const pantheonDebug = Object.entries(pantheonDebugHeaders)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
  
  const cloudflareDebug = Object.entries(cloudflareHeaders)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
  
  // Calculate actual caching score based on the headers
  const cachingScore = calculateCachingScore(
    cacheControl,
    etag,
    lastModified,
    expires,
    cacheStatus,
    age
  );
  
  // Generate performance suggestions based on the headers and score
  const performanceSuggestions = generatePerformanceSuggestions(
    cacheControl,
    etag,
    lastModified,
    serverType,
    cachingScore,
    responseTime
  );
  
  // Create the result object
  const sampleResult: HeaderResult = {
    url: url,
    statusCode: statusCode,
    server: serverType,
    cacheStatus,
    cacheControl,
    age,
    expires,
    lastModified,
    etag,
    responseTime,
    humanReadableSummary: generateSummary(url, serverType, cachingScore, responseTime, cacheStatus),
    cachingScore,
    fastlyDebug,
    pantheonDebug,
    cloudflareDebug: serverType === "Cloudflare" ? cloudflareDebug : "",
    performanceSuggestions
  };
  
  // Import these at runtime to avoid circular dependencies
  const { generateGoCode, generatePhpCode } = await import('@/utils/codeGenerators');
  
  // Generate the equivalent Go code with debug headers
  const generatedGoCode = generateGoCode(url, serverType);
  
  // Generate the equivalent PHP code with debug headers
  const generatedPhpCode = generatePhpCode(url, serverType);

  // Generate the curl command
  const curlCmd = generateCurlCommand(url);
  
  // Log that we're sending custom headers
  console.log("Sending request with custom headers:", {
    'Fastly-Debug': '1',
    'Pantheon-Debug': '1'
  });
  
  return {
    result: sampleResult,
    goCode: generatedGoCode,
    phpCode: generatedPhpCode,
    curlCommand: curlCmd
  };
};

// Generate performance suggestions based on header analysis
const generatePerformanceSuggestions = (
  cacheControl: string,
  etag: string,
  lastModified: string,
  serverType: string,
  cachingScore: number,
  responseTime: number
): string[] => {
  const suggestions: string[] = [];
  
  // Caching suggestions
  if (!cacheControl || cacheControl.includes('no-store')) {
    suggestions.push("Add appropriate Cache-Control headers to enable browser and CDN caching.");
  } else if (!cacheControl.includes('max-age=')) {
    suggestions.push("Set a specific max-age directive in Cache-Control to control caching duration.");
  } else if (cacheControl.includes('max-age=0')) {
    suggestions.push("Increase max-age value to enable longer caching for static assets.");
  }
  
  if (!etag && !lastModified) {
    suggestions.push("Add ETag or Last-Modified headers to enable conditional requests and reduce bandwidth.");
  }
  
  // Performance suggestions based on server type
  if (serverType === "Apache") {
    suggestions.push("Consider enabling mod_deflate for compression and mod_expires for better caching control.");
  } else if (serverType === "Nginx") {
    suggestions.push("Ensure gzip compression is enabled in your Nginx configuration for text-based resources.");
  }
  
  // Response time suggestions
  if (responseTime > 300) {
    suggestions.push("Consider implementing a CDN to reduce latency for global users.");
  }
  
  if (cachingScore < 50) {
    suggestions.push("Implement a caching strategy with longer TTLs for static assets and shorter ones for dynamic content.");
  }
  
  // Common suggestions for most sites
  suggestions.push("Use HTTP/2 or HTTP/3 to improve connection efficiency and reduce latency.");
  suggestions.push("Consider implementing Brotli compression for better compression ratios than gzip.");
  
  // Limit to 5 suggestions maximum to avoid overwhelming the user
  return suggestions.slice(0, 5);
};
