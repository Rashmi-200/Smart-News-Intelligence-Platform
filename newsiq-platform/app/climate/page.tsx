"use client";

import { useState, useEffect } from "react";
import { CloudRain, Wind, Thermometer, Droplets, Sun, Leaf, ShieldAlert } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import NewsCard from "@/components/NewsCard";
import { newsArticles } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface ClimateAlert {
  id: string;
  region: string;
  severity: "extreme" | "severe" | "moderate";
  alertText: string;
  time: string;
}

const CLIMATE_ALERTS: ClimateAlert[] = [
  { id: "ca1", region: "South-West Coast", severity: "severe", alertText: "Active monsoon rainfall warning. Flash floods possible in low-lying catchments.", time: "1h ago" },
  { id: "ca2", region: "North-Central Province", severity: "moderate", alertText: "Temperature levels expected to exceed 38°C. Stay hydrated and avoid outdoor labor.", time: "3h ago" },
  { id: "ca3", region: "Western Province", severity: "moderate", alertText: "Air Quality Index (AQI) elevated near industrial zones. Sensitive groups exercise caution.", time: "6h ago" },
];

interface AQIItem {
  city: string;
  value: number;
  status: "Good" | "Moderate" | "Poor" | "Hazardous";
  colorClass: string;
}

const REGIONAL_AQI: AQIItem[] = [
  { city: "Colombo", value: 58, status: "Moderate", colorClass: "text-amber-400 bg-amber-450/10 border-amber-500/20" },
  { city: "Kandy", value: 42, status: "Good", colorClass: "text-emerald-400 bg-emerald-450/10 border-emerald-500/20" },
  { city: "Jaffna", value: 76, status: "Moderate", colorClass: "text-amber-400 bg-amber-450/10 border-amber-500/20" },
  { city: "Galle", value: 31, status: "Good", colorClass: "text-emerald-400 bg-emerald-450/10 border-emerald-500/20" },
  { city: "Trincomalee", value: 89, status: "Poor", colorClass: "text-orange-400 bg-orange-450/10 border-orange-500/20" },
];

export default function ClimatePage() {
  const [activeRegion, setActiveRegion] = useState("Colombo");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Filter articles matching Climate category
  const climateArticles = newsArticles.filter((a) => a.category === "Climate");

  return (
    <div className="min-h-screen flex flex-col bg-[#060c18] text-slate-100">
      <Navbar activeCategory="Climate" onCategoryChange={() => {}} />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={[{ label: "Climate Intelligence & Weather Alerts" }]} />
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4 pb-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
              <Leaf size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl font-black">Climate & Environment Monitor</h1>
              <p className="text-slate-500 text-xs mt-0.5">
                Dynamic air quality index monitors, meteorological rainfall watches, and climate headlines.
              </p>
            </div>
          </div>
          <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 select-none">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            Live Meteorological Feeds
          </div>
        </div>

        {/* Climate Alerts Warnings Marquee/Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Weather & AQI Indicators Widget (Left 2/3) */}
          <div className="lg:col-span-2 bg-[#0b1222]/40 border border-white/[0.06] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <span className="text-white font-bold text-sm flex items-center gap-2">
                <Sun className="text-emerald-400 animate-spin-slow" size={16} /> Regional Weather & Environmental Indicators
              </span>
              <select
                value={activeRegion}
                onChange={(e) => setActiveRegion(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-slate-400 text-xs font-semibold focus:outline-none focus:border-emerald-500/40 cursor-pointer"
              >
                <option value="Colombo" className="bg-[#0b1222] text-slate-200">Colombo District</option>
                <option value="Kandy" className="bg-[#0b1222] text-slate-200">Kandy District</option>
                <option value="Jaffna" className="bg-[#0b1222] text-slate-200">Jaffna District</option>
                <option value="Galle" className="bg-[#0b1222] text-slate-200">Galle District</option>
              </select>
            </div>

            {/* Indicator Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {/* Temperature */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Temperature</span>
                  <Thermometer size={14} className="text-emerald-400" />
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-white">31.4°C</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">RealFeel 34.0°C</span>
                </div>
              </div>

              {/* Air Quality (AQI) */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Air Quality</span>
                  <Wind size={14} className="text-emerald-400" />
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-white">58 AQI</span>
                  <span className="text-[9px] uppercase font-bold text-amber-400 mt-0.5 block">Moderate</span>
                </div>
              </div>

              {/* Precipitation */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Precipitation</span>
                  <CloudRain size={14} className="text-emerald-400" />
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-white">74%</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Light Rain Expected</span>
                </div>
              </div>

              {/* Humidity */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Humidity</span>
                  <Droplets size={14} className="text-emerald-400" />
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-white">82%</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Westerly winds</span>
                </div>
              </div>
            </div>

            {/* Precipitation Graph Representation */}
            <div className="h-28 w-full bg-[#060c18]/50 border border-white/[0.04] rounded-xl p-4 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Precipitation forecast (Next 5 Hours)</span>
              <div className="flex items-end justify-between h-12 w-full gap-2.5 mt-2">
                {[20, 40, 75, 80, 50].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-md"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[9px] text-slate-500 font-bold">{i + 1} PM</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Warnings & AQI Ranks (Right 1/3) */}
          <div className="space-y-6">
            
            {/* Meteorological Warnings */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 shadow-xl">
              <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-4">
                <ShieldAlert className="text-red-500" size={16} /> Regional Climate Warnings
              </h3>
              <div className="space-y-3">
                {CLIMATE_ALERTS.map((alert) => (
                  <div key={alert.id} className="p-3 bg-red-950/20 border border-red-500/15 rounded-xl">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-red-400 font-bold text-xs">{alert.region}</span>
                      <span className="text-[9px] text-slate-500">{alert.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{alert.alertText}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AQI Ranks */}
            <div className="bg-[#0b1222]/40 border border-white/[0.06] rounded-2xl p-5 shadow-xl">
              <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-4">
                <Wind className="text-emerald-400" size={16} /> Air Quality Rankings
              </h3>
              <div className="space-y-3">
                {REGIONAL_AQI.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-white/[0.04] pb-2 last:border-0 last:pb-0">
                    <span className="text-slate-300 text-xs font-semibold">{item.city}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs font-black">{item.value} AQI</span>
                      <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-bold border", item.colorClass)}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Aggregated Climate Articles */}
        <h2 className="text-lg font-black text-white mb-6 flex items-center gap-2">
          <Leaf size={18} className="text-emerald-500" /> Climate Change & Sustainability News
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {climateArticles.map((article, i) => (
            <NewsCard key={article.id} article={article as any} index={i} onBookmark={() => {}} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
