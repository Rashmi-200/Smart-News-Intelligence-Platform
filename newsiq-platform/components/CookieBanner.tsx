"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X } from "lucide-react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("newsiq_cookie_consent");
    if (!consent) {
      // Delay showing it for visual entry polish
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("newsiq_cookie_consent", "accepted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("newsiq_cookie_consent", "declined");
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-5 left-4 right-4 md:left-auto md:right-5 md:max-w-md z-[90] bg-[#0b1222]/95 backdrop-blur-md border border-white/[0.08] p-5 rounded-2xl shadow-2xl flex flex-col gap-3.5"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-500 flex-shrink-0">
              <Info size={16} />
            </div>
            <div className="flex-1">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-1">
                We Value Your Privacy
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                NewsIQ uses cookies to customise your reading interest feed, remember your language, track live read sessions, and compile anonymous platform analytics. Learn more in our{" "}
                <a href="/privacy" className="text-red-400 hover:text-red-300 font-medium underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
            <button
              onClick={handleDecline}
              className="text-slate-500 hover:text-slate-300 p-1"
              aria-label="Close cookie consent banner"
            >
              <X size={14} />
            </button>
          </div>
          <div className="flex items-center justify-end gap-2.5">
            <button
              onClick={handleDecline}
              className="px-3 py-1.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.04] text-slate-400 hover:text-white text-xs font-semibold transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold shadow-lg shadow-red-500/20 transition-all"
            >
              Accept Cookies
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
