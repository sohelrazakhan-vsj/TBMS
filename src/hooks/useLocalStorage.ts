import { useState, useCallback } from 'react';
import { STORAGE_KEY } from '../utils/storageUtility'; 

function isTaskArray(data: any): boolean {
  if (!Array.isArray(data)) return false;
  return data.every(item => item && typeof item === 'object' && 'title' in item);
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const isTargetKey = key === STORAGE_KEY || key.toLowerCase().includes('task');

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      const parsedData = JSON.parse(item);

      if (isTargetKey || Array.isArray(initialValue)) {
        if (!isTaskArray(parsedData)) {
          console.warn(`[LocalStorage] Corrupted data found for key "${key}". Resetting safely.`);
          return initialValue; 
        }
      }

      return parsedData as T;
    } catch (error) {
      console.error('Error reading localStorage key:', error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        if (typeof window === 'undefined') return;

        setStoredValue((prevValue) => {
          const valueToStore = value instanceof Function ? value(prevValue) : value;
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          return valueToStore;
        });

      } catch (error) {
        console.error('Unable to save localStorage value:', error);
      }
    },
    [key] 
  );

  return [storedValue, setValue] as const;
}
