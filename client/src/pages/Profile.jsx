import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../hooks/useReviews';
import { Card, Badge, Progress } from '../components/ui';
import { 
  User, Mail, Shield, CheckCircle, Award, Target, MessageSquare, Flame 
} from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const { reviews } = useReviews();

  const userStats = useMemo(() => {
    const total = reviews.length;
    const aiPowered = reviews.filter(r => r.aiPowered).length;
    const positive = reviews.filter(r => r.sentiment === 'Positive').length;

    // Gamify Achievements milestones based on real metrics
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

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <Card className="p-6 md:p-8 bg-gradient-to-r from-slate-900 to-indigo-950 text-white relative overflow-hidden border-none shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/4 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-purple-500 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {/* Avatar circle */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-lg border-2 border-indigo-400/20">
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold">{user?.fullName || 'User Profile'}</h2>
            <p className="text-sm text-slate-300 font-semibold">{user?.email}</p>
            <div className="pt-2">
              <Badge variant="purple" className="bg-indigo-500/20 text-indigo-300 border-indigo-400/10">
                Level {(Math.floor(userStats.score / 300) || 1)} Analyst
              </Badge>
            </div>
          </div>

          <div className="sm:ml-auto flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10">
            <Flame className="w-6 h-6 text-orange-400 animate-pulse" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Gamified Score</p>
              <p className="text-lg font-black text-white">{userStats.score} pts</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Details & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Info Grid column */}
        <div className="md:col-span-2 space-y-8">
          <Card className="p-6">
            <h3 className="text-md font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" /> Account Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-sm">
                  {user?.fullName || 'Guest User'}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-sm">
                  {user?.email}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Account Role</label>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-sm capitalize">
                  {user?.role || 'User'}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Account Status</label>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-sm flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-4 h-4" /> Fully Verified
                </div>
              </div>
            </div>
          </Card>

          {/* Account achievements */}
          <Card className="p-6">
            <h3 className="text-md font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" /> Analyst Milestones
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userStats.achievements.map((ach) => (
                <div 
                  key={ach.id}
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    ach.active 
                      ? 'bg-slate-50 dark:bg-slate-900 border-slate-200/50 dark:border-slate-800' 
                      : 'bg-transparent border-slate-100 dark:border-slate-900 opacity-40'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-xl h-fit ${ach.active ? 'bg-indigo-500 text-white shadow-md' : 'bg-slate-200 text-slate-400'}`}>
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ach.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-semibold">{ach.desc}</p>
                      <span className="text-[10px] font-bold text-slate-400 block mt-2">+{ach.points} XP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Overview Stats Sidebar */}
        <div className="space-y-8">
          <Card className="p-6">
            <h3 className="text-md font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-500" /> Account Statistics
            </h3>

            <div className="space-y-5">
              <div className="flex justify-between items-center pb-3.5 border-b border-slate-50 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500">Reviews Analyzed</span>
                <span className="text-sm font-bold">{userStats.total}</span>
              </div>

              <div className="flex justify-between items-center pb-3.5 border-b border-slate-50 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500">AI Powered Analyses</span>
                <span className="text-sm font-bold">{userStats.aiPowered}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500">Milestones Unlocked</span>
                <span className="text-sm font-bold">
                  {userStats.achievements.filter(a => a.active).length} / {userStats.achievements.length}
                </span>
              </div>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}
