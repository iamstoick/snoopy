
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
      toast({
        title: "Analysis complete",
        description: "We've analyzed the HTTP headers for your URL.",
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
              >
                <ResultCard result={result} />
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
                  the website's caching is configured.
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
