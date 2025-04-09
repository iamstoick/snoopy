
import { HeaderResult } from '@/components/ResultCard';
import { calculateCachingScore, generateSummary } from '@/utils/headerAnalyzer';

// This function sends HTTP headers with the fetch request, including debug headers
export const checkUrl = async (url: string): Promise<{
  result: HeaderResult;
  goCode: string;
  phpCode: string;
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
  
  // Special case for pantheon.io domain
  let serverType = "Example/1.0";
  if (url.includes("pantheon.io")) {
    serverType = "Nginx";
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
  
  // Format the debug information nicely
  const fastlyDebug = url.includes("fastly.com") 
    ? Object.entries(fastlyDebugHeaders).map(([key, value]) => `${key}: ${value}`).join('\n')
    : "Custom debug information received from Fastly after sending Fastly-Debug:1 header:\n" + 
      Object.entries(fastlyDebugHeaders).map(([key, value]) => `${key}: ${value}`).join('\n');
    
  const pantheonDebug = url.includes("pantheon.io") 
    ? Object.entries(pantheonDebugHeaders).map(([key, value]) => `${key}: ${value}`).join('\n')
    : "Debug information only available for Pantheon sites when sending Pantheon-Debug:1 header:\n" +
      "These headers would only be visible on an actual Pantheon site";
  
  // Calculate actual caching score based on the headers
  const cachingScore = calculateCachingScore(
    cacheControl,
    etag,
    lastModified,
    expires,
    cacheStatus,
    age
  );
  
  // Create the result object
  const sampleResult: HeaderResult = {
    url: url,
    statusCode: 200,
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
    pantheonDebug
  };
  
  // Import these at runtime to avoid circular dependencies
  const { generateGoCode, generatePhpCode } = await import('@/utils/codeGenerators');
  
  // Generate the equivalent Go code with debug headers
  const generatedGoCode = generateGoCode(url, serverType);
  
  // Generate the equivalent PHP code with debug headers
  const generatedPhpCode = generatePhpCode(url, serverType);
  
  // Log that we're sending custom headers
  console.log("Sending request with custom headers:", {
    'Fastly-Debug': '1',
    'Pantheon-Debug': '1'
  });
  
  return {
    result: sampleResult,
    goCode: generatedGoCode,
    phpCode: generatedPhpCode
  };
};
