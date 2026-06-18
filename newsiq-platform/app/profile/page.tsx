"use client";

import React, { useState, useEffect } from "react";
import {
  User, Mail, MapPin, Calendar, Check, Bell, ShieldAlert,
  Loader2, Trash2, Key, BookOpen
} from "lucide-react";
import { useAuth, ProtectedRoute } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { cn } from "@/lib/utils";

const INTEREST_TOPICS = [
  "Politics", "Business", "Sports", "Tech",
  "Climate", "Entertainment", "Science", "Health"
];

function ProfilePageClient() {
  const { user, updateProfile, deleteAccount, logout } = useAuth();

  // Basic Profile Info States
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Interests Selection States
  const [interests, setInterests] = useState<string[]>([]);
  const [isUpdatingInterests, setIsUpdatingInterests] = useState(false);

  // Notification Preference Toggles
  const [breakingNews, setBreakingNews] = useState(false);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [keywordAlerts, setKeywordAlerts] = useState(false);
  const [financialAlerts, setFinancialAlerts] = useState(false);
  const [isUpdatingNotifications, setIsUpdatingNotifications] = useState(false);

  // Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passError, setPassError] = useState("");

  // Populate form state when user changes
  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio || "");
      setLocation(user.location || "");
      setInterests(user.interests || []);
      setBreakingNews(user.notificationPrefs?.breakingNews ?? false);
      setDailyDigest(user.notificationPrefs?.dailyDigest ?? false);
      setKeywordAlerts(user.notificationPrefs?.keywordAlerts ?? false);
      setFinancialAlerts(user.notificationPrefs?.financialAlerts ?? false);
    }
  }, [user]);

  // Handle Edit Profile Form Submission
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsUpdatingProfile(true);
    await updateProfile({ name, bio, location });
    setIsUpdatingProfile(false);
  };

  // Toggle Interests Badges
  const toggleInterest = (topic: string) => {
    setInterests((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  // Save Interests Action
  const handleSaveInterests = async () => {
    setIsUpdatingInterests(true);
    await updateProfile({ interests });
    setIsUpdatingInterests(false);
  };

  // Save Notification Prefs Action
  const handleSaveNotifications = async () => {
    setIsUpdatingNotifications(true);
    await updateProfile({
      notificationPrefs: {
        breakingNews,
        dailyDigest,
        keywordAlerts,
        financialAlerts,
      },
    });
    setIsUpdatingNotifications(false);
  };

  // Save Change Password Action
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPassError("All fields are required");
      return;
    }
    if (newPassword.length < 6) {
      setPassError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError("Confirm password does not match");
      return;
    }

    setPassError("");
    setIsUpdatingPassword(true);
    // Mock Password Change API Delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsUpdatingPassword(false);
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    
    // Simulate successful password toast alert
    alert("Password updated successfully!");
  };

  // Save Delete Account action
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "WARNING: This will permanently delete your account and custom preferences. This action cannot be undone. Do you wish to proceed?"
    );
    if (confirmDelete) {
      await deleteAccount();
    }
  };

  // Calculate user initials
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "U";

  return (
    <div className="min-h-screen flex flex-col bg-[#060c18] text-slate-100">
      <Navbar activeCategory="All" onCategoryChange={() => {}} />

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 sm:px-6 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumb items={[{ label: "User Settings & Profile" }]} />
        </div>

        {/* ── Profile Header ─────────────────────────────────────────────── */}
        <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-[#0b1222]/80 via-[#0b1222]/40 to-transparent border border-white/[0.06] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-red-500/20 flex-shrink-0 select-none">
            {initials}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-xl sm:text-2xl font-black text-white">{name || "User Profile"}</h1>
            <p className="text-slate-400 text-xs mt-1 flex items-center justify-center sm:justify-start gap-1">
              <Mail size={12} className="text-slate-500" /> {user?.email}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Calendar size={12} /> Joined {user?.memberSince || "Today"}
              </span>
              {location && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {location}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 border border-white/[0.08] hover:border-red-500/30 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all outline-none"
          >
            Logout
          </button>
        </div>

        {/* ── Settings Sections ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Edit Profile + Change Password (Left 2/3) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Edit Profile Form */}
            <section className="bg-[#0b1222]/50 border border-white/[0.06] rounded-xl p-5 sm:p-6">
              <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-1.5 border-b border-white/[0.06] pb-3">
                <User size={14} className="text-red-500" /> Account Information
              </h3>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-[#060c18] border border-white/[0.08] focus:border-red-500/50 text-slate-200 placeholder:text-slate-500 rounded-xl px-4 py-2.5 outline-none text-xs transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Bio / Summary
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-[#060c18] border border-white/[0.08] focus:border-red-500/50 text-slate-200 placeholder:text-slate-500 rounded-xl px-4 py-2.5 outline-none text-xs transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#060c18] border border-white/[0.08] focus:border-red-500/50 text-slate-200 placeholder:text-slate-500 rounded-xl px-4 py-2.5 outline-none text-xs transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-red-500/10 flex items-center gap-2"
                >
                  {isUpdatingProfile && <Loader2 size={12} className="animate-spin" />}
                  Save Information
                </button>
              </form>
            </section>

            {/* Change Password Section */}
            <section className="bg-[#0b1222]/50 border border-white/[0.06] rounded-xl p-5 sm:p-6">
              <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-1.5 border-b border-white/[0.06] pb-3">
                <Key size={14} className="text-red-500" /> Security settings
              </h3>
              <form onSubmit={handleSavePassword} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => { setCurrentPassword(e.target.value); setPassError(""); }}
                    placeholder="Enter current password"
                    className="w-full bg-[#060c18] border border-white/[0.08] focus:border-red-500/50 text-slate-200 placeholder:text-slate-500 rounded-xl px-4 py-2.5 outline-none text-xs transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setPassError(""); }}
                      placeholder="At least 6 chars"
                      className="w-full bg-[#060c18] border border-white/[0.08] focus:border-red-500/50 text-slate-200 placeholder:text-slate-500 rounded-xl px-4 py-2.5 outline-none text-xs transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setPassError(""); }}
                      placeholder="Confirm password"
                      className="w-full bg-[#060c18] border border-white/[0.08] focus:border-red-500/50 text-slate-200 placeholder:text-slate-500 rounded-xl px-4 py-2.5 outline-none text-xs transition-all"
                    />
                  </div>
                </div>
                {passError && <p className="text-red-500 text-[10px] mt-1">{passError}</p>}
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-5 py-2.5 bg-white/[0.04] border border-white/[0.08] hover:border-red-500/30 hover:bg-white/[0.06] text-white rounded-xl text-xs font-bold transition-all outline-none flex items-center gap-2"
                >
                  {isUpdatingPassword && <Loader2 size={12} className="animate-spin" />}
                  Change Password
                </button>
              </form>
            </section>
          </div>

          {/* Interests + Notifications (Right 1/3) */}
          <div className="space-y-8">
            
            {/* Interests preferences grid */}
            <section className="bg-[#0b1222]/50 border border-white/[0.06] rounded-xl p-5 sm:p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5 border-b border-white/[0.06] pb-3">
                <BookOpen size={14} className="text-red-500" /> Reading Interests
              </h3>
              <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
                Personalise the headlines aggregated on your home dashboard feed.
              </p>
              
              <div className="grid grid-cols-2 gap-2 mb-5">
                {INTEREST_TOPICS.map((topic) => {
                  const isSelected = interests.includes(topic);
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleInterest(topic)}
                      className={cn(
                        "flex items-center justify-center gap-1 py-2 px-3 rounded-lg border text-[11px] font-bold text-center transition-all outline-none select-none",
                        isSelected
                          ? "bg-red-500/15 border-red-500/30 text-white"
                          : "bg-[#060c18] border-white/[0.06] text-slate-400 hover:text-slate-300"
                      )}
                    >
                      {isSelected && <Check size={10} className="text-red-500" />}
                      <span>{topic}</span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={handleSaveInterests}
                disabled={isUpdatingInterests}
                className="w-full btn-primary py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                {isUpdatingInterests && <Loader2 size={12} className="animate-spin" />}
                Save Interests
              </button>
            </section>

            {/* Notification Preferences */}
            <section className="bg-[#0b1222]/50 border border-white/[0.06] rounded-xl p-5 sm:p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5 border-b border-white/[0.06] pb-3">
                <Bell size={14} className="text-red-500" /> Notification alerts
              </h3>
              
              <div className="space-y-4 mb-5">
                {/* Breaking News */}
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="pr-4">
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors block">
                      Breaking news alerts
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Instant browser notifications for major headlines
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={breakingNews}
                    onChange={(e) => setBreakingNews(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 accent-red-500 bg-transparent cursor-pointer"
                  />
                </label>

                {/* Daily Digest */}
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="pr-4">
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors block">
                      Daily digest email
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Morning briefing of customized top headlines
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={dailyDigest}
                    onChange={(e) => setDailyDigest(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 accent-red-500 bg-transparent cursor-pointer"
                  />
                </label>

                {/* Keyword Alerts */}
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="pr-4">
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors block">
                      Keyword alert matching
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Notify when custom registered words match articles
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={keywordAlerts}
                    onChange={(e) => setKeywordAlerts(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 accent-red-500 bg-transparent cursor-pointer"
                  />
                </label>

                {/* Financial Alerts */}
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="pr-4">
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors block">
                      Macro & Finance Alerts
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      High impact stock market and commodity updates
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={financialAlerts}
                    onChange={(e) => setFinancialAlerts(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 accent-red-500 bg-transparent cursor-pointer"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={handleSaveNotifications}
                disabled={isUpdatingNotifications}
                className="w-full btn-primary py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                {isUpdatingNotifications && <Loader2 size={12} className="animate-spin" />}
                Save Preferences
              </button>
            </section>

            {/* Danger Zone */}
            <section className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
              <h3 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-1.5">
                <ShieldAlert size={14} /> Danger Zone
              </h3>
              <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
                Permanently close and delete your NewsIQ account profile and bookmarks. This cannot be undone.
              </p>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-red-600/10 outline-none"
              >
                <Trash2 size={12} /> Delete Account
              </button>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageClient />
    </ProtectedRoute>
  );
}
