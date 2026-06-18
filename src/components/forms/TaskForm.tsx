import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface TaskFormValues {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
  tags: string;
}

interface TaskFormController {
  values: TaskFormValues;
  errors: Record<string, string | undefined>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  isValid: boolean;
}

interface TaskFormProps {
  formController: TaskFormController;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel?: string;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  formController,
  onSubmit,
  onCancel,
  submitLabel = 'Save Task',
  isLoading = false,
}) => {
  const { values, errors, handleChange, handleBlur, isValid } = formController;

  const statusOptions = [
    { value: 'Backlog', label: 'Backlog' },
    { value: 'InProgress', label: 'In Progress' },
    { value: 'Review', label: 'Review' },
    { value: 'Done', label: 'Done' },
  ];

  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Critical', label: 'Critical' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-md space-y-4">
      <Input
        label="Task Title *"
        name="title"
        value={values.title}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.title}
        placeholder="Enter task title"
        required
      />

      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter task description (max 2000 chars)"
          className={`w-full px-3 py-2 text-base rounded-md border bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 transition-all duration-200 outline-none resize-y min-h-[100px] ${
            errors.description ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
          }`}
        />
        {errors.description && <p className="text-xs font-medium text-red-500">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select label="Status" name="status" value={values.status} options={statusOptions} onChange={handleChange} onBlur={handleBlur} />
        <Select label="Priority" name="priority" value={values.priority} options={priorityOptions} onChange={handleChange} onBlur={handleBlur} />
      </div>

      <Input
        label="Assignee Name"
        name="assignee"
        value={values.assignee}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.assignee}
        placeholder="e.g. John Doe"
      />

            <div className="flex items-center justify-end gap-5 pt-5 border-t border-gray-100 dark:border-slate-800/60">
        {/* Cancel Button: Matches the exact style, sizing, and colors of the action button */}
        <Button 
          type="button" 
          variant="primary" 
          onClick={onCancel} 
          disabled={isLoading}
        className="bg-[#3B82F6] border border-[#60A5FA] text-white font-semibold px-4 py-2 rounded-lg shadow-lg shadow-blue-500/30 hover:bg-[#2563EB] hover:border-[#93C5FD] transition-all duration-200 active:scale-95"        
        >
          Cancel
        </Button>

        {/* Create Task Button: Clean twin replica styling of the cancel action button */}
       <Button 
          type="submit" 
          variant="primary" 
          isLoading={isLoading} 
          disabled={!isValid}
        className="bg-[#3B82F6] border border-[#60A5FA] text-white font-semibold px-4 py-2 rounded-lg shadow-lg shadow-blue-500/30 hover:bg-[#2563EB] hover:border-[#93C5FD] transition-all duration-200 active:scale-95"        >
          {submitLabel}
        </Button>
      </div>


    </form>
  );
}