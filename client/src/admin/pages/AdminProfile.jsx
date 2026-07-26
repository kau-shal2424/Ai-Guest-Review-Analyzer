import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Shield, Save, CheckCircle, 
  Calendar, Lock, MessageSquare, Users, Award 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getSettings, updateProfile, changePassword } from '../../api/settings';
import { fetchAdminDashboard } from '../api/admin';
import { Card, Badge, Button, Input, Loader, showError, showSuccess } from '../../components/ui';

export default function AdminProfile() {
  const { user } = useAuth();
  
  // Loading & error state
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  
  // Data state
  const [profileData, setProfileData] = useState(null);
  const [adminStats, setAdminStats] = useState(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const loadAdminProfileData = async () => {
    try {
      setLoading(true);
      const [settingsRes, statsRes] = await Promise.all([
        getSettings(),
        fetchAdminDashboard().catch(() => null)
      ]);

      if (settingsRes?.profile) {
        setProfileData(settingsRes.profile);
        setFullName(settingsRes.profile.fullName || '');
        setPhone(settingsRes.profile.phone || '');
        setBio(settingsRes.profile.bio || '');
      }
      if (statsRes) {
        setAdminStats(statsRes);
      }
    } catch (err) {
      console.error('Failed to load admin profile:', err);
      showError('Failed to load admin profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminProfileData();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showError('Full name is required.');
      return;
    }
    setSavingProfile(true);
    try {
      await updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim() || null,
        bio: bio.trim() || null,
      });
      showSuccess('Admin profile updated successfully.');
      loadAdminProfileData();
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to update admin profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showError('Current password is required.');
      return;
    }
    if (newPassword.length < 8) {
      showError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showError('Confirm password does not match new password.');
      return;
    }
    setSavingPassword(true);
    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      showSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  const displayName = profileData?.fullName || user?.fullName || 'Admin User';
  const displayEmail = profileData?.email || user?.email || 'admin@example.com';
  const createdAtFormatted = profileData?.createdAt 
    ? new Date(profileData.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) 
    : 'System Administrator';

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <Card className="p-6 md:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden border-none shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-500 via-indigo-500 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {/* Admin Avatar Badge */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg border-2 border-rose-400/20">
            {displayName.charAt(0).toUpperCase()}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl font-extrabold">{displayName}</h1>
              <Badge variant="danger" className="bg-rose-500/20 text-rose-300 border-rose-400/20">
                <Shield className="w-3 h-3 inline mr-1" />
                Administrator
              </Badge>
            </div>
            <p className="text-sm text-slate-300 font-medium">{displayEmail}</p>
            <p className="text-xs text-slate-400">Account Created: {createdAtFormatted}</p>
          </div>

          <div className="sm:ml-auto flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <Award className="w-6 h-6 text-amber-400" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Access Privileges</p>
              <p className="text-xs font-extrabold text-emerald-400">FULL SYSTEM ROOT</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Admin Stats Overview */}
      {adminStats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Managed Users</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{adminStats.users?.totalUsers ?? 0}</h3>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Admins</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{adminStats.users?.totalAdmins ?? 1}</h3>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Reviews</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{adminStats.reviews?.total ?? 0}</h3>
            </div>
          </Card>
        </div>
      )}

      {/* Profile Details & Password Update */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Settings Form */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-500" /> Admin Profile Details
          </h2>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Admin Full Name"
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Email Address"
              type="email"
              value={displayEmail}
              disabled
              helperText="Email is bound to authentication record"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              leftIcon={<Phone className="w-4 h-4" />}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Admin Bio & Role Notes
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Admin responsibilities or notes..."
                rows="3"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={savingProfile}
                leftIcon={<Save className="w-4 h-4" />}
                className="w-full"
              >
                Save Profile
              </Button>
            </div>
          </form>
        </Card>

        {/* Change Password Form */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-500" /> Change Security Password
          </h2>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="secondary"
                isLoading={savingPassword}
                leftIcon={<Save className="w-4 h-4" />}
                className="w-full"
              >
                Update Password
              </Button>
            </div>
          </form>
        </Card>

      </div>
    </div>
  );
}
