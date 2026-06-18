"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Bell, Flame, ShieldAlert, Sparkles, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NotificationItem {
  id: string;
  type: "breaking" | "alert" | "digest" | "general";
  title: string;
  description: string;
  timeAgo: string;
  isUnread: boolean;
  createdAt: number;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange: (count: number) => void;
}

// Custom icons per notification type
export function NotificationIcon({ type, className }: { type: string; className?: string }) {
  if (type === "breaking") {
    return (
      <div className={cn("w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0", className)}>
        <Flame size={14} className="animate-pulse" />
      </div>
    );
  }
  if (type === "alert") {
    return (
      <div className={cn("w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0", className)}>
        <ShieldAlert size={14} />
      </div>
    );
  }
  if (type === "digest") {
    return (
      <div className={cn("w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0", className)}>
        <Sparkles size={14} />
      </div>
    );
  }
  return (
    <div className={cn("w-7 h-7 rounded-lg bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400 flex-shrink-0", className)}>
      <Bell size={14} />
    </div>
  );
}

export default function NotificationDropdown({ isOpen, onClose, onUnreadCountChange }: NotificationDropdownProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const loadNotifications = () => {
      const stored = localStorage.getItem("newsiq_notifications");
      if (stored) {
        const parsed = JSON.parse(stored) as NotificationItem[];
        setNotifications(parsed);
        const unreadCount = parsed.filter((n) => n.isUnread).length;
        onUnreadCountChange(unreadCount);
      } else {
        // Seed default notifications
        const defaults: NotificationItem[] = [
          {
            id: "n1",
            type: "breaking",
            title: "Breaking News: El Niño Crisis",
            description: "South Asia faces worst drought in decades as temperature records shatter across the Indian Ocean.",
            timeAgo: "2h ago",
            isUnread: true,
            createdAt: Date.now() - 2 * 60 * 60 * 1000,
          },
          {
            id: "n2",
            type: "alert",
            title: "Keyword Alert: 'IMF loan'",
            description: "IMF delegation concludes Sri Lanka review mission. Commends macroeconomic policies.",
            timeAgo: "4h ago",
            isUnread: true,
            createdAt: Date.now() - 4 * 60 * 60 * 1000,
          },
          {
            id: "n3",
            type: "digest",
            title: "Your Morning News Digest",
            description: "Read your customized briefing on Colombo elections, inflation ratings, and cricket news.",
            timeAgo: "6h ago",
            isUnread: false,
            createdAt: Date.now() - 6 * 60 * 60 * 1000,
          },
          {
            id: "n4",
            type: "breaking",
            title: "Cabinet Reshuffle Colombo",
            description: "President signs off on crucial cabinet adjustments targeting agricultural portfolio revamp.",
            timeAgo: "1d ago",
            isUnread: false,
            createdAt: Date.now() - 24 * 60 * 60 * 1000,
          },
          {
            id: "n5",
            type: "general",
            title: "Welcome to NewsIQ",
            description: "Create alerts, save bookmark logs, and monitor stock tickers from your profile.",
            timeAgo: "3d ago",
            isUnread: false,
            createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
          },
        ];
        setNotifications(defaults);
        localStorage.setItem("newsiq_notifications", JSON.stringify(defaults));
        onUnreadCountChange(2);
      }
    };

    loadNotifications();
    
    // Listen for cross-page notifications update
    window.addEventListener("newsiq_notifications_updated", loadNotifications);
    return () => {
      window.removeEventListener("newsiq_notifications_updated", loadNotifications);
    };
  }, [onUnreadCountChange]);

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, isUnread: false }));
    setNotifications(updated);
    localStorage.setItem("newsiq_notifications", JSON.stringify(updated));
    onUnreadCountChange(0);
    // Dispatch custom event
    window.dispatchEvent(new Event("newsiq_notifications_updated"));
  };

  const handleNotificationClick = (n: NotificationItem) => {
    // Mark as read
    const updated = notifications.map((item) =>
      item.id === n.id ? { ...item, isUnread: false } : item
    );
    setNotifications(updated);
    localStorage.setItem("newsiq_notifications", JSON.stringify(updated));
    onUnreadCountChange(updated.filter((item) => item.isUnread).length);
    window.dispatchEvent(new Event("newsiq_notifications_updated"));
    
    onClose();

    // Navigate based on type
    if (n.type === "breaking") {
      router.push("/article/4"); // Link to a mock breaking article
    } else if (n.type === "alert") {
      router.push("/alerts");
    } else {
      router.push("/notifications");
    }
  };

  const recent = notifications.slice(0, 5);
  const unreadCount = notifications.filter((n) => n.isUnread).length;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.96 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="absolute right-0 top-full mt-2 w-[340px] bg-[#0b1222] border border-white/[0.08] shadow-2xl rounded-2xl overflow-hidden z-50 p-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-white font-bold text-xs uppercase tracking-wider">
              Notifications
            </span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[10px] text-red-400 hover:text-red-300 font-bold flex items-center gap-0.5 transition-colors"
            >
              <Check size={10} /> Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-0.5 scrollbar-hide">
          {recent.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              No recent notifications.
            </div>
          ) : (
            recent.map((n) => (
              <button
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={cn(
                  "w-full flex items-start gap-3 p-2 rounded-xl text-left border border-transparent hover:bg-white/[0.03] hover:border-white/[0.04] transition-all relative group",
                  n.isUnread && "bg-white/[0.01]"
                )}
              >
                <NotificationIcon type={n.type} />
                <div className="flex-1 min-w-0 pr-2">
                  <p className={cn(
                    "text-xs leading-snug truncate group-hover:text-red-400 transition-colors",
                    n.isUnread ? "text-white font-bold" : "text-slate-300 font-medium"
                  )}>
                    {n.title}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    {n.description}
                  </p>
                  <span className="text-[9px] text-slate-500 block mt-1">
                    {n.timeAgo}
                  </span>
                </div>
                {n.isUnread && (
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0 mt-2" />
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/[0.06] mt-3 text-center">
          <button
            onClick={() => {
              onClose();
              router.push("/notifications");
            }}
            className="text-[10px] text-slate-400 hover:text-white font-bold flex items-center justify-center gap-1 mx-auto transition-colors"
          >
            View all notifications <ArrowRight size={10} />
          </button>
        </div>
      </motion.div>
    </>
  );
}
