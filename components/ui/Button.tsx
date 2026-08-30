import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  icon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#09070f] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-purple-900/30 focus:ring-violet-500 border border-violet-500/40',
    accent: 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-lg shadow-orange-950/40 focus:ring-orange-500 border border-orange-500/40',
    secondary: 'bg-[#181329] hover:bg-[#231b3c] text-violet-200 hover:text-white focus:ring-violet-400 border border-[#3b2d5f]',
    outline: 'bg-transparent hover:bg-[#181329] text-slate-200 border border-[#3b2d5f] hover:border-violet-500 focus:ring-violet-400',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-950/40 focus:ring-rose-500 border border-rose-500/30',
    ghost: 'bg-transparent hover:bg-[#181329] text-slate-300 hover:text-white focus:ring-violet-400 border border-transparent',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs px-4 py-2 gap-2 uppercase tracking-wider',
    lg: 'text-sm px-5 py-2.5 gap-2.5',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variantStyles[variant], sizeStyles[size], className))}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
