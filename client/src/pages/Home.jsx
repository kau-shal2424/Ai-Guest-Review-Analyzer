import React, { useState } from "react";
import Hero from "../components/Hero";
import { Link } from "react-router-dom";
import {
  SmilePlus, Tag, MessageSquareText, Globe, TrendingUp, Shield,
  CheckCircle2, Building2, ChevronDown, Zap, Sparkles, ArrowRight,
  BarChart2, Star, ShieldCheck, Users, HelpCircle
} from "lucide-react";
import { motion } from "framer-motion";

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
    icon: <SmilePlus className="w-6 h-6 text-blue-500" />,
    badge: "NLP Sentiment",
    title: "Deep Sentiment Extraction",
    description: "Instantly classify guest feedback into Positive, Neutral, or Negative emotions with high-confidence score indices using Gemini AI."
  },
  {
    icon: <Tag className="w-6 h-6 text-purple-500" />,
    badge: "Topic Mining",
    title: "Root-Cause Theme Detection",
    description: "Identify recurring pain points like Housekeeping delays, Front Desk service, Dining quality, and Noise with zero manual effort."
  },
  {
    icon: <MessageSquareText className="w-6 h-6 text-cyan-500" />,
    badge: "Generative AI",
    title: "Automated Draft Responses",
    description: "Construct personalized, brand-compliant draft replies to guest complaints or compliments in seconds across multiple languages."
  },
  {
    icon: <Globe className="w-6 h-6 text-emerald-500" />,
    badge: "Multi-Platform",
    title: "Omnichannel Sync",
    description: "Aggregate guest feedback from Booking.com, Airbnb, Expedia, TripAdvisor, and Google Reviews into a single unified console."
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-amber-500" />,
    badge: "Business Intelligence",
    title: "Executive Trend Reports",
    description: "Track property performance over time with weekly automated AI executive summaries, heatmaps, and downloadable PDF reports."
  },
  {
    icon: <Shield className="w-6 h-6 text-rose-500" />,
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Trusted By Hotel Chains */}
      <section className="border-y border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 backdrop-blur-md py-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 text-center space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Trusted by Hospitality Leaders & Luxury Hotel Chains Worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
            {HOTEL_CHAINS.map((chain) => (
              <span key={chain} className="text-sm sm:text-base font-extrabold tracking-tight text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                {chain}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="max-w-7xl mx-auto w-full px-5 sm:px-8 py-20 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-100 dark:border-blue-500/20">
            Enterprise Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Everything You Need to Master Guest Satisfaction
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-medium">
            Transform high-volume guest feedback into immediate operational clarity and brand loyalty.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES.map((f, idx) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-slate-950/50 hover:border-blue-500/40 transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  {f.badge}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                {f.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. AI Workflow / How It Works */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-16 relative z-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
              AI Workflow Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              From Raw Review to Action in 3 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WORKFLOW_STEPS.map((w) => (
              <div key={w.step} className="bg-slate-950/80 rounded-3xl p-8 border border-slate-800 space-y-4 relative">
                <span className="text-4xl font-black text-blue-500 font-mono">{w.step}</span>
                <h3 className="text-xl font-bold">{w.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Testimonials */}
      <section className="max-w-7xl mx-auto w-full px-5 sm:px-8 py-20 space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
            Client Success
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Loved by Hospitality Directors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t) => (
            <div key={t.author} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800 shadow-xl space-y-6">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-base font-medium italic leading-relaxed">
                "{t.quote}"
              </p>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <p className="font-bold text-slate-900 dark:text-white">{t.author}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t.role} · {t.hotel}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Pricing Matrix */}
      <section className="bg-slate-100 dark:bg-slate-900/50 py-20 border-y border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Flexible Enterprise Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Plans Scaled for Every Property Size
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-8 border flex flex-col justify-between shadow-xl relative ${
                  plan.popular 
                    ? "border-blue-600 ring-2 ring-blue-600/30 dark:ring-blue-500/20" 
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white text-xs font-extrabold uppercase tracking-wider shadow-md">
                    Most Popular
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black">{plan.price}</span>
                    <span className="text-xs text-slate-500 font-bold">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-medium">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Link
                    to="/user/analyze"
                    className={`w-full inline-flex items-center justify-center font-bold text-sm px-6 py-3.5 rounded-2xl transition-all shadow-md ${
                      plan.popular 
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20" 
                        : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
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

      {/* 7. FAQ */}
      <section className="max-w-4xl mx-auto w-full px-5 sm:px-8 py-20 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="py-5">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center text-left font-bold text-base text-slate-900 dark:text-white hover:text-blue-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>

              {openFaq === idx && (
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. Bottom Call to Action Banner */}
      <section className="max-w-7xl mx-auto w-full px-5 sm:px-8 pb-20">
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-10 sm:p-16 overflow-hidden text-center flex flex-col items-center gap-6 text-white shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl leading-tight">
            Elevate Your Hotel's Guest Ratings Today
          </h2>
          <p className="text-blue-100 text-base sm:text-lg max-w-xl font-medium">
            Join enterprise hospitality teams using ReviewAI to turn guest reviews into actionable operational growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto">
            <Link
              to="/user/analyze"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-2xl shadow-xl transition-all active:scale-95"
            >
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>Start Free Trial</span>
            </Link>
            <Link
              to="/user/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/40 text-white border border-white/20 font-bold px-8 py-4 rounded-2xl transition-all active:scale-95"
            >
              <span>Explore Dashboard</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}