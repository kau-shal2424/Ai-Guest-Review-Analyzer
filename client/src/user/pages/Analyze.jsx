import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AnalyzeInput from "../../components/analyze/AnalyzeInput";
import AnalyzeResult from "../../components/analyze/AnalyzeResult";
import AiLoadingAnimation from "../../components/analyze/AiLoadingAnimation";
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans"
    >
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Section */}
        <div className="text-center mb-10 max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider">
            <Brain className="w-4 h-4 text-purple-500" />
            <span>Gemini AI Sentiment & Response Studio</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            AI Review Analyzer
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-medium leading-relaxed">
            Paste or record guest feedback. Our neural engine extracts sentiment scores, root-cause operational themes, and drafts brand-compliant responses instantly.
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
          <div className="mt-8">
            <AiLoadingAnimation />
          </div>
        )}

        {/* Result Component */}
        {!loading && result && (
          <div className="mt-8">
            <AnalyzeResult result={result} />
          </div>
        )}

      </main>
    </motion.div>
  );
}
