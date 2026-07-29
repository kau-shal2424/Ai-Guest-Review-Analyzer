import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AnalyzeInput from "../components/AnalyzeInput";
import AnalyzeResult from "../components/AnalyzeResult";
import AiLoadingAnimation from "../components/AiLoadingAnimation";
import { Sparkles, Brain, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Analyze() {
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!review.trim()) {
      toast.error("Please enter a review before analysis.");
      return;
    }

    try {
      setLoading(true);
      setResult(null); // clear previous results

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/analyze`,
        { review }
      );

      setResult(response.data);
      toast.success("Review analyzed successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Analysis Failed: Unable to connect to backend service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#F7F7F7] dark:bg-[#1a1a1a] text-[#222222] dark:text-white transition-colors duration-300 font-sans text-left"
    >
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Header Section */}
        <div className="text-center mb-8 max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F3] border border-[#FFCCD5] text-[#FF385C] text-xs font-semibold">
            <Brain className="w-3.5 h-3.5" />
            <span>Gemini AI Guest Intelligence Studio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#222222] dark:text-white">
            AI Review Analyzer
          </h1>
          <p className="text-[#717171] text-xs sm:text-sm font-normal leading-relaxed">
            Paste or enter guest feedback. Our AI extracts sentiment scores, root-cause operational themes, and drafts brand-compliant responses instantly.
          </p>
        </div>

        {/* Input Component */}
        <div>
          <AnalyzeInput 
            review={review}
            setReview={setReview}
            onAnalyze={handleAnalyze}
            loading={loading}
          />
        </div>

        {/* Loading AI State */}
        {loading && (
          <div className="mt-6">
            <AiLoadingAnimation />
          </div>
        )}

        {/* Result Component */}
        {!loading && result && (
          <div className="mt-6">
            <AnalyzeResult result={result} />
          </div>
        )}

      </main>
    </motion.div>
  );
}
