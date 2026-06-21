import React, { useState } from "react";
import {
  User,
  Bell,
  Sun,
  Moon,
  Monitor,
  Shield,
  Trash2,
  Save,
  Check,
  Camera,
  LogOut,
  Lock,
  Mail,
  Phone,
} from "lucide-react";
import { Button, Input } from "../components/ui";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";

// --- Toggle Switch Component ---
function Toggle({ checked, onChange, id }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer ${
        checked ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
      }`}
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
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            {description}
          </p>
        </div>
      </div>
      <div className="px-6 py-6 flex flex-col gap-5">{children}</div>
    </div>
  );
}

// --- Notification Row ---
function NotifRow({ title, description, defaultChecked = false }) {
  const [enabled, setEnabled] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-950/10 transition-colors">
      <div>
        <p className="text-sm font-bold text-slate-900 dark:text-white">{title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
          {description}
        </p>
      </div>
      <Toggle checked={enabled} onChange={setEnabled} />
    </div>
  );
}

export default function Settings() {
  // Profile
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("+1 (555) 000-0000");

  // Theme — wired to real ThemeContext
  const { theme, setLightTheme, setDarkTheme } = useTheme();
  const [localTheme, setLocalTheme] = useState(theme);

  const handleThemeSelect = (value) => {
    setLocalTheme(value);
    if (value === "light") setLightTheme();
    else if (value === "dark") setDarkTheme();
    else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      systemDark ? setDarkTheme() : setLightTheme();
    }
  };

  // Saving
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    }, 1200);
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: <Sun className="w-4 h-4" /> },
    { value: "dark", label: "Dark", icon: <Moon className="w-4 h-4" /> },
    { value: "system", label: "System", icon: <Monitor className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 md:px-8 flex flex-col gap-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Manage your account preferences and application settings.
          </p>
        </div>

        {/* ── 1. PROFILE SETTINGS ── */}
        <SettingCard
          title="Profile Settings"
          description="Update your personal information and public-facing details."
          icon={<User className="w-5 h-5" />}
        >
          {/* Avatar Row */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/20 select-none">
                {name.charAt(0)}
              </div>
              <button className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer shadow-sm">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{email}</p>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1.5 cursor-pointer hover:underline">
                Change avatar →
              </p>
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
                onChange={(e) => setEmail(e.target.value)}
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

            <div className="flex items-center justify-between pt-2">
              <div>
                {showSaved && (
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Profile saved!
                  </span>
                )}
              </div>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
                size="sm"
              >
                Save Profile
              </Button>
            </div>
          </form>
        </SettingCard>

        {/* ── 2. NOTIFICATION PREFERENCES ── */}
        <SettingCard
          title="Notification Preferences"
          description="Control how and when you receive alerts and report summaries."
          icon={<Bell className="w-5 h-5" />}
        >
          <NotifRow
            title="Critical Review Alerts"
            description="Instant alerts when AI detects a 1-star or very negative review."
            defaultChecked={true}
          />
          <NotifRow
            title="Weekly Analytics Summary"
            description="Receive a curated PDF report every Monday with review insights."
            defaultChecked={true}
          />
          <NotifRow
            title="AI Response Suggestions"
            description="Get notified when AI generates reply suggestions for unresponded reviews."
            defaultChecked={false}
          />
          <NotifRow
            title="New Platform Integrations"
            description="Alerts when new booking platforms (Airbnb, Booking.com) sync reviews."
            defaultChecked={false}
          />
          <NotifRow
            title="Product Updates & News"
            description="Stay informed about new features, improvements and changelog."
            defaultChecked={true}
          />
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
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/10"
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
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center font-medium">
            Selected theme: <span className="font-bold capitalize text-slate-600 dark:text-slate-300">{localTheme}</span>
          </p>
        </SettingCard>

        {/* ── 4. ACCOUNT SETTINGS ── */}
        <SettingCard
          title="Account Settings"
          description="Manage your account security and destructive account actions."
          icon={<Shield className="w-5 h-5" />}
        >
          {/* Change Password */}
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Password & Security</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Last changed 3 months ago.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Lock className="w-4 h-4" />}
              className="self-start"
            >
              Change Password
            </Button>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5 flex flex-col gap-3">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Sign Out</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Sign out of your account on this device.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<LogOut className="w-4 h-4" />}
              className="self-start"
            >
              Sign Out
            </Button>
          </div>

          <div className="border-t border-rose-100 dark:border-rose-900/20 pt-5 flex flex-col gap-3">
            <div>
              <p className="text-sm font-bold text-rose-600 dark:text-rose-400">Danger Zone</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="w-4 h-4" />}
              className="self-start"
            >
              Delete Account
            </Button>
          </div>
        </SettingCard>
      </div>
    </div>
  );
}
