
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '@/components/Header';
import UrlForm from '@/components/UrlForm';
import { HeaderResult } from '@/components/ResultCard';
import Footer from '@/components/Footer';
import { toast } from "@/components/ui/use-toast";
import LoadingState from '@/components/LoadingState';
import InstructionBlock from '@/components/InstructionBlock';
import ResultsDisplay from '@/components/ResultsDisplay';
import { checkUrl } from '@/services/urlService';

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HeaderResult | null>(null);
  const [goCode, setGoCode] = useState<string>('');
  const [phpCode, setPhpCode] = useState<string>('');
  const [curlCommand, setCurlCommand] = useState<string>('');

  const handleUrlCheck = async (url: string) => {
    setLoading(true);
    setResult(null);
    
    try {
      // Get analysis results from the service
      const { result: analysisResult, goCode: generatedGoCode, phpCode: generatedPhpCode, curlCommand: generatedCurlCommand } = await checkUrl(url);
      
      setResult(analysisResult);
      setGoCode(generatedGoCode);
      setPhpCode(generatedPhpCode);
      setCurlCommand(generatedCurlCommand);
      
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
          <UrlForm onSubmit={handleUrlCheck} isLoading={loading} />
          
          <AnimatePresence mode="wait">
            {loading ? (
              <LoadingState />
            ) : result ? (
              <ResultsDisplay 
                result={result} 
                goCode={goCode} 
                phpCode={phpCode} 
                curlCommand={curlCommand} 
              />
            ) : (
              <InstructionBlock />
            )}
          </AnimatePresence>
        </main>
      </div>
      
      <Footer />
    </motion.div>
  );
};

export default Index;
