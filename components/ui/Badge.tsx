import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  variant?: 'emerald' | 'orange' | 'violet' | 'purple' | 'slate' | 'rose' | 'amber';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export function Badge({ variant = 'violet', children, className, size = 'md' }: BadgeProps) {
  const variantStyles = {
    emerald: 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60 shadow-sm shadow-emerald-950',
    orange: 'bg-orange-950/70 text-orange-300 border-orange-700/60 shadow-sm shadow-orange-950',
    amber: 'bg-amber-950/70 text-amber-300 border-amber-700/60 shadow-sm shadow-amber-950',
    violet: 'bg-violet-950/70 text-violet-300 border-violet-700/60 shadow-sm shadow-violet-950',
    purple: 'bg-purple-950/70 text-purple-300 border-purple-700/60 shadow-sm shadow-purple-950',
    slate: 'bg-[#1a1429] text-slate-300 border-[#3b2d5f]',
    rose: 'bg-rose-950/70 text-rose-300 border-rose-700/60 shadow-sm shadow-rose-950',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-bold',
    md: 'text-xs px-2.5 py-1 font-bold',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1 rounded-full border tracking-wider uppercase',
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
    >
      {children}
    </span>
  );
}
