"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  Menu,
  X,
  Globe,
  Sun,
  Moon,
  ChevronDown,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/mockData";
import { toast } from "sonner";

const categories: Category[] = [
  "All",
  "Politics",
  "Business",
  "Sports",
  "Tech",
  "Climate",
];

const languages = [
  { code: "EN", label: "English" },
  { code: "සිං", label: "සිංහල" },
  { code: "தமி", label: "தமிழ்" },
];

interface NavbarProps {
  activeCategory: Category;
  onCategoryChange: (cat: Category) => void;
}

export default function Navbar({ activeCategory, onCategoryChange }: NavbarProps) {
  const [isDark, setIsDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [activeLang, setActiveLang] = useState("EN");
  const [searchQuery, setSearchQuery] = useState("");
  const notificationCount = 4;

  const handleLogin = () => toast.info("Login feature coming soon!");
  const handleSignUp = () => toast.success("Sign up feature coming soon!");
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) toast.info(`Searching for: "${searchQuery}"`);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Main navbar */}
      <div className="bg-[#080d1a]/95 backdrop-blur-xl border-b border-white/[0.07]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 flex-shrink-0 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:shadow-red-500/50 transition-shadow">
                <Zap size={16} className="text-white fill-white" />
              </div>
              <span className="text-xl font-black tracking-tight">
                News<span className="text-red-500">IQ</span>
              </span>
            </a>

            {/* Search bar — desktop */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-md mx-4 relative"
            >
              <div className="w-full relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search news, topics, sources..."
                  className="w-full bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.14] focus:border-red-500/50 focus:bg-white/[0.08] text-sm text-slate-200 placeholder:text-slate-500 rounded-full pl-9 pr-4 py-2 outline-none transition-all duration-200"
                />
              </div>
            </form>

            {/* Spacer */}
            <div className="flex-1 md:hidden" />

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Language switcher */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-slate-300 text-xs font-semibold transition-all duration-200"
                  id="lang-switcher"
                >
                  <Globe size={13} />
                  {activeLang}
                  <ChevronDown
                    size={11}
                    className={cn("transition-transform", langOpen && "rotate-180")}
                  />
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-36 bg-[#131d32] border border-white/[0.1] rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setActiveLang(lang.code);
                            setLangOpen(false);
                            toast.info(`Language switched to ${lang.label}`);
                          }}
                          className={cn(
                            "w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors",
                            activeLang === lang.code
                              ? "bg-red-500/20 text-red-400 font-semibold"
                              : "text-slate-300 hover:bg-white/[0.06]"
                          )}
                        >
                          <span className="font-mono text-xs opacity-70">{lang.code}</span>
                          <span>{lang.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dark/light toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-slate-400 hover:text-white transition-all duration-200"
                aria-label="Toggle theme"
                id="theme-toggle"
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              {/* Notification bell */}
              <button
                className="relative p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-slate-400 hover:text-white transition-all duration-200"
                aria-label="Notifications"
                id="notifications-btn"
                onClick={() => toast.info(`You have ${notificationCount} unread notifications`)}
              >
                <Bell size={15} />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-black text-white flex items-center justify-center leading-none shadow-lg shadow-red-500/50 animate-pulse-dot">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Auth buttons — desktop */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={handleLogin}
                  className="btn-ghost text-sm py-1.5 px-3"
                  id="login-btn"
                >
                  Login
                </button>
                <button
                  onClick={handleSignUp}
                  className="btn-primary text-sm py-1.5 px-4"
                  id="signup-btn"
                >
                  Sign Up
                </button>
              </div>

              {/* Hamburger — mobile */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="sm:hidden p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-slate-400 hover:text-white transition-all duration-200"
                aria-label="Menu"
                id="mobile-menu-btn"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Category tabs — desktop */}
        <div className="hidden md:block border-t border-white/[0.05]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={cn(
                    "category-tab",
                    activeCategory === cat
                      ? "category-tab-active"
                      : "category-tab-inactive"
                  )}
                  id={`category-${cat.toLowerCase()}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden bg-[#0a1020]/98 backdrop-blur-xl border-b border-white/[0.07] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search news..."
                  className="w-full bg-white/[0.06] border border-white/[0.1] text-sm text-slate-200 placeholder:text-slate-500 rounded-full pl-9 pr-4 py-2 outline-none focus:border-red-500/50"
                />
              </form>

              {/* Mobile categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { onCategoryChange(cat); setMobileOpen(false); }}
                    className={cn(
                      "category-tab text-xs",
                      activeCategory === cat ? "category-tab-active" : "category-tab-inactive"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Mobile language + auth */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setActiveLang(lang.code); setMobileOpen(false); }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                      activeLang === lang.code
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-white/5 text-slate-400 border-white/10"
                    )}
                  >
                    {lang.code}
                  </button>
                ))}
                <div className="flex-1" />
                <button onClick={handleLogin} className="btn-ghost text-xs py-1.5 px-3">Login</button>
                <button onClick={handleSignUp} className="btn-primary text-xs py-1.5 px-3">Sign Up</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
