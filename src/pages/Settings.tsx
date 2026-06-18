import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Display Settings</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Configure your application interfaces and workspace preferences.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-md space-y-6">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-slate-800/60">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Interface Theme</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Switch between standard clean lighting canvas or dark mode backgrounds.</p>
          </div>
          <Button 
            variant="primary" 
            onClick={toggleTheme}
            className="capitalize font-bold min-w-[120px]"
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4 opacity-60">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Compact Mode</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Reduce task card sizes to display a denser column viewport configuration.</p>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded border border-gray-200 dark:border-gray-700">
            Default
          </span>
        </div>
      </div>
    </div>
  );
};
