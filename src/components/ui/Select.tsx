import type { SelectHTMLAttributes } from 'react';

export interface SelectOption<T extends string | number> {
  value: T;
  label: string;
}

// Omit standard value to avoid generic type conflicts
interface SelectProps<T extends string | number> extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value'> {
  label?: string;
  options: SelectOption<T>[];
  error?: string;
  value?: T;
}

export const Select = <T extends string | number>({
  label,
  options,
  error,
  className = '',
  id,
  value,
  ...props
}: SelectProps<T>) => {
  return (
    <div className="w-full flex flex-col gap-1.5 mb-4">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <select
        id={id}
        value={value}
        className={`w-full px-3 py-2 text-base rounded-md border bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer appearance-none
          ${error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
            : 'border-gray-300 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
          } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={String(option.value)} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-xs font-medium text-red-500 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};
