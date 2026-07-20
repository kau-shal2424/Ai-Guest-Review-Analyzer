import React, { useState } from 'react';
import { Card, Badge } from '../../components/ui';
import { 
  HelpCircle, BookOpen, Key, Mail, Send, ChevronDown, CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';

const FAQS = [
  {
    q: "How does the AI sentiment analysis work?",
    a: "We send the text of your guest reviews directly to Google Gemini AI models. The model parses the review, extracts the dominant sentiment (Positive, Neutral, Negative), maps it to a category (Cleanliness, Host, Food, etc.), and automatically constructs a personalized suggested draft reply."
  },
  {
    q: "Can I customize the suggested AI replies?",
    a: "Yes! In the AI Report view, we provide alternate suggested draft choices. You can copy them, make edits, or trigger a full regeneration using the 'Regenerate Draft' action button."
  },
  {
    q: "What file formats can I drag and drop?",
    a: "We support drag-and-drop file uploads for plain Text files (.txt) and Comma-Separated Values (.csv). The system reads the content and populates the editor text area automatically."
  },
  {
    q: "Is there an easy way to export reviews data?",
    a: "Yes. From the 'My Reviews' manager or the 'Reports' dashboard, you can trigger 'Export CSV' to download complete backups of your analyzed records including AI sentiment and theme classifications."
  }
];

export default function HelpCenter() {
  const [openFaq, setOpenFaq] = useState(null);
  const [subject, setSubject] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!msg.trim()) {
      toast.error("Please enter a message.");
      return;
    }
    toast.success("Support request sent! Our desk team will contact you shortly.");
    setSubject("");
    setMsg("");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Help Center</h1>
        <p className="text-slate-500 dark:text-slate-400 text-[15px] font-medium">
          Find answers, check keyboard shortcuts, or contact customer support.
        </p>
      </div>

      {/* Getting Started Guide */}
      <Card className="p-6">
        <h3 className="text-md font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" /> Getting Started
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-semibold">
          <div className="space-y-2">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-full">Step 1</span>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2">Submit Feedback</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Paste guest feedback text or upload a CSV file in the review editor.</p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-full">Step 2</span>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2">Get AI Reports</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Instantly inspect score indices, theme breakdowns, and emotion checks.</p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-full">Step 3</span>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2">Copy Drafts</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Copy the suggested professional response directly to your dashboard.</p>
          </div>
        </div>
      </Card>

      {/* FAQs Panel */}
      <Card className="p-6">
        <h3 className="text-md font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-500" /> Frequently Asked Questions
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {FAQS.map((faq, i) => (
            <div key={i} className="py-4 first:pt-0 last:pb-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex justify-between items-center text-left text-sm font-bold text-slate-850 dark:text-slate-200 hover:text-indigo-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4.5 h-4.5 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              
              {openFaq === i && (
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed mt-2.5 pl-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Keyboard shortcuts & contact support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Keyboard Shortcuts */}
        <Card className="p-6">
          <h3 className="text-md font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-500" /> Keyboard Shortcuts
          </h3>

          <div className="space-y-4 font-semibold text-xs text-slate-655">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Open Command Palette</span>
              <kbd className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border rounded font-mono">Ctrl + K</kbd>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Close Modals or Palettes</span>
              <kbd className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border rounded font-mono">Escape</kbd>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Theme Toggle Mode</span>
              <kbd className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border rounded font-mono">T + M</kbd>
            </div>
          </div>
        </Card>

        {/* Contact Support form */}
        <Card className="p-6">
          <h3 className="text-md font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-500" /> Support Desk
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />

            <textarea
              placeholder="How can we help you?"
              value={msg}
              onChange={e => setMsg(e.target.value)}
              rows="3"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-semibold resize-none outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-xl shadow-md transition-colors"
            >
              <Send className="w-4 h-4" /> Send Request
            </button>
          </form>
        </Card>

      </div>

    </div>
  );
}


