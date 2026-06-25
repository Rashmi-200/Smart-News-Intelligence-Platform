"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, RefreshCw, BarChart3, LineChart, Globe, Briefcase } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import NewsCard from "@/components/NewsCard";
import { newsArticles } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TickerItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
}

const TICKERS: TickerItem[] = [
  { symbol: "CSE ASPI", name: "Colombo Stock Exchange", price: "12,342.10", change: "+0.45%", isPositive: true },
  { symbol: "USD/LKR", name: "US Dollar / Sri Lankan Rupee", price: "296.50", change: "-0.15%", isPositive: false },
  { symbol: "GBP/LKR", name: "British Pound / Sri Lankan Rupee", price: "376.12", change: "+0.25%", isPositive: true },
  { symbol: "Brent Crude", name: "Brent Crude Oil", price: "$82.45", change: "-1.10%", isPositive: false },
  { symbol: "Gold", name: "Gold Spot per oz", price: "$2,312.80", change: "+0.80%", isPositive: true },
  { symbol: "Tea (Avg)", name: "Sri Lanka Tea Auction Avg", price: "LKR 1,180.00", change: "+1.25%", isPositive: true },
];

const MARKET_SECTOR_DATA = {
  Equities: [
    { name: "John Keells Holdings (JKH)", price: "LKR 198.50", change: "+1.28%", isPositive: true },
    { name: "Commercial Bank (COMB)", price: "LKR 94.20", change: "-0.42%", isPositive: false },
    { name: "Hayleys PLC (HAYL)", price: "LKR 86.80", change: "+0.93%", isPositive: true },
    { name: "LOLC Holdings (LOLC)", price: "LKR 382.00", change: "+2.14%", isPositive: true },
    { name: "Sampath Bank (SAMP)", price: "LKR 78.50", change: "-0.63%", isPositive: false },
  ],
  Forex: [
    { name: "USD/LKR (US Dollar)", price: "LKR 296.50", change: "-0.15%", isPositive: false },
    { name: "EUR/LKR (Euro)", price: "LKR 321.20", change: "+0.18%", isPositive: true },
    { name: "GBP/LKR (British Pound)", price: "LKR 376.12", change: "+0.25%", isPositive: true },
    { name: "JPY/LKR (100 Yen)", price: "LKR 189.40", change: "-0.34%", isPositive: false },
    { name: "AED/LKR (UAE Dirham)", price: "LKR 80.72", change: "-0.12%", isPositive: false },
  ],
  Commodities: [
    { name: "Tea (High Grown) per kg", price: "LKR 1,220.00", change: "+1.50%", isPositive: true },
    { name: "Tea (Low Grown) per kg", price: "LKR 1,140.00", change: "+0.88%", isPositive: true },
    { name: "Rubber (RSS1) per kg", price: "LKR 720.00", change: "-1.80%", isPositive: false },
    { name: "Coconut Oil per mt", price: "LKR 685,000", change: "+0.45%", isPositive: true },
    { name: "Brent Crude Oil (bbl)", price: "$82.45", change: "-1.10%", isPositive: false },
  ],
};

const CHART_TIMESCALES = ["1D", "1W", "1M", "1Y"];

