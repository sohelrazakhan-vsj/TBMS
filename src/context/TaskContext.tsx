/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Task, TaskStatus, TaskFilters, CreateTaskInput, UpdateTaskInput } from '../types';
import { Priority, SortField } from '../types';
import { taskApi } from '../services/taskApi';
import { useToast } from './ToastContext';

interface TaskContextType {
  tasks: Task[];
  filteredAndSortedTasks: Task[];
  loading: boolean;
  error: string | null;
  filters: TaskFilters;
  sortField: SortField;
  sortOrder: 'asc' | 'desc';
  setFilters: React.Dispatch<React.SetStateAction<TaskFilters>>;
  setSortField: (field: SortField) => void;
  toggleSortOrder: () => void;
  fetchTasks: () => Promise<void>;
  createTask: (input: CreateTaskInput) => Promise<boolean>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  moveTask: (id: string, status: TaskStatus) => Promise<boolean>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const priorityWeight = {
  [Priority.Critical]: 4,
  [Priority.High]: 3,
  [Priority.Medium]: 2,
  [Priority.Low]: 1,
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<TaskFilters>({});
  const [sortField, setSortField] = useState<SortField>(SortField.CreatedAt);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    const response = await taskApi.getTasks();
    if (response.success) {
      setTasks(response.data);
    } else {
      setError(response.error);
      addToast('error', 'Failed to load tasks');
    }
    setLoading(false);
  }, [addToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(async (input: CreateTaskInput) => {
    const response = await taskApi.createTask(input);
    if (response.success) {
      setTasks((prev) => [...prev, response.data]);
      addToast('success', 'Task created successfully');
      return true;
    }
    addToast('error', response.error);
    return false;
  }, [addToast]);

  const updateTask = useCallback(async (id: string, input: UpdateTaskInput) => {
    const response = await taskApi.updateTask(id, input);
    if (response.success) {
      setTasks((prev) => prev.map((t) => (t.id === id ? response.data : t)));
      addToast('success', 'Task updated successfully');
      return true;
    }
    addToast('error', response.error);
    return false;
  }, [addToast]);

  const deleteTask = useCallback(async (id: string) => {
    const response = await taskApi.deleteTask(id);
    if (response.success) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      addToast('success', 'Task deleted successfully');
      return true;
    }
    addToast('error', response.error);
    return false;
  }, [addToast]);

  const moveTask = useCallback(async (id: string, status: TaskStatus) => {
    const originalTasks = [...tasks];
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t)));

    const response = await taskApi.moveTask(id, status);
    if (!response.success) {
      setTasks(originalTasks);
      addToast('error', 'Failed to move task');
      return false;
    }
    return true;
  }, [tasks, addToast]);

  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (filters.status && task.status !== filters.status) return false;
        if (filters.priority && task.priority !== filters.priority) return false;
        if (filters.assignee && !task.assignee.toLowerCase().includes(filters.assignee.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortField === SortField.Priority) {
          return priorityWeight[a.priority] - priorityWeight[b.priority];
        }

        if (sortField === SortField.Title) {
          return sortOrder === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        }

        const dateA = new Date(a[sortField === SortField.CreatedAt ? 'createdAt' : 'updatedAt']).getTime();
        const dateB = new Date(b[sortField === SortField.CreatedAt ? 'createdAt' : 'updatedAt']).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [tasks, filters, sortField, sortOrder]);

  const toggleSortOrder = useCallback(() => setSortOrder((p) => (p === 'asc' ? 'desc' : 'asc')), []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredAndSortedTasks,
        loading,
        error,
        filters,
        sortField,
        sortOrder,
        setFilters,
        setSortField,
        toggleSortOrder,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        moveTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTaskContext must be used within a TaskProvider');
  return context;
};
