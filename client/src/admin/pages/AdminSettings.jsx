import React, { useState, useEffect } from 'react';
import { Bell, Settings, Shield, Save, Check } from 'lucide-react';
import { getSettings, updateProfile, changePassword, updateNotifications, updateTheme } from '../../api/settings';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { showError, showSuccess } from '../../components/ui';
import Loader from '../../components/ui/Loader';

function Toggle({ checked, onChange, id }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${checked ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-700'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

export default function AdminSettings() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: '', phone: '', bio: '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    getSettings().then(data => {
      setSettings(data);
      setProfileForm({ fullName: data.fullName || '', phone: data.phone || '', bio: data.bio || '' });
    }).catch(() => showError('Failed to load settings.')).finally(() => setLoading(false));
  }, []);

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      await updateProfile(profileForm);
      showSuccess('Profile updated successfully.');
    } catch {
      showError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    if (passForm.newPassword !== passForm.confirmPassword) {
      showError('Passwords do not match.');
      return;
    }
    setSaving(true);
    try {
      await changePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      showSuccess('Password changed successfully.');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showError(err?.response?.data?.detail || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader size="lg" /></div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage your admin account preferences</p>
      </div>

      {/* Profile */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2"><Shield className="w-4 h-4 text-violet-500" /> Admin Profile</h2>
        <div className="space-y-3">
          {[
            { label: 'Full Name', key: 'fullName', type: 'text' },
            { label: 'Phone', key: 'phone', type: 'tel' },
            { label: 'Bio', key: 'bio', type: 'text' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">{f.label}</label>
              <input
                type={f.type}
                value={profileForm[f.key]}
                onChange={e => setProfileForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          ))}
        </div>
        <button onClick={handleProfileSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-60 transition-colors">
          <Save className="w-4 h-4" /> Save Profile
        </button>
      </div>

      {/* Password */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Change Password</h2>
        <div className="space-y-3">
          {[
            { label: 'Current Password', key: 'currentPassword' },
            { label: 'New Password', key: 'newPassword' },
            { label: 'Confirm New Password', key: 'confirmPassword' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">{f.label}</label>
              <input
                type="password"
                value={passForm[f.key]}
                onChange={e => setPassForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          ))}
        </div>
        <button onClick={handlePasswordSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-60 transition-colors">
          <Save className="w-4 h-4" /> Update Password
        </button>
      </div>

      {/* Theme */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Dark Mode</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Toggle the control panel theme</p>
          </div>
          <Toggle checked={isDark} onChange={toggleTheme} id="admin-dark-mode" />
        </div>
      </div>
    </div>
  );
}
