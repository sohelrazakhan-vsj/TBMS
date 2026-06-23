import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskContext } from '../../context/TaskContext';
import { TaskStatus } from '../../types/index';
import { Badge } from '../ui/Badge';

interface ColumnConfig {
  id: TaskStatus;
  title: string;
  color: string;
}

export const BoardView: React.FC = () => {
  const navigate = useNavigate();
  const { filteredAndSortedTasks, moveTask, deleteTask, fetchTasks } = useTaskContext();

  const columns: ColumnConfig[] = [
    { id: TaskStatus.Backlog, title: 'Backlog', color: 'border-t-slate-500' },
    { id: TaskStatus.InProgress, title: 'In Progress', color: 'border-t-amber-500' },
    { id: TaskStatus.Review, title: 'Review', color: 'border-t-blue-500' },
    { id: TaskStatus.Done, title: 'Done', color: 'border-t-emerald-500' }
  ];

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTask(taskId, status);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  return (
    <div className="p-6 h-[calc(100vh-4rem)] overflow-y-auto text-primary">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 h-full items-start">
        {columns.map((col) => {
          const colTasks = filteredAndSortedTasks.filter(
            t => String(t.status).toLowerCase().replace(/_/g, '') === String(col.id).toLowerCase().replace(/_/g, '')
          );
          
          return (
            <div 
              key={col.id} 
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="flex flex-col max-h-full rounded-xl border border-card border-t-4 p-4 shadow-sm bg-card min-h-[400px]"
              style={{ borderTopColor: col.color.includes('slate') ? '#64748b' : col.color.includes('amber') ? '#f59e0b' : col.color.includes('blue') ? '#3b82f6' : '#10b981' }}
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-card">
                <h3 className="font-bold flex items-center gap-2 text-primary text-base">
                  {col.title}
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">
                  {colTasks.length}
                </span>
              </div>

              <div className="flex flex-col gap-3 overflow-y-auto pr-1">
                {colTasks.map((task) => (
                  <div 
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onClick={() => navigate(`/tasks/${task.id}`)}
                    className="p-4 bg-card-item border border-card rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing group relative"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h4 className="font-semibold text-sm text-primary group-hover:text-blue-600 transition-colors pr-4">
                        {task.title}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Are you sure you want to delete this task?')) {
                            deleteTask(task.id);
                          }
                        }}
                        className="text-gray-400 hover:text-red-500 text-xs font-bold cursor-pointer transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 absolute top-3 right-3 z-10"
                        title="Delete Task"
                      >
                        ❌
                      </button>
                    </div>
                    <p className="text-xs text-secondary line-clamp-2 mb-3 pr-2">
                      {task.description || 'No description provided.'}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-card">
                      <Badge type="priority" value={task.priority} />
                      {task.assignee && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-card max-w-[100px] truncate">
                          👤 {task.assignee}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-card rounded-lg text-slate-400">
                    <span className="text-2xl mb-1">📭</span>
                    <p className="text-[11px] font-medium">No Tasks Here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
