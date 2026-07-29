import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, ArrowRight, Star, 
  Brain, ShieldCheck, Zap, MessageSquare, Award, CheckCircle2
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
    <section className="relative bg-[#FFFFFF] dark:bg-[#1a1a1a] text-[#222222] dark:text-white pt-12 pb-16 sm:pt-16 sm:pb-24 border-b border-[#EBEBEB] dark:border-[#333333]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col items-center text-center gap-6">
        
        {/* Category Pill */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F7F7F7] dark:bg-[#2A2A2A] border border-[#EBEBEB] dark:border-[#333333] text-xs font-semibold text-[#FF385C]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FF385C]" />
          <span>Airbnb & Hospitality AI Review Intelligence</span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] max-w-4xl text-[#222222] dark:text-white"
        >
          Understand Every Guest.{" "}
          <span className="text-[#FF385C]">
            Elevate Every Stay.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[#717171] dark:text-[#A0A0A0] text-base sm:text-lg max-w-2xl font-normal leading-relaxed"
        >
          Transform guest feedback into instant sentiment analytics, root-cause operational themes, and automated personalized draft responses using Gemini AI.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full sm:w-auto"
        >
          <Link
            to="/user/analyze"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold text-base px-8 py-3.5 rounded-full shadow-[0_2px_12px_rgba(255,56,92,0.3)] transition-all duration-200 active:scale-95 group"
          >
            <span>Analyze Guest Reviews</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-[#222222] hover:bg-[#F7F7F7] dark:hover:bg-[#2A2A2A] border border-[#222222] dark:border-white text-[#222222] dark:text-white font-semibold text-base px-8 py-3.5 rounded-full transition-all duration-200 active:scale-95"
          >
            <span>Explore Live Demo</span>
          </a>
        </motion.div>

        {/* Features Checklist */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#717171] font-medium pt-2"
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#00A699]" />
            <span>Gemini AI Engine</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#FF385C]" />
            <span>SOC-2 Ready Data Privacy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#FFB400]" />
            <span>Instant Sentiment Extraction</span>
          </div>
        </motion.div>

        {/* Demo Preview Card */}
        <motion.div 
          id="demo"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-full max-w-4xl mt-6 rounded-2xl border border-[#EBEBEB] dark:border-[#333333] bg-white dark:bg-[#222222] p-5 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.12)] text-left relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EBEBEB] dark:border-[#333333]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF385C]" />
              <span className="text-xs font-semibold text-[#222222] dark:text-white">Hospitality Review Analyzer Demo</span>
            </div>
            
            {/* Sample Selector Tabs */}
            <div className="flex items-center gap-2 bg-[#F7F7F7] dark:bg-[#1a1a1a] p-1 rounded-full border border-[#EBEBEB] dark:border-[#333333]">
              {SAMPLE_REVIEWS.map((s, idx) => (
                <button
                  key={s.category}
                  onClick={() => setActiveSample(idx)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeSample === idx 
                      ? "bg-[#222222] text-white" 
                      : "text-[#717171] hover:text-[#222222]"
                  }`}
                >
                  {s.sentiment} Review
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-5">
            {/* Guest Review */}
            <div className="space-y-3 bg-[#F7F7F7] dark:bg-[#1a1a1a] rounded-xl p-4 border border-[#EBEBEB] dark:border-[#333333]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#717171] uppercase tracking-wider">Raw Guest Review</span>
                <span className="text-xs font-semibold text-[#FF385C]">★ {sample.rating}.0 Rating</span>
              </div>
              <p className="text-sm text-[#222222] dark:text-gray-200 italic font-medium leading-relaxed">
                "{sample.text}"
              </p>
              <p className="text-xs font-semibold text-[#717171]">{sample.hotel}</p>
            </div>

            {/* AI Response Card */}
            <div className="space-y-3 bg-white dark:bg-[#222222] rounded-xl p-4 border border-[#EBEBEB] dark:border-[#333333] shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-[#FF385C]" />
                  <span className="text-xs font-bold text-[#222222] dark:text-white uppercase tracking-wider">AI Sentiment Output</span>
                </div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  sample.sentiment === 'Positive' 
                    ? 'bg-[#E6F7F6] text-[#00A699]' 
                    : 'bg-[#FDECEA] text-[#D93025]'
                }`}>
                  {sample.sentiment} ({sample.score}%)
                </span>
              </div>

              <div className="text-xs space-y-2">
                <div>
                  <span className="text-[#717171] font-semibold">Detected Theme: </span>
                  <span className="font-bold text-[#222222] dark:text-white">{sample.theme}</span>
                </div>
                <div>
                  <span className="text-[#717171] font-semibold">Generated Response:</span>
                  <p className="text-[#222222] dark:text-gray-200 bg-[#FFF0F3] dark:bg-[#2A2A2A] p-2.5 rounded-lg mt-1 font-medium leading-relaxed">
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
