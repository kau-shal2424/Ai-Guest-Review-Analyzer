import React, { useState, useEffect } from "react";
import {
  User, Bell, Sun, Moon, Monitor, Shield, Trash2, Save,
  Check, Lock, Mail, Phone, LogOut, ArrowLeft, ShieldAlert
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button, Input, showError, showSuccess } from "../../components/ui";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import {
  getSettings,
  updateProfile,
  changePassword,
  updateNotifications,
  updateTheme,
  deleteAccount
} from "../../api/settings";

// --- Toggle Switch Component ---
function Toggle({ checked, onChange, id, disabled = false }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer ${
        checked ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span
        className={`inline-block w-5 h-5 mt-0.5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

// --- Section Card Wrapper ---
function SettingCard({ title, description, icon, children }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-xl overflow-hidden">
      <div className="flex items-start gap-4 px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{title}</h2>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 font-semibold">
            {description}
          </p>
        </div>
      </div>
      <div className="px-6 py-6 flex flex-col gap-5">{children}</div>
    </div>
  );
}

// --- Delete Confirmation Modal ---
function DeleteAccountModal({ isOpen, onClose, onConfirm, loading }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800/80 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Delete Account?</h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
          This will permanently delete your account, saved theme, notification preferences, and all reviews you have submitted to this platform. This action is destructive and cannot be undone.
        </p>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-sm font-bold text-white transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const { user, logout } = useAuth();
  const { theme, setLightTheme, setDarkTheme } = useTheme();

  // Profile fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password change fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Local theme state
  const [localTheme, setLocalTheme] = useState(theme);

  // Notification Preferences toggles
  const [notifPrefs, setNotifPrefs] = useState({
    criticalReviews: true,
    weeklyReport: true,
    aiSuggestions: false,
    platformUpdates: false,
    securityAlerts: true,
    marketing: false,
  });

  // Modal and deletion states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getSettings();
        setName(data.profile.fullName);
        setEmail(data.profile.email);
        setPhone(data.profile.phone || "");
        setBio(data.profile.bio || "");
        setLocalTheme(data.theme);
        if (data.notifications) {
          setNotifPrefs(data.notifications);
        }
      } catch (err) {
        showError("Failed to fetch settings from server.");
      } finally {
        setLoadingSettings(false);
      }
    };
    loadData();
  }, []);

  // Sync theme selection to server and local context
  const handleThemeSelect = async (value) => {
    setLocalTheme(value);
    if (value === "light") setLightTheme();
    else if (value === "dark") setDarkTheme();
    else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      systemDark ? setDarkTheme() : setLightTheme();
    }
    try {
      await updateTheme(value);
    } catch {
      // ignore silent sync errors
    }
  };

  // Update specific notification toggle
  const handleNotifToggle = async (key, val) => {
    const updated = { ...notifPrefs, [key]: val };
    setNotifPrefs(updated);
    try {
      await updateNotifications(updated);
    } catch {
      showError("Failed to save notification preferences to server.");
    }
  };

  // Profile save handler
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showError("Full name is required.");
      return;
    }
    setIsSavingProfile(true);
    try {
      await updateProfile({
        fullName: name.trim(),
        phone: phone.trim() || null,
        bio: bio.trim() || null,
      });
      showSuccess("Profile settings saved successfully.");
    } catch (err) {
      showError(err.response?.data?.detail || "Failed to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Password change handler
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showError("Current password is required.");
      return;
    }
    if (newPassword.length < 8) {
      showError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showError("Confirm password does not match new password.");
      return;
    }
    setIsChangingPassword(true);
    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword
      });
      showSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (err) {
      showError(err.response?.data?.detail || "Failed to change password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      showSuccess("Your account was successfully deleted. Logging out.");
      logout();
    } catch (err) {
      showError(err.response?.data?.detail || "Failed to delete account.");
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: <Sun className="w-4 h-4" /> },
    { value: "dark", label: "Dark", icon: <Moon className="w-4 h-4" /> },
    { value: "system", label: "System", icon: <Monitor className="w-4 h-4" /> },
  ];

  if (loadingSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 md:px-8 flex flex-col gap-8 pt-24">
        {/* Back Link */}
        {user?.role === "admin" ? (
          <Link to="/admin-dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Admin Panel
          </Link>
        ) : (
          <Link to="/user/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        )}

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-semibold">
            Manage your account preferences and application settings.
          </p>
        </div>

        {/* ── 1. PROFILE SETTINGS ── */}
        <SettingCard
          title="Profile Settings"
          description="Update your personal details and account context."
          icon={<User className="w-5 h-5" />}
        >
          {/* Static Initials Avatar Display */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/20 select-none">
              {name ? name.substring(0, 2).toUpperCase() : "?"}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{name || "Your Name"}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{email || "your.email@example.com"}</p>
              <span className="inline-block mt-2 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                {user?.role === "admin" ? "Administrator" : "Standard Account"}
              </span>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                leftIcon={<User className="w-4 h-4" />}
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                disabled
                helperText="Email is static and linked to authentication provider"
                placeholder="Your email"
                leftIcon={<Mail className="w-4 h-4" />}
              />
            </div>
            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              leftIcon={<Phone className="w-4 h-4" />}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a brief bio..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSavingProfile}
                leftIcon={<Save className="w-4 h-4" />}
                size="sm"
              >
                Save Profile Settings
              </Button>
            </div>
          </form>
        </SettingCard>

        {/* ── 2. NOTIFICATION PREFERENCES ── */}
        <SettingCard
          title="Notification Preferences"
          description="Control when and how you receive alerts and reports."
          icon={<Bell className="w-5 h-5" />}
        >
          {[
            { key: "criticalReviews", title: "Critical Review Alerts", desc: "Instant alert when AI detects a 1-star or negative review." },
            { key: "weeklyReport", title: "Weekly Analytics Summary", desc: "Curated summary sent every Monday with review insights." },
            { key: "aiSuggestions", title: "AI Response Suggestions", desc: "Notify when AI generates auto-reply suggestions." },
            { key: "platformUpdates", title: "New Platform Integrations", desc: "Alerts when booking platform connections sync." },
            { key: "securityAlerts", title: "Security Alerts", desc: "Notify on password resets and suspicious system activity." },
            { key: "marketing", title: "Product Updates & News", desc: "Stay informed about new features, improvements and changelogs." },
          ].map(({ key, title, desc }) => (
            <div key={key} className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/85 hover:bg-slate-50 dark:hover:bg-slate-950/10 transition-colors">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-semibold">
                  {desc}
                </p>
              </div>
              <Toggle checked={notifPrefs[key]} onChange={(val) => handleNotifToggle(key, val)} />
            </div>
          ))}
        </SettingCard>

        {/* ── 3. THEME TOGGLE ── */}
        <SettingCard
          title="Theme"
          description="Choose your preferred display mode for the application interface."
          icon={<Sun className="w-5 h-5" />}
        >
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleThemeSelect(opt.value)}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer font-semibold text-sm ${
                  localTheme === opt.value
                    ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/10"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/30"
                }`}
              >
                <span
                  className={`p-2 rounded-xl ${
                    localTheme === opt.value
                      ? "bg-indigo-100 dark:bg-indigo-900/50"
                      : "bg-slate-100 dark:bg-slate-800"
                  }`}
                >
                  {opt.icon}
                </span>
                {opt.label}
                {localTheme === opt.value && (
                  <span className="text-xs font-bold px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full">
                    Active
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center font-semibold">
            Selected theme: <span className="font-bold capitalize text-slate-600 dark:text-slate-300">{localTheme}</span>
          </p>
        </SettingCard>

        {/* ── 4. ACCOUNT SETTINGS ── */}
        <SettingCard
          title="Account Settings"
          description="Manage your account security and destructive actions."
          icon={<Shield className="w-5 h-5" />}
        >
          {/* Change Password Form Toggle */}
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Password &amp; Security</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-semibold">
                Manage your profile security password.
              </p>
            </div>
            {!showPasswordForm ? (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Lock className="w-4 h-4" />}
                className="self-start"
                onClick={() => setShowPasswordForm(true)}
              >
                Change Password
              </Button>
            ) : (
              <form onSubmit={handlePasswordChange} className="flex flex-col gap-4 max-w-md mt-2">
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
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isChangingPassword}
                    size="sm"
                  >
                    Confirm Change
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Sign Out */}
          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5 flex flex-col gap-3">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Sign Out</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-semibold">
                Sign out of your session on this device.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<LogOut className="w-4 h-4" />}
              className="self-start"
              onClick={logout}
            >
              Sign Out
            </Button>
          </div>

          {/* Delete Account */}
          <div className="border-t border-rose-100 dark:border-rose-900/20 pt-5 flex flex-col gap-3">
            <div>
              <p className="text-sm font-bold text-rose-600 dark:text-rose-400">Danger Zone</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-semibold">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="w-4 h-4" />}
              className="self-start"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Account
            </Button>
          </div>
        </SettingCard>
      </div>

      <DeleteAccountModal
        isOpen={showDeleteModal}
        loading={isDeleting}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}

