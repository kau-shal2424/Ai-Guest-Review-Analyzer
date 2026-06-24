import { useState } from "react";
import axios from "axios";
import Loader from "../components/ui/Loader";
import { showSuccess, showError } from "../components/ui/Toast";

export default function Analyze() {
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!review.trim()) {
      showError(
        "Review Required",
        "Please enter a review before analysis."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/analyze",
        {
          review,
        }
      );

      setResult(response.data);

      showSuccess(
        "Analysis Complete",
        "Review analyzed successfully."
      );
    } catch (error) {
      console.error(error);

      showError(
        "Analysis Failed",
        "Unable to connect to backend service."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">
          AI Review Analyzer
        </h1>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Paste guest review here..."
          className="w-full h-40 p-4 border rounded-lg"
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center min-w-[180px]"
        >
          {loading ? (
            <Loader size="sm" />
          ) : (
            "Analyze Review"
          )}
        </button>

        {result && (
          <div className="mt-8 p-6 border rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">
              Analysis Result
            </h2>

            <p className="mb-2">
              <strong>Sentiment:</strong> {result.sentiment}
            </p>

            <p className="mb-2">
              <strong>Theme:</strong> {result.theme}
            </p>

            <p>
              <strong>Suggested Response:</strong>{" "}
              {result.response}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}