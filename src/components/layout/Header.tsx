import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../types';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 flex items-center justify-between transition-colors duration-200">
      <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity no-underline">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
          <span className="text-white font-bold text-lg">T</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          TaskBoard 
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="rounded-full p-2 text-base leading-none"
          onClick={toggleTheme}
        >
          {theme === Theme.Light ? '🌙' : '☀️'}
        </Button>

        {/* FIX: Yahan onClick handler bilkul active tarike se navigate karega */}
        <Button 
          variant="primary" 
          size="sm" 
          className="bg-[#3B82F6] border border-[#60A5FA] text-white font-semibold px-4 py-2 rounded-lg shadow-lg shadow-blue-500/30 hover:bg-[#2563EB] hover:border-[#93C5FD] transition-all duration-200 active:scale-95"          onClick={() => navigate('/tasks/new')}
        >
          + New Task
        </Button>
      </div>
    </header>
  );
};
