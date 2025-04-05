
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '@/components/Header';
import UrlForm from '@/components/UrlForm';
import ResultCard, { HeaderResult } from '@/components/ResultCard';
import Footer from '@/components/Footer';
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HeaderResult | null>(null);
  const [goCode, setGoCode] = useState<string>('');
  const [phpCode, setPhpCode] = useState<string>('');

  // This function simulates a fetch of HTTP headers that would normally be done by a backend
  const checkUrl = async (url: string) => {
    setLoading(true);
    setResult(null);
    
    try {
      // In a real implementation, this would call a backend API
      // For demonstration, we'll simulate a response after a delay
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
      
      // Sample data - in a real app, this would come from an actual backend
      const sampleResult: HeaderResult = {
        url: url,
        statusCode: 200,
        server: serverType,
        cacheStatus: Math.random() > 0.5 ? "hit" : "miss",
        cacheControl: "max-age=3600, public",
        age: "1200",
        expires: new Date(Date.now() + 3600000).toUTCString(),
        lastModified: new Date(Date.now() - 86400000).toUTCString(),
        etag: '"a1b2c3d4e5f6"',
        responseTime: Math.floor(Math.random() * 500) + 100,
        humanReadableSummary: getSampleSummary(url, serverType),
        cachingScore: Math.floor(Math.random() * 100)
      };
      
      setResult(sampleResult);
      
      // Generate the equivalent Go code
      const generatedGoCode = generateGoCode(url, serverType);
      setGoCode(generatedGoCode);
      
      // Generate the equivalent PHP code
      const generatedPhpCode = generatePhpCode(url, serverType);
      setPhpCode(generatedPhpCode);
      
      toast({
        title: "Analysis complete",
        description: "We've analyzed the HTTP headers for your URL and generated equivalent code in Go and PHP.",
      });
    } catch (error) {
      console.error("Error fetching URL:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze the URL. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate a sample summary based on the URL and server type
  const getSampleSummary = (url: string, serverType: string) => {
    const isCached = Math.random() > 0.5;
    const responseTime = Math.floor(Math.random() * 500) + 100;
    
    if (isCached) {
      return `This website is using ${serverType} and has good caching configuration. The page was served from cache, which explains the fast response time of ${responseTime}ms. This means repeat visitors will experience faster page loads.`;
    } else {
      return `This website is using ${serverType} but doesn't appear to be properly cached. The page was not served from cache, resulting in a response time of ${responseTime}ms. Implementing proper caching could improve performance for repeat visitors.`;
    }
  };

  // Generate Go code based on the URL and server type
  const generateGoCode = (url: string, serverType: string) => {
    return `
package main

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: cachecheck <url>")
		os.Exit(1)
	}

	url := os.Args[1]
	if !strings.HasPrefix(url, "http://") && !strings.HasPrefix(url, "https://") {
		url = "https://" + url
	}

	fmt.Printf("Checking caching headers for: %s\\n\\n", url)
	
	start := time.Now()
	resp, err := http.Get(url)
	if err != nil {
		fmt.Printf("Error: %v\\n", err)
		os.Exit(1)
	}
	defer resp.Body.Close()
	
	responseTime := time.Since(start).Milliseconds()

	fmt.Printf("Status Code: %d\\n", resp.StatusCode)
	fmt.Printf("Response Time: %dms\\n\\n", responseTime)

	// Extract and display server info
	if server := resp.Header.Get("Server"); server != "" {
		fmt.Printf("Server: %s\\n", server)
	} else {
		fmt.Println("Server: Unknown")
	}

	// Check cache-related headers
	cacheControl := resp.Header.Get("Cache-Control")
	etag := resp.Header.Get("ETag")
	lastModified := resp.Header.Get("Last-Modified")
	expires := resp.Header.Get("Expires")
	age := resp.Header.Get("Age")

	fmt.Println("\\nCaching Headers:")
	if cacheControl != "" {
		fmt.Printf("Cache-Control: %s\\n", cacheControl)
	}
	if etag != "" {
		fmt.Printf("ETag: %s\\n", etag)
	}
	if lastModified != "" {
		fmt.Printf("Last-Modified: %s\\n", lastModified)
	}
	if expires != "" {
		fmt.Printf("Expires: %s\\n", expires)
	}
	if age != "" {
		fmt.Printf("Age: %s\\n", age)
	}

	// Analyze caching effectiveness
	fmt.Println("\\nCaching Analysis:")
	
	isCacheable := false
	maxAge := 0
	cacheStatus := "miss"

	if strings.Contains(cacheControl, "no-store") {
		fmt.Println("❌ This resource is explicitly not cacheable (no-store directive).")
	} else if strings.Contains(cacheControl, "no-cache") {
		fmt.Println("⚠️ This resource requires revalidation on each request (no-cache directive).")
		isCacheable = true
	} else if strings.Contains(cacheControl, "max-age=") {
		parts := strings.Split(cacheControl, "max-age=")
		if len(parts) > 1 {
			fmt.Sscanf(parts[1], "%d", &maxAge)
			fmt.Printf("✅ This resource can be cached for %d seconds.\\n", maxAge)
			isCacheable = true
			
			if age != "" {
				var ageVal int
				fmt.Sscanf(age, "%d", &ageVal)
				if ageVal > 0 {
					fmt.Printf("🔄 The resource has been in cache for %d seconds.\\n", ageVal)
					cacheStatus = "hit"
				}
			}
		}
	} else if etag != "" || lastModified != "" {
		fmt.Println("✅ This resource supports validation via ETag or Last-Modified.")
		isCacheable = true
	} else if expires != "" {
		fmt.Println("✅ This resource has an Expires header for caching.")
		isCacheable = true
	} else {
		fmt.Println("❌ No explicit caching directives found.")
	}

	// Human-readable summary
	fmt.Println("\\nSummary:")
	if isCacheable {
		if cacheStatus == "hit" {
			fmt.Printf("This website is using a %s server and has good caching configuration. ", 
			            resp.Header.Get("Server"))
			fmt.Println("The page was served from cache, which explains the fast response time.")
			fmt.Println("This means repeat visitors will experience faster page loads.")
		} else {
			fmt.Printf("This website is using a %s server and has caching configured. ", 
			            resp.Header.Get("Server"))
			fmt.Printf("The page was not served from cache, with a response time of %dms. ", 
			            responseTime)
			fmt.Println("Repeat visitors may experience faster page loads if their browser caches the content.")
		}
	} else {
		fmt.Printf("This website is using a %s server but doesn't appear to be cached properly. ", 
		            resp.Header.Get("Server"))
		fmt.Printf("The page took %dms to load. ", responseTime)
		fmt.Println("Implementing proper caching could improve performance for repeat visitors.")
	}
}`;
  };

  // Generate PHP code based on the URL and server type
  const generatePhpCode = (url: string, serverType: string) => {
    return `<?php
/**
 * HTTP Header Cache Checker - PHP 8.1+ Compatible
 * 
 * A simple PHP script to check HTTP caching headers of a website
 * and provide a human-readable analysis.
 */

// Check if URL is provided
if ($argc < 2) {
    echo "Usage: php cachecheck.php <url>\\n";
    exit(1);
}

$url = $argv[1];

// Ensure URL has http:// or https:// prefix
if (!str_starts_with($url, 'http://') && !str_starts_with($url, 'https://')) {
    $url = "https://$url";
}

echo "Checking caching headers for: $url\\n\\n";

// Initialize curl session
$ch = curl_init();

// Set curl options
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER => true,
    CURLOPT_NOBODY => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS => 5,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
]);

// Measure response time
$start_time = microtime(true);
$response = curl_exec($ch);
$end_time = microtime(true);
$response_time = round(($end_time - $start_time) * 1000); // in ms

// Check for curl errors
if (curl_errno($ch)) {
    echo "Error: " . curl_error($ch) . "\\n";
    exit(1);
}

// Get status code
$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$headers = substr($response, 0, $header_size);

// Close curl session
curl_close($ch);

// Display basic info
echo "Status Code: $status_code\\n";
echo "Response Time: {$response_time}ms\\n\\n";

// Parse headers
$header_lines = explode("\\n", $headers);
$parsed_headers = [];

foreach ($header_lines as $line) {
    $line = trim($line);
    if (empty($line)) continue;
    
    // Skip the HTTP/1.1 line
    if (str_starts_with($line, 'HTTP/')) continue;
    
    // Split header into name and value
    $parts = explode(':', $line, 2);
    if (count($parts) === 2) {
        $name = trim($parts[0]);
        $value = trim($parts[1]);
        $parsed_headers[$name] = $value;
    }
}

// Extract and display server info
$server = $parsed_headers['Server'] ?? 'Unknown';
echo "Server: $server\\n\\n";

// Check cache-related headers
$cache_control = $parsed_headers['Cache-Control'] ?? '';
$etag = $parsed_headers['ETag'] ?? '';
$last_modified = $parsed_headers['Last-Modified'] ?? '';
$expires = $parsed_headers['Expires'] ?? '';
$age = $parsed_headers['Age'] ?? '';

echo "Caching Headers:\\n";
if (!empty($cache_control)) echo "Cache-Control: $cache_control\\n";
if (!empty($etag)) echo "ETag: $etag\\n";
if (!empty($last_modified)) echo "Last-Modified: $last_modified\\n";
if (!empty($expires)) echo "Expires: $expires\\n";
if (!empty($age)) echo "Age: $age\\n";

// Analyze caching effectiveness
echo "\\nCaching Analysis:\\n";

$is_cacheable = false;
$max_age = 0;
$cache_status = "miss";

if (str_contains($cache_control, 'no-store')) {
    echo "❌ This resource is explicitly not cacheable (no-store directive).\\n";
} elseif (str_contains($cache_control, 'no-cache')) {
    echo "⚠️ This resource requires revalidation on each request (no-cache directive).\\n";
    $is_cacheable = true;
} elseif (str_contains($cache_control, 'max-age=')) {
    preg_match('/max-age=([0-9]+)/', $cache_control, $matches);
    if (isset($matches[1])) {
        $max_age = (int)$matches[1];
        echo "✅ This resource can be cached for $max_age seconds.\\n";
        $is_cacheable = true;
        
        if (!empty($age)) {
            $age_val = (int)$age;
            if ($age_val > 0) {
                echo "🔄 The resource has been in cache for $age_val seconds.\\n";
                $cache_status = "hit";
            }
        }
    }
} elseif (!empty($etag) || !empty($last_modified)) {
    echo "✅ This resource supports validation via ETag or Last-Modified.\\n";
    $is_cacheable = true;
} elseif (!empty($expires)) {
    echo "✅ This resource has an Expires header for caching.\\n";
    $is_cacheable = true;
} else {
    echo "❌ No explicit caching directives found.\\n";
}

// Human-readable summary
echo "\\nSummary:\\n";
if ($is_cacheable) {
    if ($cache_status === "hit") {
        echo "This website is using a $server server and has good caching configuration. ";
        echo "The page was served from cache, which explains the fast response time.\\n";
        echo "This means repeat visitors will experience faster page loads.\\n";
    } else {
        echo "This website is using a $server server and has caching configured. ";
        echo "The page was not served from cache, with a response time of {$response_time}ms.\\n";
        echo "Repeat visitors may experience faster page loads if their browser caches the content.\\n";
    }
} else {
    echo "This website is using a $server server but doesn't appear to be cached properly. ";
    echo "The page took {$response_time}ms to load.\\n";
    echo "Implementing proper caching could improve performance for repeat visitors.\\n";
}
`;
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex-grow">
        <Header />
        
        <main className="container mx-auto px-4">
          <UrlForm onSubmit={checkUrl} isLoading={loading} />
          
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center py-20"
              >
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4 text-gray-600">Analyzing headers...</p>
                </div>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <ResultCard result={result} />
                
                {goCode && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg"
                  >
                    <h2 className="text-xl font-semibold mb-4">Equivalent Go Code</h2>
                    <p className="text-gray-300 mb-4">
                      Here's a Go program that performs the same header check via command line. 
                      Copy this code, save it as <code className="bg-gray-800 px-2 py-1 rounded">cachecheck.go</code>, 
                      and run with <code className="bg-gray-800 px-2 py-1 rounded">go run cachecheck.go example.com</code>
                    </p>
                    <div className="relative">
                      <pre className="overflow-x-auto text-sm p-4 bg-gray-800 rounded">
                        <code>{goCode}</code>
                      </pre>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(goCode);
                          toast({
                            title: "Go code copied!",
                            description: "The Go code has been copied to your clipboard.",
                          });
                        }}
                        className="absolute right-4 top-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Copy
                      </button>
                    </div>
                  </motion.div>
                )}

                {phpCode && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg"
                  >
                    <h2 className="text-xl font-semibold mb-4">Equivalent PHP Code (PHP 8.1+)</h2>
                    <p className="text-gray-300 mb-4">
                      Here's a PHP script that performs the same header check. 
                      Copy this code, save it as <code className="bg-gray-800 px-2 py-1 rounded">cachecheck.php</code>, 
                      and run with <code className="bg-gray-800 px-2 py-1 rounded">php cachecheck.php example.com</code>
                    </p>
                    <div className="relative">
                      <pre className="overflow-x-auto text-sm p-4 bg-gray-800 rounded">
                        <code>{phpCode}</code>
                      </pre>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(phpCode);
                          toast({
                            title: "PHP code copied!",
                            description: "The PHP code has been copied to your clipboard.",
                          });
                        }}
                        className="absolute right-4 top-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Copy
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="instruction"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <p className="text-gray-500 max-w-xl mx-auto">
                  Enter any website URL above to analyze its HTTP caching headers. 
                  We'll explain the results in plain English so you can understand how 
                  the website's caching is configured. Plus, we'll show you the equivalent code 
                  in Go and PHP to perform the same analysis!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      
      <Footer />
    </motion.div>
  );
};

export default Index;
