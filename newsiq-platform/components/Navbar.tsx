"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Bell,
  Globe,
  ChevronDown,
  Bookmark,
  Sun,
  Moon,
  TrendingUp,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import SearchModal from "@/components/SearchModal";
import NotificationDropdown from "@/components/NotificationDropdown";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface NavbarProps {
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const languages = [
  { code: "EN", label: "English" },
  { code: "SI", label: "සිංහල" },
  { code: "TA", label: "தமிழ்" },
];

const categories = ["All", "Politics", "Business", "Sports", "Tech", "Climate", "Entertainment"];

export default function Navbar({ activeCategory = "All", onCategoryChange = () => {} }: NavbarProps) {
  const router = useRouter();
  const { bookmarks } = useBookmarks();
  const { user, isAuthenticated } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeLang, setActiveLang] = useState("EN");
  const [isDark, setIsDark] = useState(true);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const bookmarkCount = bookmarks.length;

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const handleLogin = () => {
    setMobileOpen(false);
    router.push("/auth/login");
  };

  const handleSignUp = () => {
    setMobileOpen(false);
    router.push("/auth/register");
  };

  // Get user initials for avatar fallback
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-[40] w-full bg-[#060c18]/85 backdrop-blur-md border-b border-white/[0.06] select-none">
      <div className="max-w-[1400px] mx-auto w-full">
        {/* Main top bar */}
        <div className="px-4 sm:px-6 py-3.5">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={() => router.push("/")}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                <Zap size={15} className="text-white fill-white" />
              </div>
              <span className="text-white font-black text-lg tracking-tight">
                News<span className="text-red-500">IQ</span>
              </span>
            </div>

            {/* Search Input Trigger (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-md relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search news, topics, keywords..."
                readOnly
                onClick={() => setSearchModalOpen(true)}
                className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.12] hover:bg-white/[0.06] text-slate-200 placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2 text-xs cursor-pointer outline-none transition-all duration-200"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-500 bg-white/[0.04] border border-white/[0.08] px-1.5 py-0.5 rounded">
                ⌘K
              </span>
            </div>

            {/* Right-aligned Navigation Controls */}
            <div className="flex items-center gap-3">
              
              {/* Search Icon Trigger (Mobile/Tablet) */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="md:hidden p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-slate-400 hover:text-white transition-all duration-200 outline-none"
                aria-label="Search articles"
              >
                <Search size={15} />
              </button>

              {/* Language switcher */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-slate-300 text-xs font-semibold transition-all duration-200 outline-none"
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
                      className="absolute right-0 top-full mt-2 w-36 bg-[#0b1222] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-50 p-1"
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
                            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors outline-none",
                            activeLang === lang.code
                              ? "bg-red-500/10 text-red-400 font-semibold"
                              : "text-slate-300 hover:bg-white/[0.04]"
                          )}
                        >
                          <span className="font-mono text-[10px] opacity-70">{lang.code}</span>
                          <span>{lang.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Finance Portal Page link */}
              <button
                onClick={() => router.push("/financial")}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-red-500/10 border border-white/[0.08] hover:border-red-500/20 text-slate-400 hover:text-red-400 text-xs font-semibold transition-all duration-200 outline-none"
              >
                Finance
              </button>

              {/* Climate Portal Page link */}
              <button
                onClick={() => router.push("/climate")}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-emerald-500/10 border border-white/[0.08] hover:border-emerald-500/20 text-slate-400 hover:text-emerald-450 text-xs font-semibold transition-all duration-200 outline-none"
              >
                Climate
              </button>

              {/* Trending page link */}
              <button
                onClick={() => router.push("/trending")}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-red-500/10 border border-white/[0.08] hover:border-red-500/20 text-slate-400 hover:text-red-400 text-xs font-semibold transition-all duration-200 outline-none"
                id="trending-nav-btn"
              >
                <TrendingUp size={13} />
                Trending
              </button>

              {/* Bookmarks Page Link */}
              <button
                onClick={() => router.push("/bookmarks")}
                className="relative p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-slate-400 hover:text-white transition-all duration-200 outline-none"
                aria-label="My bookmarks"
                id="bookmarks-nav-btn"
              >
                <Bookmark size={15} />
                {bookmarkCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-black text-white flex items-center justify-center leading-none shadow-lg shadow-red-500/50">
                    {bookmarkCount > 9 ? "9+" : bookmarkCount}
                  </span>
                )}
              </button>

              {/* Notification bell dropdown toggle */}
              <div className="relative">
                <button
                  className="relative p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-slate-400 hover:text-white transition-all duration-200 outline-none"
                  aria-label="Notifications"
                  id="notifications-btn"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <Bell size={15} />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-black text-white flex items-center justify-center leading-none shadow-lg shadow-red-500/50 animate-pulse">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>
                
                <NotificationDropdown
                  isOpen={notificationsOpen}
                  onClose={() => setNotificationsOpen(false)}
                  onUnreadCountChange={(count) => setUnreadNotificationsCount(count)}
                />
              </div>

              {/* Dark/light toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-slate-400 hover:text-white transition-all duration-200 outline-none"
                aria-label="Toggle theme"
                id="theme-toggle"
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              {/* Profile Avatar or Auth Buttons */}
              <div className="h-5 w-px bg-white/10 hidden sm:block" />
              
              {isAuthenticated ? (
                <button
                  onClick={() => router.push("/profile")}
                  className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 text-white text-xs font-black shadow-lg shadow-red-500/10 flex items-center justify-center hover:scale-105 transition-all outline-none"
                  id="profile-nav-btn"
                >
                  {initials}
                </button>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={handleLogin}
                    className="btn-ghost text-xs py-1.5 px-3 outline-none"
                    id="login-btn"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="btn-primary text-xs py-1.5 px-4 outline-none"
                    id="signup-btn"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Hamburger — mobile */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="sm:hidden p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-slate-400 hover:text-white transition-all duration-200 outline-none"
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
              <form onSubmit={(e) => { e.preventDefault(); setSearchModalOpen(true); }} className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search news..."
                  readOnly
                  onClick={() => { setSearchModalOpen(true); setMobileOpen(false); }}
                  className="w-full bg-white/[0.06] border border-white/[0.1] text-sm text-slate-200 placeholder:text-slate-500 rounded-xl pl-9 pr-4 py-2 cursor-pointer outline-none focus:border-red-500/50"
                />
              </form>

              {/* Mobile Navigation Links */}
              <div className="flex flex-wrap gap-2.5 py-2 border-y border-white/[0.06]">
                <button
                  onClick={() => { router.push("/financial"); setMobileOpen(false); }}
                  className="px-3.5 py-1.5 bg-white/[0.04] border border-white/[0.08] hover:border-red-500/30 text-xs font-semibold rounded-lg text-slate-300"
                >
                  Financial Feed
                </button>
                <button
                  onClick={() => { router.push("/climate"); setMobileOpen(false); }}
                  className="px-3.5 py-1.5 bg-white/[0.04] border border-white/[0.08] hover:border-emerald-500/30 text-xs font-semibold rounded-lg text-slate-300"
                >
                  Climate Portal
                </button>
                <button
                  onClick={() => { router.push("/trending"); setMobileOpen(false); }}
                  className="px-3.5 py-1.5 bg-white/[0.04] border border-white/[0.08] text-xs font-semibold rounded-lg text-slate-300"
                >
                  Trending Topics
                </button>
                <button
                  onClick={() => { router.push("/alerts"); setMobileOpen(false); }}
                  className="px-3.5 py-1.5 bg-white/[0.04] border border-white/[0.08] text-xs font-semibold rounded-lg text-slate-300"
                >
                  Keyword Alerts
                </button>
                <button
                  onClick={() => { router.push("/history"); setMobileOpen(false); }}
                  className="px-3.5 py-1.5 bg-white/[0.04] border border-white/[0.08] text-xs font-semibold rounded-lg text-slate-300"
                >
                  Reading History
                </button>
              </div>

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
                
                {isAuthenticated ? (
                  <button
                    onClick={() => { router.push("/profile"); setMobileOpen(false); }}
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 text-white text-xs font-black shadow-lg shadow-red-500/10 flex items-center justify-center outline-none"
                  >
                    {initials}
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={handleLogin} className="btn-ghost text-xs py-1.5 px-3">Login</button>
                    <button onClick={handleSignUp} className="btn-primary text-xs py-1.5 px-3">Sign Up</button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </header>
  );
}
