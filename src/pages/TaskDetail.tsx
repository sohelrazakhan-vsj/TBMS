import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { taskApi } from '../services/taskApi';
import type { Task } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/button';
import { useToast } from '../context/ToastContext';

export const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (!id) return;
      setLoading(true);
      const response = await taskApi.getTaskById(id);
      if (response.success) {
        setTask(response.data);
      } else {
        addToast('error', response.error || 'Task not found');
        navigate('/board');
      }
      setLoading(false);
    };

    fetchTaskDetails();
  }, [id, navigate, addToast]);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!task) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/board')}>
          ← Back to Board
        </Button>
        <Link to={`/tasks/${task.id}/edit`}>
          <Button variant="primary">Edit Task ✏️</Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-md space-y-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <span className="text-xs font-bold uppercase px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
              {task.status}
            </span>
            <Badge type="priority" value={task.priority} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{task.title}</h2>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Description</h3>
          <p className="text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-slate-50 dark:bg-slate-800/40 p-4 rounded-lg border border-gray-100 dark:border-slate-800/50">
            {task.description || 'No description provided for this task.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-slate-800/60">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Assignee</h4>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              <span>👤</span> {task.assignee || 'Unassigned'}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Due Date</h4>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              <span>📅</span> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}
            </div>
          </div>
        </div>

        {task.tags.length > 0 && (
          <div className="pt-4 border-t border-gray-100 dark:border-slate-800/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Tags</h4>
            <div className="flex items-center gap-2 flex-wrap">
              {task.tags.map((tag, idx) => (
                <span key={idx} className="text-xs font-medium px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-md border border-blue-100/50 dark:border-blue-900/30">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
