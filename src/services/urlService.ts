
import { HeaderResult } from '@/components/ResultCard';
import { calculateCachingScore, generateSummary } from '@/utils/headerAnalyzer';

// This function simulates a fetch of HTTP headers that would normally be done by a backend
export const checkUrl = async (url: string): Promise<{
  result: HeaderResult;
  goCode: string;
  phpCode: string;
}> => {
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
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
    cachingScore
  };
  
  // Import these at runtime to avoid circular dependencies
  const { generateGoCode, generatePhpCode } = await import('@/utils/codeGenerators');
  
  // Generate the equivalent Go code
  const generatedGoCode = generateGoCode(url, serverType);
  
  // Generate the equivalent PHP code
  const generatedPhpCode = generatePhpCode(url, serverType);
  
  return {
    result: sampleResult,
    goCode: generatedGoCode,
    phpCode: generatedPhpCode
  };
};
