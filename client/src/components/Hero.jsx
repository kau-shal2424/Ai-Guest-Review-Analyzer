import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, ArrowRight, Play, CheckCircle2, Star, 
  Brain, ShieldCheck, Zap, MessageSquare, Award, PlayCircle
} from "lucide-react";
import { motion } from "framer-motion";

const SAMPLE_REVIEWS = [
  {
    hotel: "Grand Hyatt Resort & Spa",
    category: "Cleanliness & Service",
    rating: 5,
    text: "The ocean view suite was pristine! Housekeeping left fresh flowers every morning and the concierge booked our private catamaran seamlessly.",
    sentiment: "Positive",
    score: 98,
    theme: "Cleanliness & Hospitality",
    aiResponse: "Dear Valued Guest, thank you for praising our ocean view suite and concierge service. We look forward to welcoming you back!"
  },
  {
    hotel: "Radisson Blu City Center",
    category: "Check-in & Noise",
    rating: 2,
    text: "Check-in took over 45 minutes because of long queues. Also the street noise outside room 402 made it impossible to sleep soundly.",
    sentiment: "Negative",
    score: 34,
    theme: "Front Desk Delay",
    aiResponse: "Dear Guest, we deeply apologize for the front desk delay and street noise disturbance. Our team is auditing peak arrival times."
  }
];

export default function Hero() {
  const [activeSample, setActiveSample] = useState(0);
  const sample = SAMPLE_REVIEWS[activeSample];

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* Radiant ambient gradient mesh background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[400px] bg-cyan-500/15 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 flex flex-col items-center text-center gap-8">
        
        {/* Pill Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-bold text-blue-400 shadow-xl shadow-blue-500/10 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Next-Gen Hospitality Intelligence 2.0</span>
          <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] uppercase tracking-wider font-extrabold">Enterprise</span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] max-w-5xl"
        >
          Understand Every Guest.{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Elevate Every Stay.
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-base sm:text-xl max-w-3xl font-medium leading-relaxed"
        >
          The enterprise AI platform that transforms unstructured hotel feedback into instant sentiment analytics, root-cause themes, and automated personalized draft responses.
        </motion.p>

        {/* Action CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full sm:w-auto"
        >
          <Link
            to="/user/analyze"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-xl shadow-blue-600/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 group"
          >
            <Brain className="w-5 h-5 text-cyan-300" />
            <span>Analyze Guest Reviews</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-base px-8 py-4 rounded-2xl transition-all duration-300 hover:border-slate-700 active:scale-95"
          >
            <PlayCircle className="w-5 h-5 text-blue-400" />
            <span>Interactive Demo</span>
          </a>
        </motion.div>

        {/* Micro Guarantee Badges */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium pt-2"
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Google Gemini AI Engine</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>SOC-2 & GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Sub-second Inference</span>
          </div>
        </motion.div>

        {/* Interactive Dashboard & AI Live Preview Container */}
        <motion.div 
          id="demo"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-5xl mt-8 rounded-3xl border border-slate-800/80 bg-slate-900/90 p-4 sm:p-6 shadow-2xl shadow-blue-500/10 backdrop-blur-2xl relative overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80 text-left">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-xs font-mono text-slate-400">reviewai-enterprise-platform.v2.demo</span>
            </div>
            
            {/* Sample Selector Tabs */}
            <div className="flex items-center gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
              {SAMPLE_REVIEWS.map((s, idx) => (
                <button
                  key={s.category}
                  onClick={() => setActiveSample(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeSample === idx 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Sample {idx + 1}: {s.sentiment}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Split Body */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 text-left">
            {/* Left: Input Feedback Card */}
            <div className="space-y-4 bg-slate-950/60 rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Raw Guest Review</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {sample.hotel}
                  </span>
                </div>
                <p className="text-sm text-slate-200 font-medium italic leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800/50">
                  "{sample.text}"
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
                  {sample.rating}.0 / 5.0 Star Guest Score
                </span>
                <span className="text-blue-400 font-bold">Category: {sample.category}</span>
              </div>
            </div>

            {/* Right: AI Instant Output Card */}
            <div className="space-y-4 bg-slate-950/60 rounded-2xl p-5 border border-slate-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Gemini AI Output</span>
                </div>
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                  sample.sentiment === 'Positive' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {sample.sentiment} ({sample.score}%)
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Extracted Theme:</span>
                  <p className="text-slate-200 font-semibold mt-0.5">{sample.theme}</p>
                </div>

                <div>
                  <span className="text-slate-500 font-bold uppercase tracking-wider">AI Suggested Draft Response:</span>
                  <p className="text-slate-300 bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl mt-1 leading-relaxed">
                    "{sample.aiResponse}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}