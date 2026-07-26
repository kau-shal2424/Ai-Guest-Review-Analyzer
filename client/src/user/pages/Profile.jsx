import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useReviews } from '../hooks/useReviews';
import { Card, Badge, Progress, Skeleton } from '../../components/ui';
import { 
  User, Mail, Shield, CheckCircle, Award, Target, MessageSquare, Flame, AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user } = useAuth();
  const { reviews, loading, error, reload } = useReviews();

  const userStats = useMemo(() => {
    const total = reviews.length;
    const aiPowered = reviews.filter(r => r.aiPowered).length;
    const positive = reviews.filter(r => r.sentiment === 'Positive').length;

    const achievements = [
      { id: 'first', title: 'Getting Started', desc: 'Analyzed your first guest review.', active: total >= 1, points: 100 },
      { id: 'ai', title: 'AI Power User', desc: 'Analyzed 5 or more reviews with Gemini.', active: aiPowered >= 5, points: 250 },
      { id: 'clean', title: 'Detail Inspector', desc: 'Identified a cleanliness issue.', active: reviews.some(r => r.theme === 'Cleanliness'), points: 150 },
      { id: 'happy', title: 'Host Master', desc: 'Handled at least 3 positive feedback reviews.', active: positive >= 3, points: 300 },
    ];

    const score = achievements.reduce((acc, ach) => acc + (ach.active ? ach.points : 0), 0);

    return {
      total,
      aiPowered,
      achievements,
      score
    };
  }, [reviews]);

  if (loading) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto animate-pulse font-sans">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Skeleton className="h-48 rounded-3xl" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto py-12 font-sans">
        <Card className="p-8 text-center max-w-md mx-auto space-y-4 rounded-3xl">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Unable to Load Profile Data</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{error}</p>
          <button
            onClick={reload}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
          >
            Retry Loading
          </button>
        </Card>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 max-w-5xl mx-auto font-sans"
    >
      {/* Header Banner */}
      <Card className="p-6 md:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden border-none shadow-2xl rounded-3xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-purple-500 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {/* Avatar circle */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-lg border-2 border-white/20">
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold">{user?.fullName || 'User Profile'}</h2>
            <p className="text-sm text-slate-300 font-medium">{user?.email}</p>
            <div className="pt-2">
              <Badge variant="purple" className="bg-blue-500/20 text-blue-300 border-blue-400/20">
                Level {(Math.floor(userStats.score / 300) || 1)} Analyst
              </Badge>
            </div>
          </div>

          <div className="sm:ml-auto flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <Flame className="w-6 h-6 text-orange-400 animate-pulse" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Milestone Points</p>
              <p className="text-xl font-black text-white">{userStats.score} pts</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Details & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Info Grid column */}
        <div className="md:col-span-2 space-y-8">
          <Card className="p-6">
            <h3 className="text-md font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" /> Account Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-semibold">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold">
                  {user?.fullName || 'Guest User'}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold">
                  {user?.email}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Role</label>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm capitalize font-semibold">
                  {user?.role || 'User'}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verification Status</label>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle className="w-4 h-4" /> Enterprise Verified
                </div>
              </div>
            </div>
          </Card>

          {/* Account achievements */}
          <Card className="p-6">
            <h3 className="text-md font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-500" /> Analyst Milestones
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userStats.achievements.map((ach) => (
                <div 
                  key={ach.id}
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    ach.active 
                      ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm' 
                      : 'bg-transparent border-slate-100 dark:border-slate-900 opacity-40'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`p-2.5 rounded-xl h-fit ${ach.active ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-400'}`}>
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ach.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 leading-snug">{ach.desc}</p>
                      <span className="inline-block text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-2">+{ach.points} pts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar stats */}
        <div className="space-y-8">
          <Card className="p-6">
            <h3 className="text-md font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" /> Analyst Impact
            </h3>

            <div className="space-y-4 font-semibold text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <span>Reviews Processed</span>
                <span className="font-bold text-slate-900 dark:text-white">{userStats.total}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <span>Gemini AI Queries</span>
                <span className="font-bold text-slate-900 dark:text-white">{userStats.aiPowered}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Enterprise Tier</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">Professional</span>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </motion.div>
  );
}
