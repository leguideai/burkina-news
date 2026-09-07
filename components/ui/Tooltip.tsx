"use client";

import React, { ReactNode } from 'react';

interface TooltipProps {
  content: string | ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  delay?: boolean;
}

export default function Tooltip({
  content,
  children,
  position = 'top',
  className = '',
  delay = false,
}: TooltipProps) {
  if (!content) return <>{children}</>;

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[#18181b] border-x-transparent border-b-transparent border-t-4 border-x-4 border-b-0',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#18181b] border-x-transparent border-t-transparent border-b-4 border-x-4 border-t-0',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[#18181b] border-y-transparent border-r-transparent border-l-4 border-y-4 border-r-0',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[#18181b] border-y-transparent border-l-transparent border-r-4 border-y-4 border-l-0',
  };

  return (
    <div className={`relative inline-flex items-center group cursor-pointer ${className}`}>
      {children}
      <div
        role="tooltip"
        className={`pointer-events-none absolute z-50 whitespace-nowrap rounded bg-[#18181b] px-2 py-1 text-[11px] font-sans font-medium text-white shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 select-none ${
          delay ? 'delay-200' : ''
        } ${positionClasses[position]}`}
      >
        {content}
        <span
          className={`absolute w-0 h-0 border-solid ${arrowClasses[position]}`}
        />
      </div>
    </div>
  );
}
