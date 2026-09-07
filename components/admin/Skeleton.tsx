import React from 'react';

export function SkeletonLine({ className = '', width = 'w-full' }: { className?: string; width?: string }) {
  return (
    <div className={`h-4 bg-neutral-200 animate-pulse rounded ${width} ${className}`} />
  );
}

export function SkeletonStat({ count = 4 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${count} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-[#e6dfd5] p-5 animate-pulse space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-3 w-20 bg-neutral-200 rounded" />
            <div className="h-6 w-6 bg-neutral-100 rounded-full" />
          </div>
          <div className="h-7 w-16 bg-neutral-200 rounded" />
          <div className="h-2.5 w-32 bg-neutral-100 rounded" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white border border-[#e6dfd5] overflow-hidden">
      {/* Header */}
      <div className="border-b border-[#141414] bg-[#faf8f5] p-3.5 flex justify-between gap-4 animate-pulse">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-3 bg-neutral-200 rounded w-20" />
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-[#e6dfd5]">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="p-4 flex items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3 w-1/3">
              <div className="w-10 h-10 bg-neutral-200 rounded shrink-0" />
              <div className="space-y-1.5 w-full">
                <div className="h-3.5 bg-neutral-200 rounded w-3/4" />
                <div className="h-2.5 bg-neutral-100 rounded w-1/2" />
              </div>
            </div>
            {Array.from({ length: columns - 2 }).map((_, colIdx) => (
              <div key={colIdx} className="h-3 bg-neutral-200 rounded w-20" />
            ))}
            <div className="h-7 bg-neutral-200 rounded w-16 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonCard({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-[#e6dfd5] animate-pulse overflow-hidden flex flex-col">
          <div className="aspect-[16/10] bg-neutral-200 w-full" />
          <div className="p-4 space-y-3 flex-1">
            <div className="h-2.5 w-20 bg-neutral-200 rounded" />
            <div className="h-4 w-5/6 bg-neutral-200 rounded" />
            <div className="h-3 w-full bg-neutral-100 rounded" />
            <div className="h-3 w-2/3 bg-neutral-100 rounded" />
            <div className="pt-3 border-t border-neutral-100 flex justify-between">
              <div className="h-3 w-24 bg-neutral-200 rounded" />
              <div className="h-3 w-12 bg-neutral-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div className="bg-white border border-[#e6dfd5] p-6 space-y-5 animate-pulse">
      <div className="h-5 w-44 bg-neutral-200 rounded" />
      <div className="space-y-2">
        <div className="h-3 w-24 bg-neutral-200 rounded" />
        <div className="h-10 bg-neutral-100 rounded w-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-neutral-200 rounded" />
          <div className="h-10 bg-neutral-100 rounded w-full" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-24 bg-neutral-200 rounded" />
          <div className="h-10 bg-neutral-100 rounded w-full" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-28 bg-neutral-200 rounded" />
        <div className="h-28 bg-neutral-100 rounded w-full" />
      </div>
      <div className="pt-3 flex justify-end gap-3">
        <div className="h-9 w-24 bg-neutral-200 rounded" />
        <div className="h-9 w-32 bg-[#0b4627]/30 rounded" />
      </div>
    </div>
  );
}
