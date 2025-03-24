
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

  // This function simulates a fetch of HTTP headers that would normally be done by a Golang backend
  const checkUrl = async (url: string) => {
    setLoading(true);
    setResult(null);
    
    try {
      // In a real implementation, this would call the Go backend API
      // For demonstration, we'll simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample data - in a real app, this would come from the Go backend
      const sampleResult: HeaderResult = {
        url: url,
        statusCode: 200,
        server: "Example/1.0",
        cacheStatus: Math.random() > 0.5 ? "hit" : "miss",
        cacheControl: "max-age=3600, public",
        age: "1200",
        expires: new Date(Date.now() + 3600000).toUTCString(),
        lastModified: new Date(Date.now() - 86400000).toUTCString(),
        etag: '"a1b2c3d4e5f6"',
        responseTime: Math.floor(Math.random() * 500) + 100,
        humanReadableSummary: getSampleSummary(url),
        cachingScore: Math.floor(Math.random() * 100)
      };
      
      setResult(sampleResult);
      
      // Generate the equivalent Go code
      const generatedGoCode = `
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
      
      setGoCode(generatedGoCode);
      
      toast({
        title: "Analysis complete",
        description: "We've analyzed the HTTP headers for your URL and generated equivalent Go code.",
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

  // Generate a sample summary based on the URL - in a real app, this would be from the Go backend
  const getSampleSummary = (url: string) => {
    const isCached = Math.random() > 0.5;
    const serverType = ["Nginx", "Apache", "Cloudflare", "Varnish", "AmazonS3"][Math.floor(Math.random() * 5)];
    const responseTime = Math.floor(Math.random() * 500) + 100;
    
    if (isCached) {
      return `This website is using ${serverType} and has good caching configuration. The page was served from cache, which explains the fast response time of ${responseTime}ms. This means repeat visitors will experience faster page loads.`;
    } else {
      return `This website is using ${serverType} but doesn't appear to be properly cached. The page was not served from cache, resulting in a response time of ${responseTime}ms. Implementing proper caching could improve performance for repeat visitors.`;
    }
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
                            title: "Code copied!",
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
                  the website's caching is configured. Plus, we'll show you the Go code 
                  that performs the same analysis!
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
