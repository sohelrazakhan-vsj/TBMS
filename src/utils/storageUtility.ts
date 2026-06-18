import type { Task } from '../types/index';

// 1. Storage se data load karne ka function
export const loadTasksFromStorage = (): Task[] => {
  try {
    const serializedTasks = localStorage.getItem('tasks_board_data');
    if (serializedTasks === null) {
      return [];
    }
    return JSON.parse(serializedTasks) as Task[];
  } catch (error) {
    console.error('Could not load tasks from localStorage', error);
    return [];
  }
};

// 2. Storage mein data save karne ka function
export const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    const serializedTasks = JSON.stringify(tasks);
    localStorage.setItem('tasks_board_data', serializedTasks);
  } catch (error) {
    console.error('Could not save tasks to localStorage', error);
  }
};

export const storageUtility = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from storage key "${key}":`, error);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to storage key "${key}":`, error);
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing storage key "${key}":`, error);
    }
  },

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
