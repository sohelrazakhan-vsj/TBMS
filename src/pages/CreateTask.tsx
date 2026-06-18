import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskForm } from '../components/forms/TaskForm';
import { useTaskForm } from '../hooks/useTaskForm';
import { useTaskContext } from '../context/TaskContext';

export const CreateTask: React.FC = () => {
  const navigate = useNavigate();
  const { createTask } = useTaskContext();
  const formController = useTaskForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = formController.getSubmitPayload();
    const success = await createTask(payload);
    setLoading(false);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">Create New Task</h2>
      <TaskForm
        formController={formController}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
        submitLabel="Create Task"
        isLoading={loading}
      />
    </div>
  );
};
