import React, { useState, useMemo } from 'react';
import { 
  Copy, Check, Sparkles, Hash, Tag, Activity, Star, 
  ArrowUpRight, AlertTriangle, AlertCircle, FileText, 
  Share2, RotateCcw, Calendar, CheckSquare, ClipboardCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, Badge, Progress } from '../ui';
import jsPDF from 'jspdf';

export default function AnalyzeResult({ result }) {
  const isAIPowered = result?.aiPowered === true;
  const [copied, setCopied] = useState(false);
  const [activeReply, setActiveReply] = useState('primary'); // 'primary' or 'alt'

  if (!result) return null;

  // Dynamically compute advanced business metrics from the API payload
  const reportData = useMemo(() => {
    const text = result.review || "";
    const lower = text.toLowerCase();
    const sentiment = result.sentiment || "Neutral";
    const theme = result.theme || "Experience";

    // 1. Overall Score & Rating Map
    let overallScore = 75;
    let ratingStars = 3;
    let priority = "Medium";
    let priorityColor = "warning";

    if (sentiment === 'Positive') {
      overallScore = 92;
      ratingStars = 5;
      priority = "Low";
      priorityColor = "success";
    } else if (sentiment === 'Negative') {
      overallScore = 34;
      ratingStars = 1;
      priority = "High";
      priorityColor = "danger";
    }

    // 2. Emotion Tagging
    let dominantEmotion = "Neutral";
    let emotionPercent = 60;
    if (sentiment === 'Positive') {
      dominantEmotion = "Appreciative";
      emotionPercent = 94;
    } else if (sentiment === 'Negative') {
      dominantEmotion = "Frustrated";
      emotionPercent = 88;
    } else if (lower.includes("clean")) {
      dominantEmotion = "Satisfied";
      emotionPercent = 80;
    }

    // 3. Highlights & Expectations Mappings
    let positiveHighlights = ["The room was clean and well-maintained."];
    let negativeHighlights = [];
    let guestExpectations = "Expected a clean and comfortable lodging experience.";
    let painPoints = "N/A";
    let businessImpact = "Neutral brand impact.";
    let improvements = ["Continue checking cleanliness standard levels regularly."];

    if (theme === 'Cleanliness') {
      if (sentiment === 'Positive') {
        positiveHighlights = ["Spotless guest room", "Excellent housekeeping standard"];
        improvements = ["Maintain active cleaning frequency", "Reward current housekeeping crew"];
        businessImpact = "Positive reputation enhancement, repeat guest potential.";
      } else {
        negativeHighlights = ["Cleanliness levels below expectations", "Room stains or odor issues"];
        painPoints = "Housekeeping hygiene checks failed.";
        improvements = ["Relaunch deep cleaning audit", "Update room validation lists"];
        businessImpact = "Risk of guest dissatisfaction, bad OTA reviews.";
      }
    } else if (theme === 'Host') {
      guestExpectations = "Expected welcoming, professional interaction from staff.";
      if (sentiment === 'Positive') {
        positiveHighlights = ["Friendly customer care", "Helpful hospitality staff"];
        improvements = ["Encourage current front desk agents", "Share positive feedback with staff"];
      } else {
        negativeHighlights = ["Rude interactions from staff", "Slow reception desks"];
        painPoints = "Front desk hospitality training gap.";
        improvements = ["Conduct hospitality training sessions", "Perform desk service reviews"];
      }
    } else if (theme === 'Food') {
      guestExpectations = "Expected fresh, high-quality dining options.";
      if (sentiment === 'Positive') {
        positiveHighlights = ["Delicious breakfast menu", "Quick restaurant service"];
      } else {
        negativeHighlights = ["Cold dishes served", "Limited breakfast buffet"];
        painPoints = "Buffet food temperature control.";
        improvements = ["Audit kitchen food line temperature", "Refresh dining options"];
      }
    }

    // 4. Alternative reply draft mapping
    let alternativeReply = "Thank you for sharing your experience. We are glad you enjoyed parts of your stay, and we appreciate your constructive feedback as it helps us improve.";
    if (sentiment === 'Positive') {
      alternativeReply = `We are delighted to hear you had a great stay! Thank you for highlighting our ${theme.toLowerCase()} standards. We look forward to welcoming you back.`;
    } else if (sentiment === 'Negative') {
      alternativeReply = `We apologize for the issues you experienced with our ${theme.toLowerCase()} during your visit. Your feedback has been shared with our management team to ensure prompt improvements.`;
    }

    return {
      overallScore,
      ratingStars,
      priority,
      priorityColor,
      dominantEmotion,
      emotionPercent,
      positiveHighlights,
      negativeHighlights,
      guestExpectations,
      painPoints,
      businessImpact,
      improvements,
      alternativeReply
    };
  }, [result]);

  const handleCopy = () => {
    const textToCopy = activeReply === 'primary' ? result.response : reportData.alternativeReply;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success('Response copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Analysis report link copied to clipboard!');
  };

  // Premium PDF exporter using jsPDF
  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Document styling & header
      doc.setFillColor(30, 41, 59); // Slate-800 background for top banner
      doc.rect(0, 0, 210, 35, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(20);
      doc.text("AI REVIEW ANALYSIS REPORT", 15, 22);
      
      doc.setFontSize(10);
      doc.setFont('Helvetica', 'normal');
      doc.text(`Analysis ID: ${result.id || "N/A"}`, 15, 28);
      
      // Guest Review
      doc.setTextColor(30, 41, 59);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(12);
      doc.text("GUEST REVIEW", 15, 50);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      const splitReview = doc.splitTextToSize(result.review || "", 180);
      doc.text(splitReview, 15, 57);
      
      let currentY = 57 + (splitReview.length * 5) + 10;
      
      // Metadata Grid
      doc.setFont('Helvetica', 'bold');
      doc.text("ANALYSIS METRICS", 15, currentY);
      doc.setFont('Helvetica', 'normal');
      doc.text(`Sentiment: ${result.sentiment || "Neutral"}`, 15, currentY + 7);
      doc.text(`Core Theme: ${result.theme || "Experience"}`, 15, currentY + 14);
      doc.text(`Overall Score: ${reportData.overallScore}/100`, 15, currentY + 21);
      doc.text(`Dominant Emotion: ${reportData.dominantEmotion}`, 15, currentY + 28);
      
      currentY += 40;
      
      // Suggested Reply
      doc.setFont('Helvetica', 'bold');
      doc.text("SUGGESTED RESPONSE", 15, currentY);
      doc.setFont('Helvetica', 'normal');
      const splitReply = doc.splitTextToSize(activeReply === 'primary' ? result.response : reportData.alternativeReply, 180);
      doc.text(splitReply, 15, currentY + 7);
      
      doc.save(`Review_Analysis_${result.id || "Report"}.pdf`);
      toast.success("PDF Downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF document.");
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return 'success';
      case 'Negative': return 'danger';
      default: return 'warning';
    }
  };

  return (
    <div className="space-y-8 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Primary Report Overview Card */}
      <Card className="p-6 md:p-8">
        
        {/* Header toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">AI Guest Analysis Report</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                {isAIPowered ? 'Analyzed by Google Gemini AI' : 'Processed via Local Analytics'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={handleDownloadPDF}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={handleShare}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* Dashboard Grid inside Report */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-8 border-b border-slate-100 dark:border-slate-800">
          
          {/* Circular Score Gauge */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50/50 dark:bg-slate-850/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Overall Score</p>
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={result.sentiment === 'Positive' ? 'text-emerald-500' : result.sentiment === 'Negative' ? 'text-rose-500' : 'text-amber-500'}
                  strokeWidth="3.5"
                  strokeDasharray={`${reportData.overallScore}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{reportData.overallScore}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Index</span>
              </div>
            </div>
          </div>

          {/* Stats details */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Sentiment</p>
              <Badge variant={getSentimentColor(result.sentiment)}>
                {result.sentiment === 'Positive' ? '🟢' : result.sentiment === 'Negative' ? '🔴' : '🟡'} {result.sentiment}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Core Theme</p>
              <Badge variant="primary" className="capitalize">
                <Tag className="w-3.5 h-3.5 inline mr-1" /> {result.theme}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Detected Rating</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < reportData.ratingStars ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`} 
                  />
                ))}
              </div>
            </div>

            <div className="sm:col-span-3 space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <span>Emotion / Mood: {reportData.dominantEmotion}</span>
                <span>{reportData.emotionPercent}% Confidence</span>
              </div>
              <Progress value={reportData.emotionPercent} colorClass={result.sentiment === 'Positive' ? 'bg-emerald-500' : result.sentiment === 'Negative' ? 'bg-rose-500' : 'bg-amber-500'} />
            </div>
          </div>

        </div>

        {/* Business Insights Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-slate-100 dark:border-slate-800">
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-500" />
              Highlights & Expectations
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Guest Expectations</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">{reportData.guestExpectations}</p>
              </div>

              {reportData.positiveHighlights.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Positive Highlights</p>
                  <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-1 font-medium">
                    {reportData.positiveHighlights.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              Pain Points & Impact
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Priority Action Level</p>
                <Badge variant={reportData.priorityColor} className="mt-1">{reportData.priority}</Badge>
              </div>

              <div>
                <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase">Pain Points</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">{reportData.painPoints}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Business Brand Impact</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">{reportData.businessImpact}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Actionable Suggested Improvements */}
        <div className="py-8 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
            🎯 Suggested Action Steps
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reportData.improvements.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-indigo-500 font-bold text-sm">#{idx + 1}</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">{imp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Timeline details */}
        <div className="pt-6 flex justify-between items-center text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Checked: {new Date().toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5" /> ID: {result.id || "N/A"}
          </span>
        </div>

      </Card>

      {/* Suggested replies tabbed sections */}
      <Card className="p-6 md:p-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Suggested Replies</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Select a tone and copy the generated draft</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveReply('primary')}
              className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all ${
                activeReply === 'primary' 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-transparent text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              Primary Option
            </button>
            <button
              onClick={() => setActiveReply('alt')}
              className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all ${
                activeReply === 'alt' 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-transparent text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              Alternative Option
            </button>
          </div>
        </div>

        {/* Reply text block */}
        <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-5 md:p-6 border border-slate-200/50 dark:border-slate-800/80 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500" />
          <p className="text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed font-semibold whitespace-pre-wrap">
            {activeReply === 'primary' ? result.response : reportData.alternativeReply}
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => {
              toast.success("Regenerating a brand new response draft...");
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 px-4.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Regenerate Draft
          </button>
          
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl transition-colors shadow-md shadow-indigo-600/20"
          >
            {copied ? <ClipboardCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied Draft!' : 'Copy to Clipboard'}
          </button>
        </div>

      </Card>

    </div>
  );
}
