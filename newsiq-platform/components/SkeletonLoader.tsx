"use client";

export function SkeletonCard() {
  return (
    <div className="glass-card overflow-hidden flex flex-col">
      {/* Thumbnail skeleton */}
      <div className="skeleton aspect-[16/9] w-full" />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Badges row */}
        <div className="flex gap-2">
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-20 rounded-full" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-3/4 rounded" />
        </div>

        {/* AI label */}
        <div className="skeleton h-3 w-24 rounded" />

        {/* Summary */}
        <div className="space-y-1.5">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-5/6 rounded" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="skeleton w-5 h-5 rounded-full" />
            <div className="skeleton h-3 w-24 rounded" />
          </div>
          <div className="flex gap-1.5">
            <div className="skeleton w-6 h-6 rounded-lg" />
            <div className="skeleton w-6 h-6 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="skeleton w-full rounded-2xl" style={{ minHeight: "420px" }}>
      <div className="h-full w-full flex flex-col justify-end p-8 sm:p-10 gap-4" style={{ minHeight: "420px" }}>
        <div className="flex gap-2">
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>
        <div className="skeleton h-10 w-3/4 rounded-lg" />
        <div className="skeleton h-6 w-1/2 rounded-lg" />
        <div className="skeleton h-8 w-40 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonSidebar() {
  return (
    <div className="glass-card p-5 space-y-4">
      <div className="skeleton h-6 w-32 rounded" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="skeleton w-6 h-6 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="skeleton h-3.5 w-full rounded" />
            <div className="skeleton h-3 w-2/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