export default function FinancialDashboard() {
  const [timescale, setTimescale] = useState("1W");
  const [selectedSector, setSelectedSector] = useState<"Equities" | "Forex" | "Commodities">("Equities");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Filter articles matching Business category
  const financialArticles = newsArticles.filter((a) => a.category === "Business");

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success("Market feeds updated successfully");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060c18] text-slate-100">
      <Navbar activeCategory="Business" onCategoryChange={() => {}} />

      {/* Ticker marquee */}
      <div className="w-full bg-[#0b1222] border-b border-white/[0.06] py-2 overflow-hidden select-none">
        <div className="flex animate-marquee whitespace-nowrap gap-10 items-center">
          {TICKERS.concat(TICKERS).map((t, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider">{t.symbol}</span>
              <span className="text-white font-black">{t.price}</span>
              <span className={cn(
                "flex items-center gap-0.5 font-bold",
                t.isPositive ? "text-emerald-400" : "text-red-400"
              )}>
                {t.isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {t.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={[{ label: "Financial Portal & Live Tickers" }]} />
        </div>

        {/* Header section */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4 pb-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/20 flex-shrink-0">
              <Briefcase size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl font-black">Macro & Financial Intelligence</h1>
              <p className="text-slate-500 text-xs mt-0.5">
                Real-time Colombo Stock Exchange indices, commodity tracking, and business feeds.
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.12] text-slate-300 hover:text-white text-xs font-semibold transition-all duration-200 outline-none"
          >
            <RefreshCw size={13} className={cn(isRefreshing && "animate-spin")} />
            Update Feed
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Chart Panel (Left 2/3) */}
          <div className="lg:col-span-2 bg-[#0b1222]/40 border border-white/[0.06] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <LineChart size={16} className="text-red-500" />
                <span className="text-white font-bold text-sm">CSE ASPI Performance</span>
              </div>
              <div className="flex bg-[#060c18] border border-white/[0.08] rounded-lg p-0.5">
                {CHART_TIMESCALES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimescale(t)}
                    className={cn(
                      "px-2.5 py-1 rounded text-[10px] font-bold transition-all outline-none",
                      timescale === t
                        ? "bg-red-500 text-white"
                        : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Chart Visualized via Premium SVG */}
            <div className="relative h-64 w-full bg-[#060c18]/40 border border-white/[0.04] rounded-xl overflow-hidden mb-6 flex items-center justify-center">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-40">
                <div className="w-full border-t border-white/[0.04]" />
                <div className="w-full border-t border-white/[0.04]" />
                <div className="w-full border-t border-white/[0.04]" />
                <div className="w-full border-t border-white/[0.04]" />
              </div>

              {/* Chart Line path */}
              <svg className="w-full h-full p-4 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area filled gradient */}
                <path
                  d="M0,80 Q20,70 40,50 T80,30 T100,20 L100,100 L0,100 Z"
                  fill="url(#chartGradient)"
                />
                {/* Stroked trend path */}
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  d="M0,80 Q20,70 40,50 T80,30 T100,20"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Dynamic Marker dots */}
                <circle cx="0" cy="80" r="2" fill="#ef4444" />
                <circle cx="40" cy="50" r="2.5" fill="#ef4444" />
                <circle cx="100" cy="20" r="3" fill="#ef4444" className="animate-pulse" />
              </svg>

              {/* Hover indicator tooltip mock */}
              <div className="absolute top-8 right-8 bg-[#0b1222]/90 border border-white/[0.08] p-2 rounded-lg text-[10px] text-slate-400 shadow-xl pointer-events-none">
                <span className="text-white font-bold block">12,342.10 LKR</span>
                <span>ASPI Index (Peak Value)</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-slate-500 text-[10px] font-semibold">
              <span>Mon 10th</span>
              <span>Wed 12th</span>
              <span>Fri 14th</span>
              <span>Today (16th)</span>
            </div>
          </div>

          {/* Market Sectors Panel (Right 1/3) */}
          <div className="bg-[#0b1222]/40 border border-white/[0.06] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={16} className="text-red-500" />
                <span className="text-white font-bold text-sm">Market Sectors</span>
              </div>

              {/* Selector Tabs */}
              <div className="flex bg-[#060c18] border border-white/[0.08] rounded-xl p-0.5 mb-5">
                {(["Equities", "Forex", "Commodities"] as const).map((sector) => (
                  <button
                    key={sector}
                    onClick={() => setSelectedSector(sector)}
                    className={cn(
                      "flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all outline-none",
                      selectedSector === sector
                        ? "bg-red-500 text-white"
                        : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    {sector}
                  </button>
                ))}
              </div>

              {/* Rates items */}
              <div className="space-y-3.5">
                {MARKET_SECTOR_DATA[selectedSector].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-white/[0.04] pb-2 last:border-0 last:pb-0">
                    <div>
                      <span className="text-slate-300 text-xs font-bold block">{item.name}</span>
                      <span className="text-[10px] text-slate-500">Sri Lanka Markets</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white text-xs font-black block">{item.price}</span>
                      <span className={cn(
                        "text-[10px] font-bold flex items-center justify-end gap-0.5",
                        item.isPositive ? "text-emerald-400" : "text-red-400"
                      )}>
                        {item.isPositive ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                        {item.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/[0.06] text-center">
              <span className="text-[9px] text-slate-500">Quotes are delayed by 15 minutes. Source: CSE & CBSL.</span>
            </div>
          </div>
        </div>

        {/* Business and Economy News stream */}
        <h2 className="text-lg font-black text-white mb-6 flex items-center gap-2">
          <Globe size={18} className="text-red-500" /> Latest Business & Economy Headlines
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {financialArticles.map((article, i) => (
            <NewsCard key={article.id} article={article} index={i} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
