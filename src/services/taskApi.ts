import type { Task, CreateTaskInput, UpdateTaskInput, TaskStatus, ApiResponse } from '../types';
import { storageUtility } from '../utils/storageUtility';

const STORAGE_KEY = 'task_board_data';

const simulateDelay = (): Promise<void> => {
  const delay = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

export const taskApi = {
  async getTasks(): Promise<ApiResponse<Task[]>> {
    await simulateDelay();
    const tasks = storageUtility.get<Task[]>(STORAGE_KEY, []);
    return { success: true, message: 'Tasks fetched successfully', data: tasks };
  },

  async getTaskById(id: string): Promise<ApiResponse<Task>> {
    await simulateDelay();
    const tasks = storageUtility.get<Task[]>(STORAGE_KEY, []);
    const task = tasks.find((t) => t.id === id);
    if (!task) {
      return { success: false, error: 'Task not found', code: 404 };
    }
    return { success: true, message: 'Task fetched successfully', data: task };
  },

  async createTask(input: CreateTaskInput): Promise<ApiResponse<Task>> {
    await simulateDelay();
    const tasks = storageUtility.get<Task[]>(STORAGE_KEY, []);
    
    const newTask: Task = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageUtility.set(STORAGE_KEY, [...tasks, newTask]);
    return { success: true, message: 'Task created successfully', data: newTask };
  },

  async updateTask(id: string, input: UpdateTaskInput): Promise<ApiResponse<Task>> {
    await simulateDelay();
    const tasks = storageUtility.get<Task[]>(STORAGE_KEY, []);
    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return { success: false, error: 'Task not found', code: 404 };
    }

    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    const newTasks = [...tasks];
    newTasks[taskIndex] = updatedTask;
    storageUtility.set(STORAGE_KEY, newTasks);

    return { success: true, message: 'Task updated successfully', data: updatedTask };
  },

  async deleteTask(id: string): Promise<ApiResponse<boolean>> {
    await simulateDelay();
    const tasks = storageUtility.get<Task[]>(STORAGE_KEY, []);
    const filteredTasks = tasks.filter((t) => t.id !== id);
    
    if (tasks.length === filteredTasks.length) {
      return { success: false, error: 'Task not found', code: 404 };
    }

    storageUtility.set(STORAGE_KEY, filteredTasks);
    return { success: true, message: 'Task deleted successfully', data: true };
  },

  async moveTask(id: string, status: TaskStatus): Promise<ApiResponse<Task>> {
    return this.updateTask(id, { status, updatedAt: new Date().toISOString() });
  }
};