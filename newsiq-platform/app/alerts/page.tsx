"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Plus, Trash2, Sliders, Volume2, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { newsArticles } from "@/lib/mockData";

interface KeywordAlert {
  id: string;
  keyword: string;
  matchCount: number;
  isActive: boolean;
  createdAt: number;
}

const SUGGESTED_KEYWORDS = [
  "IMF",
  "drought",
  "Cabinet reshuffle",
  "sovereign bonds",
  "inflation",
  "monsoon rain",
  "Vishwa Fernando",
  "Colombo tea auction",
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<KeywordAlert[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [mounted, setMounted] = useState(false);

  // Load from localStorage
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("newsiq_keyword_alerts");
    if (stored) {
      setAlerts(JSON.parse(stored));
    } else {
      // Seed default alerts
      const defaults: KeywordAlert[] = [
        { id: "1", keyword: "IMF loan", matchCount: 12, isActive: true, createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000 },
        { id: "2", keyword: "cricket final", matchCount: 6, isActive: true, createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000 },
        { id: "3", keyword: "startup funding", matchCount: 2, isActive: false, createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000 },
      ];
      setAlerts(defaults);
      localStorage.setItem("newsiq_keyword_alerts", JSON.stringify(defaults));
    }
  }, []);

  // Sync back to localStorage
  const saveAlerts = (newAlerts: KeywordAlert[]) => {
    setAlerts(newAlerts);
    localStorage.setItem("newsiq_keyword_alerts", JSON.stringify(newAlerts));
  };

  if (!mounted) return null;

  // Helper to dynamically calculate matches from mockData newsArticles
  const calculateMatches = (kw: string): number => {
    return newsArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(kw.toLowerCase()) ||
        a.summary.toLowerCase().includes(kw.toLowerCase())
    ).length;
  };

  const handleAddAlert = (kw: string) => {
    const trimmed = kw.trim();
    if (!trimmed) return;

    if (alerts.some((a) => a.keyword.toLowerCase() === trimmed.toLowerCase())) {
      toast.error(`Alert for "${trimmed}" already exists.`);
      return;
    }

    const matches = calculateMatches(trimmed);
    const newAlertItem: KeywordAlert = {
      id: Date.now().toString(),
      keyword: trimmed,
      matchCount: matches,
      isActive: true,
      createdAt: Date.now(),
    };

    saveAlerts([newAlertItem, ...alerts]);
    setNewKeyword("");
    toast.success(`Alert registered for "${trimmed}"!`);
  };

  const handleDeleteAlert = (id: string) => {
    const item = alerts.find((a) => a.id === id);
    saveAlerts(alerts.filter((a) => a.id !== id));
    if (item) {
      toast.success(`Deleted alert for "${item.keyword}"`);
    }
  };

  const toggleAlertActive = (id: string) => {
    saveAlerts(
      alerts.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060c18] text-slate-100">
      <Navbar activeCategory="All" onCategoryChange={() => {}} />

      <main className="flex-1 max-w-[1000px] mx-auto w-full px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={[{ label: "Keyword Alerts" }]} />
        </div>

        {/* Page Header */}
        <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-red-950/40 via-[#0b1222]/80 to-transparent border border-red-500/20 px-6 py-8 flex flex-col sm:flex-row items-center gap-5 justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/25 flex-shrink-0">
              <Bell size={20} className="text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-black">My Keyword Alerts</h1>
              <p className="text-slate-400 text-xs mt-0.5">
                Register keywords to receive real-time push alerts and digests when matched.
              </p>
            </div>
          </div>
          <div className="text-[10px] uppercase font-bold tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
            Monitoring Live
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add alert & list (Left 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Alert Form */}
            <div className="p-5 rounded-2xl bg-[#0b1222]/50 border border-white/[0.06] shadow-xl">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">
                Add New Keyword Monitor
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddAlert(newKeyword);
                }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Enter topic, company, person or phrase..."
                    className="w-full bg-[#060c18] border border-white/[0.08] focus:border-red-500/50 text-slate-200 placeholder:text-slate-500 rounded-xl pl-9 pr-4 py-2.5 outline-none text-xs transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary px-5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus size={14} /> Add Alert
                </button>
              </form>
            </div>

            {/* Registered Alerts List */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders size={12} /> Active Monitors ({alerts.length})
              </h3>

              <AnimatePresence mode="popLayout">
                {alerts.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12 border border-dashed border-white/[0.08] rounded-xl bg-[#0b1222]/10"
                  >
                    <p className="text-slate-500 text-xs">No active monitors registered.</p>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl border transition-all duration-200 bg-[#0b1222]/30",
                          alert.isActive
                            ? "border-white/[0.06]"
                            : "border-white/[0.03] opacity-60"
                        )}
                      >
                        <div className="min-w-0 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-sm truncate">{alert.keyword}</span>
                            <span className="text-[10px] bg-white/[0.05] border border-white/[0.08] text-slate-400 px-2 py-0.5 rounded-full font-semibold">
                              {alert.matchCount} match{alert.matchCount !== 1 ? "es" : ""} this week
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            Registered on {new Date(alert.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Toggle active switch */}
                          <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={alert.isActive}
                              onChange={() => toggleAlertActive(alert.id)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 peer-checked:after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500" />
                          </label>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteAlert(alert.id)}
                            className="p-2 bg-white/[0.02] border border-white/[0.06] hover:border-red-500/30 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg transition-colors outline-none"
                            aria-label={`Delete alert for ${alert.keyword}`}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Suggestions (Right 1/3) */}
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#0b1222]/50 border border-white/[0.06] shadow-xl">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Volume2 size={13} className="text-red-500" /> Suggested Keywords
              </h3>
              <p className="text-[10px] text-slate-500 mb-4">
                Popular topics trending in Sri Lanka and global macroeconomics today.
              </p>

              <div className="flex flex-wrap gap-2">
                {SUGGESTED_KEYWORDS.map((kw) => {
                  const isRegistered = alerts.some(
                    (a) => a.keyword.toLowerCase() === kw.toLowerCase()
                  );
                  return (
                    <button
                      key={kw}
                      onClick={() => !isRegistered && handleAddAlert(kw)}
                      disabled={isRegistered}
                      className={cn(
                        "flex items-center gap-1 py-1.5 px-2.5 rounded-lg border text-[11px] font-bold text-left transition-all outline-none",
                        isRegistered
                          ? "bg-white/[0.02] border-white/[0.04] text-slate-600 cursor-not-allowed"
                          : "bg-[#060c18] border-white/[0.06] text-slate-300 hover:border-red-500/30 hover:text-white"
                      )}
                    >
                      <span>{kw}</span>
                      {!isRegistered && <Plus size={10} className="text-red-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
