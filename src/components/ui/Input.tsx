import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    
    return (
      <div className="w-full flex flex-col gap-1.5 mb-4">
        <label htmlFor={inputId} className="text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={`w-full px-3 py-2 text-base rounded-md border bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 transition-all duration-200 outline-none
            ${error 
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
              : 'border-gray-300 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
            } ${className}`}
          {...props}
        />
        {/* ULTRA FIX: !important inline style aur !text-red-500 dono ka combine injection */}
        {error && (
          <p 
            className="!text-red-500 font-semibold italic mt-1 flex items-center gap-1"
            style={{ color: '#FF3333 !important', fontStyle: 'italic !important' }}
          >
            <span style={{ color: '#FF3333 !important' }}>⚠️</span> {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';


