import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AnalyzeInput from "../components/analyze/AnalyzeInput";
import AnalyzeResult from "../components/analyze/AnalyzeResult";
import { Sparkles } from "lucide-react";

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
        "http://127.0.0.1:8000/api/analyze",
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        
        {/* Header Section */}
        <div className="text-center mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-500/10 rounded-2xl mb-4 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            AI Review Analyzer
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Paste any guest feedback below. Our AI will instantly extract sentiment, identify core themes, and draft a professional response.
          </p>
        </div>

        {/* Input Component */}
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
          <AnalyzeInput 
            review={review}
            setReview={setReview}
            onAnalyze={handleAnalyze}
            loading={loading}
          />
        </div>

        {/* Loading AI State */}
        {loading && (
          <div className="mt-8 flex flex-col items-center justify-center p-12 animate-in fade-in duration-300">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
              <Sparkles className="w-10 h-10 text-indigo-500 animate-bounce relative z-10" />
            </div>
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium animate-pulse">
              AI is analyzing your review...
            </p>
          </div>
        )}

        {/* Result Component */}
        {!loading && result && (
          <AnalyzeResult result={result} />
        )}

      </main>
    </div>
  );
}