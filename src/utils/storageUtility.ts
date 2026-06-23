import type { Task } from '../types/index';

function isTaskArray(data: any): boolean {
  if (!Array.isArray(data)) return false;
  return data.every(item => item && typeof item === 'object' && 'title' in item);
}

export const STORAGE_KEY = 'tasks_board_data';

export const loadTasksFromStorage = (): Task[] => {
  try {
    const serializedTasks = localStorage.getItem(STORAGE_KEY);
    if (serializedTasks === null) {
      return [];
    }
    
    const parsedData = JSON.parse(serializedTasks);

    if (isTaskArray(parsedData)) {
      return parsedData;
    } else {
      console.error('Storage data corrupted! Safety fallback triggered.');
      return []; 
    }
  } catch (error) {
    console.error('Could not load tasks from localStorage', error);
    return [];
  }
};

export const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    if (!isTaskArray(tasks)) {
      console.error('Refusing to save invalid task structure to storage');
      return;
    }
    const serializedTasks = JSON.stringify(tasks);
    localStorage.setItem(STORAGE_KEY, serializedTasks);
  } catch (error) {
    console.error('Could not save tasks to localStorage', error);
  }
};

export const storageUtility = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      
      const parsed = JSON.parse(item);
      
      if (key === STORAGE_KEY && !isTaskArray(parsed)) {
        return defaultValue;
      }
      
      return parsed;
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
