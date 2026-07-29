import React, { useState } from "react";
import Hero from "./Hero";
import { Link } from "react-router-dom";
import {
  SmilePlus, Tag, MessageSquareText, Globe, TrendingUp, Shield,
  CheckCircle2, Building2, ChevronDown, Zap, Sparkles, ArrowRight,
  Star, Heart, SlidersHorizontal, MapPin, Compass, ShieldAlert, Award
} from "lucide-react";
import { motion } from "framer-motion";

const CATEGORY_PILLS = [
  { icon: Sparkles, label: "AI Insights", active: true },
  { icon: Star, label: "5-Star Rating" },
  { icon: Building2, label: "Boutique Hotels" },
  { icon: Compass, label: "Luxury Resorts" },
  { icon: Globe, label: "Multi-Language" },
  { icon: Shield, label: "SOC-2 Ready" },
];

const HOTEL_CHAINS = [
  "Marriott International",
  "Hyatt Hotels",
  "Taj Hotels & Resorts",
  "Radisson Hotel Group",
  "Hilton Worldwide",
  "Airbnb Superhosts"
];

const FEATURES = [
  {
    icon: <SmilePlus className="w-6 h-6 text-[#FF385C]" />,
    badge: "NLP Sentiment",
    title: "Deep Sentiment Extraction",
    description: "Instantly classify guest feedback into Positive, Neutral, or Negative emotions with high-confidence score indices using Gemini AI."
  },
  {
    icon: <Tag className="w-6 h-6 text-[#FF385C]" />,
    badge: "Topic Mining",
    title: "Root-Cause Theme Detection",
    description: "Identify recurring pain points like Housekeeping delays, Front Desk service, Dining quality, and Noise with zero manual effort."
  },
  {
    icon: <MessageSquareText className="w-6 h-6 text-[#FF385C]" />,
    badge: "Generative AI",
    title: "Automated Draft Responses",
    description: "Construct personalized, brand-compliant draft replies to guest complaints or compliments in seconds across multiple languages."
  },
  {
    icon: <Globe className="w-6 h-6 text-[#FF385C]" />,
    badge: "Multi-Platform",
    title: "Omnichannel Sync",
    description: "Aggregate guest feedback from Booking.com, Airbnb, Expedia, TripAdvisor, and Google Reviews into a single unified console."
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-[#FF385C]" />,
    badge: "Business Intelligence",
    title: "Executive Trend Reports",
    description: "Track property performance over time with weekly automated AI executive summaries, heatmaps, and downloadable PDF reports."
  },
  {
    icon: <Shield className="w-6 h-6 text-[#FF385C]" />,
    badge: "Security",
    title: "Enterprise Data Privacy",
    description: "All review data is encrypted in transit and at rest. SOC-2 ready with full compliance and strict role-based access control."
  }
];

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Ingest Review Data",
    desc: "Paste guest feedback, drag-and-drop CSV files, or sync automatically via OTA platform webhooks."
  },
  {
    step: "02",
    title: "Gemini AI Inference",
    desc: "Our neural model parses natural language, extracts exact sentiment scores, and flags root operational themes."
  },
  {
    step: "03",
    title: "Generate Draft & Act",
    desc: "Review AI-crafted response suggestions, export PDF executive reports, and assign corrective tasks to staff."
  }
];

const TESTIMONIALS = [
  {
    quote: "ReviewAI transformed our guest experience operations. We reduced response times to guest complaints from 48 hours to under 3 minutes.",
    author: "Elena Rostova",
    role: "VP of Guest Experience",
    hotel: "Grand Luxe Hotels & Resorts"
  },
  {
    quote: "The theme extraction is remarkably accurate. It flagged a recurring housekeeping delay in wing B that saved our 4.8-star TripAdvisor rating.",
    author: "Marcus Vance",
    role: "General Manager",
    hotel: "Heritage Taj Collection"
  }
];

