import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ReviewCard from "../components/ReviewCard";
import Footer from "../components/Footer";
import {
  SmilePlus,
  Tag,
  MessageSquareText,
  Globe,
  TrendingUp,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: <SmilePlus className="w-5 h-5" />,
    badge: "NLP",
    title: "Sentiment Analysis",
    description:
      "Instantly classify every review as Positive, Neutral, or Negative using advanced natural language processing.",
    buttonText: "Learn More",
  },
  {
    icon: <Tag className="w-5 h-5" />,
    badge: "AI Tagging",
    title: "Theme Detection",
    description:
      "Identify recurring topics like Food, Cleanliness, Location, Host quality, and more with zero manual effort.",
    buttonText: "Learn More",
  },
  {
    icon: <MessageSquareText className="w-5 h-5" />,
    badge: "Generative AI",
    title: "AI Response Suggestions",
    description:
      "Generate professional, context-aware responses to guest reviews in seconds, in any language.",
    buttonText: "Learn More",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    badge: "Multi-platform",
    title: "Aggregated Reviews",
    description:
      "Sync reviews from Airbnb, Booking.com, TripAdvisor, and Google — all in a single dashboard.",
    buttonText: "Learn More",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    badge: "Analytics",
    title: "Trend Reports",
    description:
      "Track sentiment over time with weekly AI reports highlighting improvements and recurring complaints.",
    buttonText: "Learn More",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    badge: "Compliance",
    title: "Privacy & Security",
    description:
      "All review data is encrypted and processed securely. GDPR compliant with full data ownership.",
    buttonText: "Learn More",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      {/* Hero — vertically stacked on all sizes */}
      <Hero />

      {/* Features Section */}
      <section className="max-w-6xl mx-auto w-full px-5 sm:px-8 py-16 sm:py-20 flex flex-col gap-10">
        {/* Section Header */}
        <div className="text-center flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            What We Offer
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Everything You Need to Master Guest Reviews
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto text-sm sm:text-base">
            Our AI engine does the heavy lifting so you can focus on delivering
            exceptional guest experiences.
          </p>
        </div>

        {/* Cards Grid:
              mobile  → 1 column
              tablet  → 2 columns (sm:grid-cols-2)
              desktop → 3 columns (lg:grid-cols-3)
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((feature) => (
            <ReviewCard
              key={feature.title}
              icon={feature.icon}
              badge={feature.badge}
              title={feature.title}
              description={feature.description}
              buttonText={feature.buttonText}
            />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto w-full px-5 sm:px-8 pb-16 sm:pb-20">
        <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 sm:p-12 overflow-hidden text-center flex flex-col items-center gap-6">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/10 rounded-full blur-2xl" />
          </div>

          <h2 className="relative text-2xl sm:text-4xl font-black text-white leading-tight max-w-2xl">
            Ready to Transform Your Guest Reviews?
          </h2>
          <p className="relative text-indigo-100 font-medium max-w-lg text-sm sm:text-base">
            Join thousands of hospitality professionals already using AI to
            improve their guest satisfaction scores.
          </p>

          <div className="relative flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <a
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-8 py-3.5 rounded-2xl transition-all active:scale-95 shadow-lg"
            >
              Get Started Free
            </a>
            <a
              href="/analyze"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-500/30 hover:bg-indigo-500/50 text-white border border-white/20 font-bold px-8 py-3.5 rounded-2xl transition-all active:scale-95"
            >
              See a Demo
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}