import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import { useTaskForm } from '../hooks/useTaskForm';
import type { UpdateTaskInput, Task } from '../types';
import { TaskForm } from '../components/forms/TaskForm';
import { taskApi } from '../services/taskApi';
import { useToast } from '../context/ToastContext';

export const EditTask: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateTask } = useTaskContext();
  const { addToast } = useToast();

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [initialTask, setInitialTask] = useState<Task | undefined>(undefined);
  const formController = useTaskForm(initialTask);

  useEffect(() => {
    const loadTask = async () => {
      if (!id) return;
      setLoading(true);
      const response = await taskApi.getTaskById(id);
      
      if (response.success) {
        setInitialTask(response.data);
      } else {
        addToast('error', response.error || 'Failed to retrieve task parameters');
        navigate('/board');
      }
      setLoading(false);
    };

    loadTask();
  }, [id, navigate, addToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !formController || !initialTask) return;

    setSubmitting(true);
    const payload = formController.getSubmitPayload() as UpdateTaskInput;
    const success = await updateTask(id, payload);
    setSubmitting(false);

    if (success) {
      navigate('/board');
    }
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!formController) return null;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">Modify Task Parameters</h2>
      <TaskForm
        formController={formController}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/board')}
        submitLabel="Update Task"
        isLoading={submitting}
      />
    </div>
  );
};
