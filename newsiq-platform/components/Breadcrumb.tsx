"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap"
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-slate-300 transition-colors"
      >
        <Home size={12} />
        <span>Home</span>
      </Link>

      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={11} className="text-slate-700 flex-shrink-0" />
          {item.href && i < items.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-slate-300 transition-colors truncate max-w-[180px]"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className="text-slate-300 font-medium truncate max-w-[240px]"
              aria-current="page"
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
