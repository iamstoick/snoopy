
// Utility for analyzing HTTP headers and calculating caching scores

// Calculate caching score based on HTTP headers
export const calculateCachingScore = (
  cacheControl: string, 
  etag: string, 
  lastModified: string, 
  expires: string,
  cacheStatus: string,
  age: string
): number => {
  let score = 0;
  
  // Check if cache-control is present (max 40 points)
  if (cacheControl) {
    score += 10; // Basic points for having cache-control
    
    // Check for public directive
    if (cacheControl.includes('public')) {
      score += 5;
    }
    
    // Check for max-age directive
    if (cacheControl.includes('max-age=')) {
      score += 10;
      
      // Extract max-age value
      const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
      if (maxAgeMatch && maxAgeMatch[1]) {
        const maxAge = parseInt(maxAgeMatch[1], 10);
        
        // Higher max-age values get more points (up to 15 additional points)
        if (maxAge > 86400) { // > 1 day
          score += 15;
        } else if (maxAge > 3600) { // > 1 hour
          score += 10;
        } else if (maxAge > 60) { // > 1 minute
          score += 5;
        }
      }
    }
  }
  
  // Check for validation mechanisms (max 20 points)
  if (etag) {
    score += 10; // Points for ETag
  }
  
  if (lastModified) {
    score += 10; // Points for Last-Modified
  }
  
  // Check for Expires header (max 10 points)
  if (expires) {
    score += 5;
    
    // Check if expires is in the future
    try {
      const expiresDate = new Date(expires);
      if (expiresDate > new Date()) {
        score += 5;
      }
    } catch (e) {
      // Invalid date format, no additional points
    }
  }
  
  // Check for Age header (max 10 points)
  if (age) {
    score += 5;
    
    // If age is present and greater than 0, the resource was cached
    try {
      const ageValue = parseInt(age, 10);
      if (ageValue > 0) {
        score += 5;
      }
    } catch (e) {
      // Invalid age format, no additional points
    }
  }
  
  // Cache hit status gives bonus points (max 20 points)
  if (cacheStatus.includes('hit')) {
    score += 20;
  }
  
  // Cap score at 100
  return Math.min(score, 100);
};

// Generate a sample summary based on the score and other details
export const generateSummary = (url: string, serverType: string, score: number, responseTime: number, cacheStatus: string) => {
  if (score >= 80) {
    return `This website is using ${serverType} and has excellent caching configuration. ${
      cacheStatus.includes('hit') 
        ? `The page was served from cache, resulting in a fast response time of ${responseTime}ms.` 
        : `The page has proper cache headers, allowing browsers to store content locally.`
    } Repeat visitors will experience faster page loads and reduced server load.`;
  } else if (score >= 50) {
    return `This website is using ${serverType} and has decent caching configuration. ${
      cacheStatus.includes('hit')
        ? `The page was served from cache with a response time of ${responseTime}ms.`
        : `The page has some cache headers but could be optimized further.`
    } There's room for improvement to enhance user experience for repeat visitors.`;
  } else {
    return `This website is using ${serverType} but has poor or missing caching configuration. ${
      `The page took ${responseTime}ms to load and wasn't properly cached.`
    } Implementing proper caching would significantly improve performance for repeat visitors and reduce server load.`;
  }
};
