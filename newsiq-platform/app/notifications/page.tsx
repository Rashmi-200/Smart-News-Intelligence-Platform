"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Trash2, CheckCircle2, Sliders, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { NotificationItem, NotificationIcon } from "@/components/NotificationDropdown";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type FilterType = "all" | "unread" | "read";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [mounted, setMounted] = useState(false);

  const loadNotifications = () => {
    const stored = localStorage.getItem("newsiq_notifications");
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
  };

  useEffect(() => {
    setMounted(true);
    loadNotifications();

    // Sync with other pages
    window.addEventListener("newsiq_notifications_updated", loadNotifications);
    return () => {
      window.removeEventListener("newsiq_notifications_updated", loadNotifications);
    };
  }, []);

  if (!mounted) return null;

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return n.isUnread;
    if (filter === "read") return !n.isUnread;
    return true;
  });

  const saveNotifications = (updated: NotificationItem[]) => {
    setNotifications(updated);
    localStorage.setItem("newsiq_notifications", JSON.stringify(updated));
    window.dispatchEvent(new Event("newsiq_notifications_updated"));
  };

  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, isUnread: false } : n
    );
    saveNotifications(updated);
    toast.success("Marked as read");
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, isUnread: false }));
    saveNotifications(updated);
    toast.success("All notifications marked as read");
  };

  const handleDelete = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifications(updated);
    toast.success("Notification deleted");
  };

  const handleDeleteAll = () => {
    const confirm = window.confirm("Are you sure you want to clear all notifications?");
    if (confirm) {
      saveNotifications([]);
      toast.success("All notifications deleted");
    }
  };

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#060c18] text-slate-100">
      <Navbar activeCategory="All" onCategoryChange={() => {}} />

      <main className="flex-1 max-w-[900px] mx-auto w-full px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={[{ label: "Notifications" }]} />
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/[0.06] pb-5 mb-6">
          <div>
            <h1 className="text-white text-3xl font-black flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Bell size={20} className="text-red-400" />
              </span>
              Notifications Center
            </h1>
            <p className="text-slate-500 text-sm mt-1 ml-[52px]">
              You have {unreadCount} unread alert{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:border-red-500/20 hover:bg-white/[0.05] text-slate-400 hover:text-white text-xs font-semibold transition-all duration-200 outline-none"
              >
                <Check size={12} className="text-red-500" />
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:border-red-500/20 hover:bg-red-500/10 text-slate-400 hover:text-red-400 text-xs font-semibold transition-all duration-200 outline-none"
              >
                <Trash2 size={12} />
                Delete All
              </button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {notifications.length > 0 && (
          <div className="flex items-center gap-2 mb-6">
            <Sliders size={12} className="text-slate-500" />
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mr-2">Filter:</span>
            <div className="flex gap-1">
              {(["all", "unread", "read"] as FilterType[]).map((f) => {
                const count = f === "all" 
                  ? notifications.length 
                  : f === "unread" 
                    ? unreadCount 
                    : notifications.length - unreadCount;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold capitalize transition-all outline-none",
                      filter === f
                        ? "bg-red-500 text-white shadow-md shadow-red-500/10"
                        : "bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white"
                    )}
                  >
                    {f} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Content list */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 border border-dashed border-white/[0.08] rounded-2xl bg-[#0b1222]/20"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4 text-slate-500 mx-auto">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-slate-300 font-bold mb-2">Clear inbox!</h3>
                <p className="text-slate-500 text-xs max-w-sm mb-6 leading-relaxed mx-auto">
                  No notifications matched the &quot;{filter}&quot; filter. Keep on reading to receive real-time keyword alerts.
                </p>
              </motion.div>
            ) : (
              filtered.map((n, idx) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.04 }}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 bg-[#0b1222]/20 relative group",
                    n.isUnread ? "border-red-500/15" : "border-white/[0.05] opacity-75"
                  )}
                >
                  <NotificationIcon type={n.type} className="w-9 h-9" />

                  <div className="flex-1 min-w-0 pr-8">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={cn(
                        "text-sm font-semibold leading-snug",
                        n.isUnread ? "text-white" : "text-slate-300"
                      )}>
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-slate-500">{n.timeAgo}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {n.description}
                    </p>

                    {/* Quick actions for unread */}
                    {n.isUnread && (
                      <button
                        onClick={() => handleMarkAsRead(n.id)}
                        className="mt-2.5 text-[10px] text-red-400 hover:text-red-300 font-bold flex items-center gap-0.5 outline-none"
                      >
                        <Check size={10} /> Mark as read
                      </button>
                    )}
                  </div>

                  {/* Delete button (Right) */}
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="absolute right-3.5 top-3.5 p-2 bg-white/[0.02] border border-white/[0.06] hover:border-red-500/30 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-colors outline-none opacity-0 group-hover:opacity-100"
                    aria-label={`Delete notification ${n.title}`}
                  >
                    <Trash2 size={12} />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
