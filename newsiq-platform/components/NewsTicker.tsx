"use client";

import { breakingHeadlines } from "@/lib/mockData";
import { Zap } from "lucide-react";

export default function NewsTicker() {
  const doubled = [...breakingHeadlines, ...breakingHeadlines];

  return (
    <div className="w-full bg-[#0d1526] border-b border-white/[0.06] overflow-hidden flex items-center h-10 select-none z-40">
      {/* BREAKING badge */}
      <div className="flex-shrink-0 flex items-center gap-1.5 bg-red-500 h-full px-4 z-10">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse-dot" />
        <Zap size={13} className="text-white fill-white" />
        <span className="text-white text-xs font-black tracking-widest uppercase">
          Breaking
        </span>
      </div>

      {/* Divider */}
      <div className="flex-shrink-0 w-px h-full bg-white/10" />

      {/* Scrolling text */}
      <div className="flex-1 overflow-hidden relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0d1526] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0d1526] to-transparent z-10 pointer-events-none" />

        <div className="flex animate-ticker whitespace-nowrap">
          {doubled.map((headline, i) => (
            <span key={i} className="inline-flex items-center">
              <span className="text-slate-200 text-sm px-2 hover:text-red-400 transition-colors cursor-pointer">
                {headline}
              </span>
              <span className="text-red-500/60 mx-3 text-base leading-none">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
