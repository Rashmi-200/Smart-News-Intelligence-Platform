"use client";

import { useState } from "react";
import { Zap, MessageCircle, Code2, Briefcase, Play, Mail, Sparkles } from "lucide-react";
import NewsletterModal from "@/components/NewsletterModal";

const footerLinks = {
  Platform: ["About Us", "How It Works", "AI Features", "Pricing"],
  News: ["Politics", "Business", "Technology", "Climate", "Sports"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "DMCA"],
  Support: ["Contact Us", "Help Center", "API Docs", "Advertise"],
};

const socials = [
  { icon: MessageCircle, label: "Twitter / X" },
  { icon: Code2, label: "GitHub" },
  { icon: Briefcase, label: "LinkedIn" },
  { icon: Play, label: "YouTube" },
  { icon: Mail, label: "Newsletter" },
];

export default function Footer() {
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  return (
    <>
      <NewsletterModal isOpen={newsletterOpen} onClose={() => setNewsletterOpen(false)} />
      <footer className="mt-20 border-t border-white/[0.07] bg-[#060c18]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-14">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/30">
                <Zap size={18} className="text-white fill-white" />
              </div>
              <span className="text-2xl font-black tracking-tight">
                News<span className="text-red-500">IQ</span>
              </span>
            </a>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-6">
              AI-powered news intelligence for the modern reader. Personalised,
              multilingual, and always ahead of the curve.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mb-6">
              {socials.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  onClick={() => label === "Newsletter" && setNewsletterOpen(true)}
                  className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-red-500/20 border border-white/[0.08] hover:border-red-500/30 flex items-center justify-center text-slate-400 hover:text-red-400 transition-all duration-200"
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>

            {/* Newsletter CTA */}
            <button
              onClick={() => setNewsletterOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500/15 to-orange-500/10 border border-red-500/20 text-red-300 hover:text-white hover:border-red-500/40 text-sm font-semibold transition-all duration-200 group"
              id="footer-subscribe-btn"
            >
              <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
              Subscribe to Newsletter
            </button>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-slate-500 hover:text-slate-200 text-sm transition-colors duration-150"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} NewsIQ Technologies Pvt Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
            <span className="text-slate-500 text-xs">All systems operational</span>
          </div>
        </div>
      </div>
      </footer>
    </>
  );
}
