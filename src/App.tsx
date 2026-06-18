import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { TaskProvider } from './context/TaskContext';
import { Header } from './components/layout/Header';

const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const BoardView = lazy(() => import('./components/board/BoardView').then(module => ({ default: module.BoardView })));
const CreateTask = lazy(() => import('./pages/CreateTask').then(module => ({ default: module.CreateTask })));
const EditTask = lazy(() => import('./pages/EditTask').then(module => ({ default: module.EditTask })));
const TaskDetail = lazy(() => import('./pages/TaskDetail').then(module => ({ default: module.TaskDetail })));
const Settings = lazy(() => import('./pages/Settings').then(module => ({ default: module.Settings })));

const PageLoader: React.FC = () => (
  <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 dark:bg-slate-900">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <TaskProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-canvas text-primary transition-colors duration-200 flex flex-col">
              <Header />
              <main className="max-w-7xl mx-auto w-full flex-grow">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/board" element={<BoardView />} />
                    <Route path="/tasks/new" element={<CreateTask />} />
                    <Route path="/tasks/:id/edit" element={<EditTask />} />
                    <Route path="/tasks/:id" element={<TaskDetail />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route 
                      path="*" 
                      element={
                        <div className="p-12 text-center text-gray-500 dark:text-gray-400 font-medium">
                          <span className="text-4xl block mb-2">🔍</span> 404 - Page Not Found
                        </div>
                      } 
                    />
                  </Routes>
                </Suspense>
              </main>
            </div>
          </BrowserRouter>
        </TaskProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
