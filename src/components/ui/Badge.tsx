import React from 'react';
// 1. 'type' hata diya aur path ko correct kiya: ../../types/index
import type { Priority, TaskStatus } from '../../types/index';

// Discriminated Union pattern for perfect strict type narrowing
type BadgeProps =
  | { type: 'priority'; value: Priority; className?: string }
  | { type: 'status'; value: TaskStatus; className?: string };

// 2. Ab 'Priority' aur 'TaskStatus' bina kisi error ke exact keys mapping banayenge
const priorityStyles: Record<Priority, string> = {
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
  medium: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/60',
  high: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border-orange-200 dark:border-orange-900/60',
  critical: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-900',
};

const statusStyles: Record<TaskStatus, string> = {
  backlog: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  in_progress: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900/60',
  review: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-900/60',
  done: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
};

export const Badge: React.FC<BadgeProps> = (props) => {
  const { type, value, className = '' } = props;
  let colorClass: string;

  if (type === 'priority') {
    colorClass = priorityStyles[value];
  } else {
    colorClass = statusStyles[value];
  }

  const formatLabel = (val: string) => {
    return val
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide shadow-sm transition-colors duration-150 ${colorClass} ${className}`}
    >
      {formatLabel(value)}
    </span>
  );
};