const PRICING_PLANS = [
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    description: "Ideal for boutique hotels & luxury B&Bs",
    features: [
      "Up to 500 AI review analyses / mo",
      "Sentiment & Theme classification",
      "Standard response draft generator",
      "CSV Data Export",
      "Email Support"
    ],
    popular: false,
    cta: "Start Free Trial"
  },
  {
    name: "Professional",
    price: "$299",
    period: "/month",
    description: "For multi-property hotels & resort chains",
    features: [
      "Up to 5,000 AI review analyses / mo",
      "Advanced BI Insights & Radar Charts",
      "Automated PDF Executive Reports",
      "Multi-user Team Permissions",
      "Priority Support Desk"
    ],
    popular: true,
    cta: "Upgrade to Pro"
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For global hotel groups & enterprise portfolios",
    features: [
      "Unlimited AI Review Processing",
      "Custom Gemini Model Fine-Tuning",
      "Dedicated Account Success Manager",
      "Custom Webhook & OTA Integrations",
      "SLA & SOC-2 Compliance Guarantee"
    ],
    popular: false,
    cta: "Contact Enterprise Sales"
  }
];

const FAQS = [
  {
    q: "How does the AI sentiment model classify reviews?",
    a: "We process guest feedback using Google Gemini neural models. The AI evaluates text context, tone, and specific keyword patterns to assign positive, neutral, or negative classifications along with theme tags."
  },
  {
    q: "Can I customize the generated AI responses to match my hotel brand voice?",
    a: "Yes! In the AI Analyze and Insights views, you can select alternative draft styles or edit the output before copying it to your guest communications dashboard."
  },
  {
    q: "Is my hotel's data secure and confidential?",
    a: "Absolutely. All review data is encrypted using AES-256 and stored securely in MongoDB. We strictly adhere to enterprise privacy standards and never sell or train public models on your private review records."
  },
  {
    q: "Do you support PDF and CSV reporting for hotel board meetings?",
    a: "Yes, our Reports section allows you to export comprehensive PDF executive briefings and raw CSV data files with a single click."
  }
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#1a1a1a] flex flex-col text-[#222222] dark:text-white font-sans transition-colors duration-300">

      {/* 1. Airbnb Style Category Pills Strip */}
      <div className="border-b border-[#EBEBEB] dark:border-[#333333] bg-white dark:bg-[#1a1a1a] py-3 sticky top-[61px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1">
            {CATEGORY_PILLS.map((cat, idx) => {
              const IconComp = cat.icon;
              const isActive = activeCategory === idx;
              return (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(idx)}
                  className={`flex flex-col items-center gap-1.5 min-w-[70px] pb-1 border-b-2 transition-all cursor-pointer ${
                    isActive 
                      ? "border-[#222222] dark:border-white text-[#222222] dark:text-white font-bold" 
                      : "border-transparent text-[#717171] hover:text-[#222222] dark:hover:text-white font-medium"
                  }`}
                >
                  <IconComp className={`w-5 h-5 ${isActive ? 'text-[#FF385C]' : 'text-[#717171]'}`} />
                  <span className="text-xs tracking-tight whitespace-nowrap">{cat.label}</span>
                </button>
              );
            })}
          </div>

          <button className="hidden sm:flex items-center gap-2 border border-[#EBEBEB] dark:border-[#333333] px-3.5 py-2 rounded-xl text-xs font-semibold hover:border-[#222222] transition-colors flex-shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Trusted By Hotel Chains */}
      <section className="border-b border-[#EBEBEB] dark:border-[#333333] bg-[#F7F7F7] dark:bg-[#222222] py-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 text-center space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#717171]">
            Trusted by Hospitality Leaders & Luxury Hotel Chains Worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75">
            {HOTEL_CHAINS.map((chain) => (
              <span key={chain} className="text-xs sm:text-sm font-bold tracking-tight text-[#222222] dark:text-gray-300 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#FF385C]" />
                {chain}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section className="max-w-7xl mx-auto w-full px-5 sm:px-8 py-16 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF385C] bg-[#FFF0F3] px-3 py-1 rounded-full border border-[#FFCCD5]">
            Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#222222] dark:text-white">
            Everything You Need for Guest Satisfaction
          </h2>
          <p className="text-[#717171] text-sm sm:text-base font-normal">
            Transform high-volume guest feedback into immediate operational clarity and brand loyalty.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, idx) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-[#222222] rounded-xl p-6 border border-[#EBEBEB] dark:border-[#333333] shadow-[0_2px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-full bg-[#FFF0F3] border border-[#FFCCD5]">
                  {f.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F7F7F7] dark:bg-[#333333] text-[#717171]">
                  {f.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-[#222222] dark:text-white">
                {f.title}
              </h3>
              <p className="text-xs text-[#717171] leading-relaxed font-normal">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. AI Workflow */}
      <section className="bg-[#F7F7F7] dark:bg-[#222222] py-16 border-y border-[#EBEBEB] dark:border-[#333333]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-12 text-center">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF385C]">
              Workflow Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#222222] dark:text-white">
              From Review to Action in 3 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WORKFLOW_STEPS.map((w) => (
              <div key={w.step} className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-[#EBEBEB] dark:border-[#333333] shadow-sm text-left space-y-3">
                <span className="text-3xl font-extrabold text-[#FF385C]">{w.step}</span>
                <h3 className="text-base font-bold text-[#222222] dark:text-white">{w.title}</h3>
                <p className="text-xs text-[#717171] leading-relaxed font-normal">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="max-w-7xl mx-auto w-full px-5 sm:px-8 py-16 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF385C]">
            Client Success
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#222222] dark:text-white">
            Loved by Hospitality Directors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.author} className="bg-white dark:bg-[#222222] rounded-xl p-7 border border-[#EBEBEB] dark:border-[#333333] shadow-[0_2px_16px_rgba(0,0,0,0.08)] space-y-4 text-left">
              <div className="flex gap-1 text-[#FFB400]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FFB400]" />
                ))}
              </div>
              <p className="text-[#222222] dark:text-gray-200 text-sm font-normal italic leading-relaxed">
                "{t.quote}"
              </p>
              <div className="pt-3 border-t border-[#EBEBEB] dark:border-[#333333]">
                <p className="font-bold text-xs text-[#222222] dark:text-white">{t.author}</p>
                <p className="text-[11px] text-[#717171]">{t.role} · {t.hotel}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Pricing Matrix */}
      <section className="bg-[#F7F7F7] dark:bg-[#222222] py-16 border-y border-[#EBEBEB] dark:border-[#333333]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF385C]">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#222222] dark:text-white">
              Plans Scaled for Every Property Size
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white dark:bg-[#1a1a1a] rounded-xl p-7 border flex flex-col justify-between shadow-[0_2px_16px_rgba(0,0,0,0.08)] relative text-left ${
                  plan.popular 
                    ? "border-[#FF385C] ring-1 ring-[#FF385C]" 
                    : "border-[#EBEBEB] dark:border-[#333333]"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#FF385C] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    Most Popular
                  </span>
                )}

                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-bold text-[#222222] dark:text-white">{plan.name}</h3>
                    <p className="text-xs text-[#717171] mt-1 font-normal">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-[#222222] dark:text-white">{plan.price}</span>
                    <span className="text-xs text-[#717171] font-normal">{plan.period}</span>
                  </div>

                  <ul className="space-y-2.5 pt-4 border-t border-[#EBEBEB] dark:border-[#333333] text-xs font-normal">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-[#222222] dark:text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00A699] flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <Link
                    to="/user/analyze"
                    className={`w-full inline-flex items-center justify-center font-semibold text-xs px-5 py-3 rounded-full transition-all ${
                      plan.popular 
                        ? "bg-[#FF385C] hover:bg-[#E31C5F] text-white shadow-sm" 
                        : "bg-[#222222] hover:bg-[#111111] text-white"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="max-w-3xl mx-auto w-full px-5 sm:px-8 py-16 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#717171]">
            Questions & Answers
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#222222] dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="divide-y divide-[#EBEBEB] dark:divide-[#333333]">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="py-4">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center text-left font-semibold text-sm text-[#222222] dark:text-white hover:text-[#FF385C] transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#717171] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>

              {openFaq === idx && (
                <p className="mt-2 text-xs text-[#717171] leading-relaxed font-normal">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. Bottom Call to Action */}
      <section className="max-w-7xl mx-auto w-full px-5 sm:px-8 pb-16">
        <div className="bg-[#FF385C] text-white rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center gap-5 shadow-[0_4px_24px_rgba(255,56,92,0.3)]">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight max-w-xl leading-tight">
            Elevate Your Guest Ratings Today
          </h2>
          <p className="text-rose-100 text-xs sm:text-sm max-w-md font-normal">
            Join hospitality managers using AI Guest Review Analyzer to turn reviews into actionable operational growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full sm:w-auto">
            <Link
              to="/user/analyze"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#FF385C] hover:bg-rose-50 font-bold px-7 py-3 rounded-full shadow-md transition-all active:scale-95 text-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Analyzing Free</span>
            </Link>
            <Link
              to="/user/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white border border-white/30 font-semibold px-7 py-3 rounded-full transition-all active:scale-95 text-xs"
            >
              <span>Explore Dashboard</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
