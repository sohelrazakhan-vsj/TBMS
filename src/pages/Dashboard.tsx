import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import { TaskStatus, Priority } from '../types';
import { Button } from '../components/ui/button';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, loading } = useTaskContext();

  const stats = useMemo(() => {
    const total = tasks.length;
    
    const statusCounts = {
      [TaskStatus.Backlog]: tasks.filter((t) => t.status === TaskStatus.Backlog).length,
      [TaskStatus.InProgress]: tasks.filter((t) => t.status === TaskStatus.InProgress).length,
      [TaskStatus.Review]: tasks.filter((t) => t.status === TaskStatus.Review).length,
      [TaskStatus.Done]: tasks.filter((t) => t.status === TaskStatus.Done).length,
    };

    const priorityCounts = {
      [Priority.Low]: tasks.filter((t) => t.priority === Priority.Low).length,
      [Priority.Medium]: tasks.filter((t) => t.priority === Priority.Medium).length,
      [Priority.High]: tasks.filter((t) => t.priority === Priority.High).length,
      [Priority.Critical]: tasks.filter((t) => t.priority === Priority.Critical).length,
    };

    return { total, statusCounts, priorityCounts };
  }, [tasks]);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Workspace Analytics</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Overview of status counts and current task priorities.</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/board')}>
          Go to Kanban Board 📋
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="p-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl shadow-sm text-center md:col-span-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Total Tasks</span>
          <p className="text-4xl font-extrabold text-blue-900 dark:text-blue-200 mt-2">{stats.total}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:col-span-4">
          <div className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Backlog</span>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{stats.statusCounts[TaskStatus.Backlog]}</p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
            <span className="text-xs font-semibold text-amber-600">In Progress</span>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{stats.statusCounts[TaskStatus.InProgress]}</p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
            <span className="text-xs font-semibold text-blue-600">Review</span>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{stats.statusCounts[TaskStatus.Review]}</p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
            <span className="text-xs font-semibold text-emerald-600">Done</span>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{stats.statusCounts[TaskStatus.Done]}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Priority Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">🟢 Low</span>
            <span className="text-lg font-bold text-gray-800 dark:text-white">{stats.priorityCounts[Priority.Low]}</span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">🟡 Medium</span>
            <span className="text-lg font-bold text-gray-800 dark:text-white">{stats.priorityCounts[Priority.Medium]}</span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">🟠 High</span>
            <span className="text-lg font-bold text-gray-800 dark:text-white">{stats.priorityCounts[Priority.High]}</span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">🔴 Critical</span>
            <span className="text-lg font-bold text-gray-800 dark:text-white">{stats.priorityCounts[Priority.Critical]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
