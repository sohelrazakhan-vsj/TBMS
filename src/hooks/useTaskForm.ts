import { useState, useCallback, useMemo, useEffect } from 'react';
import type { ChangeEvent, FocusEvent } from 'react';
import type { CreateTaskInput, UpdateTaskInput, Task, TaskStatus, Priority } from '../types';

interface FormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee: string;
  dueDate: string;
  tags: string;
}

type FormErrors = Record<string, string | undefined>;

const getInitialValues = (initialTask?: Task): FormValues => ({
  title: initialTask?.title || '',
  description: initialTask?.description || '',
  status: initialTask?.status || 'backlog',
  priority: initialTask?.priority || 'medium',
  assignee: initialTask?.assignee || '',
  dueDate: initialTask?.dueDate || '',
  tags: initialTask?.tags?.join(', ') || '',
});

export function useTaskForm(): {
  values: FormValues;
  errors: FormErrors;
  touched: Record<string, boolean>;
  isValid: boolean;
  isDirty: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  reset: () => void;
  getSubmitPayload: () => CreateTaskInput;
};

export function useTaskForm(initialTask: Task | undefined): {
  values: FormValues;
  errors: FormErrors;
  touched: Record<string, boolean>;
  isValid: boolean;
  isDirty: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  reset: () => void;
  getSubmitPayload: () => UpdateTaskInput;
};

export function useTaskForm(initialTask?: Task) {
  const [values, setValues] = useState<FormValues>(() => getInitialValues(initialTask));
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isDirty, setIsDirty] = useState<boolean>(false);

  useEffect(() => {
    if (initialTask) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValues(getInitialValues(initialTask));
    }
  }, [initialTask]);

  const validateField = useCallback((name: keyof FormValues, value: string): string | undefined => {
    if (name === 'title') {
      if (!value.trim()) return 'Title is required';
      if (value.length < 3 || value.length > 100) return 'Title must be between 3 and 100 characters';
    }
    if (name === 'description') {
      if (value.length > 2000) return 'Description cannot exceed 2000 characters';
    }
    if (name === 'assignee') {
      if (value.length > 50) return 'Assignee cannot exceed 50 characters';
    }
    if (name === 'dueDate' && value) {
      const selectedDate = new Date(value).getTime();
      const today = new Date().setHours(0, 0, 0, 0);
      if (selectedDate < today) return 'Due date cannot be in the past';
    }
    return undefined;
  }, []);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);

    if (touched[name]) {
      const error = validateField(name as keyof FormValues, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name as keyof FormValues, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, [validateField]);

  const getSubmitPayload = useCallback(() => {
    const parsedTags = values.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const basePayload: CreateTaskInput = {
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status,
      priority: values.priority,
      assignee: values.assignee.trim(),
      dueDate: values.dueDate || null,
      tags: parsedTags,
    };

    if (initialTask) {
      return {
        ...basePayload,
        id: initialTask.id,
        updatedAt: new Date().toISOString(),
      } as UpdateTaskInput;
    }

    return basePayload;
  }, [values, initialTask]);

  const reset = useCallback(() => {
    setValues(getInitialValues(initialTask));
    setErrors({});
    setTouched({});
    setIsDirty(false);
  }, [initialTask]);

  const isValid = useMemo(() => {
    const currentFields: (keyof FormValues)[] = ['title', 'description', 'status', 'priority', 'assignee', 'dueDate', 'tags'];
    const currentErrors = currentFields.reduce((acc, key) => {
      const err = validateField(key, values[key]);
      if (err) acc[key] = err;
      return acc;
    }, {} as Record<string, string>);
    return Object.keys(currentErrors).length === 0;
  }, [values, validateField]);

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    reset,
    getSubmitPayload,
  };
}
