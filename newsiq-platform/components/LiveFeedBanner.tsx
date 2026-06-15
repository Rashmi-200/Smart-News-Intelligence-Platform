"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, X } from "lucide-react";

interface Props {
  onRefresh: () => void;
  newArticleCount?: number;
  delaySeconds?: number;
}

export default function LiveFeedBanner({
  onRefresh,
  newArticleCount = 5,
  delaySeconds = 30,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const showTimer = setTimeout(() => setVisible(true), delaySeconds * 1000);
    return () => clearTimeout(showTimer);
  }, [delaySeconds, dismissed]);

  // Auto-dismiss after 10 seconds of showing
  useEffect(() => {
    if (!visible) return;
    const dismissTimer = setTimeout(() => {
      setVisible(false);
      setDismissed(true);
    }, 10000);
    return () => clearTimeout(dismissTimer);
  }, [visible]);

  const handleRefresh = () => {
    setVisible(false);
    setDismissed(true);
    onRefresh();
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="fixed top-[68px] left-1/2 -translate-x-1/2 z-50 w-full max-w-sm mx-4"
          id="live-feed-banner"
        >
          <div className="mx-4 flex items-center gap-3 px-4 py-3 rounded-full bg-[#0d1b2a]/95 border border-red-500/30 shadow-2xl shadow-red-500/10 backdrop-blur-md">
            {/* Pulsing dot */}
            <div className="relative flex-shrink-0">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full block" />
              <span className="absolute inset-0 w-2.5 h-2.5 bg-red-500/50 rounded-full animate-ping" />
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-white text-sm font-medium">
                <span className="text-red-400 font-bold">{newArticleCount} new </span>
                articles available
              </span>
            </div>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-all duration-200 flex-shrink-0"
              id="live-feed-refresh-btn"
            >
              <RefreshCw size={11} />
              Refresh
            </button>

            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-slate-500 hover:text-white transition-colors"
              id="live-feed-dismiss-btn"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
