import React, { useState, useRef } from 'react';
import { 
  Sparkles, X, Clipboard, Upload, Mic, MicOff 
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
      className={`bg-white dark:bg-[#222222] rounded-xl p-6 border transition-all duration-200 relative overflow-hidden text-left ${
        dragActive 
          ? 'border-[#FF385C] bg-[#FFF0F3]' 
          : 'border-[#EBEBEB] dark:border-[#333333] shadow-[0_2px_16px_rgba(0,0,0,0.08)]'
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-4">
        <label htmlFor="review-input" className="text-xs font-bold text-[#717171] uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF385C]" />
          Review Editor
        </label>
        
        {/* Editor controls Toolbar */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {/* Samples selection dropdown */}
          <select
            onChange={(e) => {
              if (e.target.value) {
                setReview(e.target.value);
                e.target.value = "";
              }
            }}
            disabled={loading}
            className="text-xs font-semibold text-[#222222] dark:text-white bg-[#F7F7F7] dark:bg-[#1a1a1a] hover:bg-[#EBEBEB] border border-[#EBEBEB] dark:border-[#333333] px-3 py-1.5 rounded-full transition-colors cursor-pointer outline-none max-w-[160px] truncate"
          >
            <option value="">Sample Reviews</option>
            {SAMPLES.map((s, idx) => (
              <option key={idx} value={s.text}>{s.title}</option>
            ))}
          </select>

          <button
            onClick={handlePaste}
            disabled={loading}
            className="text-xs font-semibold text-[#FF385C] bg-[#FFF0F3] hover:bg-[#FFCCD5] px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
            title="Paste Clipboard"
          >
            <Clipboard className="w-3.5 h-3.5" />
            Paste
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="text-xs font-semibold text-[#222222] dark:text-white bg-[#F7F7F7] dark:bg-[#1a1a1a] hover:bg-[#EBEBEB] border border-[#EBEBEB] dark:border-[#333333] px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
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
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer ${
              isRecording 
                ? 'bg-[#D93025] text-white animate-pulse'
                : 'text-[#FFB400] bg-[#FFF8E6] hover:bg-[#FFE0A0]'
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
              className="text-xs font-semibold text-[#717171] bg-[#F7F7F7] hover:bg-[#EBEBEB] px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
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
          className={`w-full h-48 md:h-56 p-4 bg-white dark:bg-[#1a1a1a] border ${
            isOverLimit 
              ? 'border-[#D93025] focus:border-[#D93025] focus:ring-[#D93025]/20' 
              : 'border-[#EBEBEB] dark:border-[#333333] focus:border-[#FF385C] focus:ring-[#FF385C]/20'
          } rounded-lg resize-none outline-none focus:ring-2 transition-all text-[#222222] dark:text-white placeholder:text-[#717171] leading-relaxed font-normal text-sm`}
        />
        
        {/* Status bar */}
        <div className="absolute bottom-4 right-4 flex items-center gap-4">
          <span className={`text-xs font-semibold ${isOverLimit ? 'text-[#D93025]' : 'text-[#717171]'}`}>
            {charCount} / {maxLength}
          </span>
          
          <button
            onClick={onAnalyze}
            disabled={loading || charCount === 0 || isOverLimit}
            className="flex items-center justify-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-6 py-2.5 rounded-full font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(255,56,92,0.3)] cursor-pointer"
          >
            {loading ? (
              <span className="dot-pulse">
                <span className="bg-white" />
                <span className="bg-white" />
                <span className="bg-white" />
              </span>
            ) : (
              <>
                <span>Run Analysis</span>
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {dragActive && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#FFF0F3] backdrop-blur-xs pointer-events-none border-2 border-dashed border-[#FF385C] rounded-xl">
          <Upload className="w-10 h-10 text-[#FF385C] animate-bounce" />
          <p className="mt-2 text-sm font-bold text-[#FF385C]">Drop files to upload (.txt, .csv)</p>
        </div>
      )}
    </div>
  );
}
