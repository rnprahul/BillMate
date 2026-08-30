import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, rightElement, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-bold text-violet-200 uppercase tracking-wider mb-1.5">
            {label}
            {props.required && <span className="text-orange-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-violet-400 pointer-events-none shrink-0">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={twMerge(
              clsx(
                'w-full rounded-xl border bg-[#120e20] text-white px-3.5 py-2.5 text-xs transition-all placeholder:text-slate-500 focus:outline-none focus:ring-2',
                icon ? 'pl-9' : 'pl-3.5',
                rightElement ? 'pr-10' : 'pr-3.5',
                error
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-[#2d2448] focus:border-violet-500 focus:ring-violet-500/20 hover:border-[#3b2d5f]',
                className
              )
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 text-slate-400 shrink-0">
              {rightElement}
            </div>
          )}
        </div>
        {error ? (
          <p className="mt-1 text-xs text-rose-400 font-semibold">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
