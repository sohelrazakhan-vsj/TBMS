export const TaskStatus = {
  Backlog: 'backlog',
  InProgress: 'in_progress',
  Review: 'review',
  Done: 'done',
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export const Priority = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
  Critical: 'critical',
} as const;

export type Priority = typeof Priority[keyof typeof Priority];

export const SortField = {
  Title: 'title',
  Priority: 'priority',
  CreatedAt: 'createdAt',
  UpdatedAt: 'updatedAt',
} as const;

export type SortField = typeof SortField[keyof typeof SortField];

export const Theme = {
  Light: 'light',
  Dark: 'dark',
} as const;

export type Theme = typeof Theme[keyof typeof Theme];

export interface Task {
  id: string;             
  title: string;           
  description: string;     
  status: TaskStatus;     
  priority: Priority;     
  tags: string[];
  assignee: string;        
  dueDate: string | null;  
  createdAt: string;       
  updatedAt: string;       
}

export interface SuccessApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ErrorApiResponse {
  success: false;
  error: string;
  code: number;
}

export type ApiResponse<T> = SuccessApiResponse<T> | ErrorApiResponse;

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateTaskInput = Partial<CreateTaskInput> & {
  updatedAt: string;
};

export type TaskPreview = Pick<Task, 'id' | 'title' | 'status' | 'priority'>;

export type TaskFilters = Partial<Pick<Task, 'status' | 'priority' | 'assignee'>>;

export function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false;
  const t = value as Task;
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.description === 'string' &&
    Object.values(TaskStatus).includes(t.status) &&
    Object.values(Priority).includes(t.priority) &&
    Array.isArray(t.tags) &&
    typeof t.assignee === 'string' &&
    (t.dueDate === null || typeof t.dueDate === 'string') &&
    typeof t.createdAt === 'string' &&
    typeof t.updatedAt === 'string'
  );
}

export function isApiError(response: unknown): response is ErrorApiResponse {
  if (!response || typeof response !== 'object') return false;
  const r = response as ErrorApiResponse;
  return r.success === false && typeof r.error === 'string' && typeof r.code === 'number';
}

export function isTaskArray(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(isTask);
}
