import React, { useState, useRef } from 'react';
import { 
  Sparkles, X, Wand2, Clipboard, Upload, Mic, MicOff, AlertCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';

const SAMPLES = [
  {
    title: "Positive (Cleanliness & Staff)",
    text: "The room was incredibly clean and the host was very friendly. However, the location was a bit noisy at night. Overall, a great stay!"
  },
  {
    title: "Negative (Noise & Location)",
    text: "Worst experience ever. The street outside was extremely loud all night, the bed was uncomfortable, and nobody answered the front desk when we tried to call."
  },
  {
    title: "Mixed (Good Food, Bad Room)",
    text: "Breakfast was delicious and the chefs were helpful. But the bathroom sink was leaking, the carpets looked stained, and the Wi-Fi was dropping constantly. Need improvement."
  }
];

export default function AnalyzeInput({ 
  review, 
  setReview, 
  onAnalyze, 
  loading, 
  maxLength = 10000 
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setReview(prev => (prev ? prev + " " + text : text).slice(0, maxLength));
        toast.success("Text pasted from clipboard!");
      }
    } catch (err) {
      toast.error("Unable to read clipboard. Please paste manually.");
    }
  };

  const handleFile = (file) => {
    if (!file) return;
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension !== 'txt' && extension !== 'csv') {
      toast.error("Unsupported file format! Please upload .txt or .csv files.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setReview(text.slice(0, maxLength));
      toast.success(`Loaded content from ${file.name}`);
    };
    reader.readAsText(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const startSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice input is not supported in your browser. Try Google Chrome.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsRecording(true);
      toast.success("Listening... Speak now.");
    };

    rec.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setReview(prev => (prev ? prev + " " + transcript : transcript).slice(0, maxLength));
    };

    rec.onerror = (e) => {
      console.error(e);
      setIsRecording(false);
      toast.error("Voice input failed or was interrupted.");
    };

    rec.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = rec;
    rec.start();
  };

  const stopSpeech = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast.success("Voice recording stopped.");
    }
  };

  const charCount = review.length;
  const isOverLimit = charCount > maxLength;

  return (
    <div 
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border transition-all duration-300 relative overflow-hidden ${
        dragActive 
          ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-500/5' 
          : 'border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-slate-950/20'
      }`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60" />
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-5">
        <label htmlFor="review-input" className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          Flagship AI Editor
        </label>
        
        {/* Editor controls Toolbar */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {/* Samples selection dropdown */}
          <div className="relative group">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  setReview(e.target.value);
                  e.target.value = "";
                }
              }}
              disabled={loading}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 border border-slate-100 dark:border-slate-700 px-3 py-1.5 rounded-full transition-colors cursor-pointer outline-none max-w-[160px] truncate"
            >
              <option value="">Sample Reviews</option>
              {SAMPLES.map((s, idx) => (
                <option key={idx} value={s.text}>{s.title}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePaste}
            disabled={loading}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
            title="Paste Clipboard"
          >
            <Clipboard className="w-3.5 h-3.5" />
            Paste
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
            title="Upload file"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload File
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => handleFile(e.target.files[0])} 
            className="hidden" 
            accept=".txt,.csv"
          />

          <button
            onClick={isRecording ? stopSpeech : startSpeech}
            disabled={loading}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
              isRecording 
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100'
            }`}
            title="Voice Speech to Text"
          >
            {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            {isRecording ? 'Stop' : 'Voice'}
          </button>

          {charCount > 0 && (
            <button
              onClick={() => { setReview(""); stopSpeech(); }}
              disabled={loading}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <textarea
          id="review-input"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          disabled={loading}
          placeholder="Paste, type, upload or record your guest review here... (Supports Drag & Drop of TXT / CSV)"
          className={`w-full h-48 md:h-56 p-5 bg-slate-50 dark:bg-slate-950 border ${
            isOverLimit 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
          } rounded-2xl resize-none outline-none focus:ring-4 transition-all text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 leading-relaxed font-medium`}
        />
        
        {/* Status bar */}
        <div className="absolute bottom-4 right-4 flex items-center gap-4">
          <span className={`text-xs font-bold ${isOverLimit ? 'text-rose-500' : 'text-slate-400'}`}>
            {charCount} / {maxLength}
          </span>
          
          <button
            onClick={onAnalyze}
            disabled={loading || charCount === 0 || isOverLimit}
            className="group relative flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20 overflow-hidden"
          >
            {loading ? (
              <span className="dot-pulse">
                <span className="bg-white" />
                <span className="bg-white" />
                <span className="bg-white" />
              </span>
            ) : (
              <>
                <span className="relative z-10">Run Analysis</span>
                <Sparkles className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity z-0" />
              </>
            )}
          </button>
        </div>
      </div>

      {dragActive && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-indigo-500/10 dark:bg-indigo-950/20 backdrop-blur-sm pointer-events-none border-2 border-dashed border-indigo-500 rounded-3xl">
          <Upload className="w-10 h-10 text-indigo-500 animate-bounce" />
          <p className="mt-2 text-sm font-bold text-indigo-600 dark:text-indigo-400">Drop files to upload (.txt, .csv)</p>
        </div>
      )}
    </div>
  );
}
