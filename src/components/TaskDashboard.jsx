// Main Dashboard Component
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import FilterBar from './FilterBar';

// Import selectors and actions
import { 
  getFilteredTasks,
  getAllUsers,
  getAllProjects,
  getTaskForm,
  getFilters,
  getLoading,
  getErrors,
  getTaskById,
  getPendingCreates,
  getPendingDeletes
} from '../store/selectors';

import {
  fetchTasksRequest,
  fetchUsersRequest,
  fetchProjectsRequest,
  createTaskRequest,
  updateTaskRequest,
  deleteTaskRequest
} from '../store/actions/taskActions';

import {
  openTaskForm,
  closeTaskForm,
  setFilters,
  clearError
} from '../store/actions/uiActions';

const TaskDashboard = () => {
  const dispatch = useDispatch();

  // Connect to Redux state using useSelector
  const tasks = useSelector(getFilteredTasks);
  const users = useSelector(getAllUsers);
  const projects = useSelector(getAllProjects);
  const taskForm = useSelector(getTaskForm);
  const filters = useSelector(getFilters);
  const loading = useSelector(getLoading);
  const errors = useSelector(getErrors);
  const pendingCreates = useSelector(getPendingCreates);
  const pendingDeletes = useSelector(getPendingDeletes);
  const initialTaskData = useSelector(state => 
    taskForm.taskId ? getTaskById(state, taskForm.taskId) : null
  );

  // Debug logging
  console.log('TaskDashboard Debug:', {
    tasks: tasks.length,
    users: users.length,
    projects: projects.length,
    loading,
    errors,
    filters
  });

  // Fetch initial data on component mount
  useEffect(() => {
    dispatch(fetchUsersRequest());
    dispatch(fetchProjectsRequest());
    dispatch(fetchTasksRequest({})); // Start with empty filters
  }, [dispatch]);

  // Refetch tasks when filters change
  useEffect(() => {
    dispatch(fetchTasksRequest(filters));
  }, [dispatch, filters.projectId, filters.assigneeId, filters.status, filters.taskType, filters.search]);

  // Implement event handlers
  const handleCreateTask = () => {
    dispatch(openTaskForm('create'));
  };

  const handleEditTask = (taskId) => {
    dispatch(openTaskForm('edit', taskId));
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTaskRequest(taskId));
    }
  };

  const handleFormSubmit = (formData) => {
    if (taskForm.mode === 'create') {
      dispatch(createTaskRequest(formData));
    } else {
      dispatch(updateTaskRequest(taskForm.taskId, formData));
    }
    dispatch(closeTaskForm());
  };

  const handleFormClose = () => {
    dispatch(closeTaskForm());
    localStorage.removeItem('taskFormData');
  };

  const handleFiltersChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  return (
    <div className="task-dashboard">
      <header className="dashboard-header">
        <h1>Task Management Dashboard</h1>
        <button 
          className="create-task-btn"
          onClick={handleCreateTask}
        >
          + Create Task
        </button>
      </header>

      {/* Show error messages */}
      {errors.tasks && (
        <div className="error-banner">
          <span>Error: {errors.tasks}</span>
          <button onClick={() => dispatch(clearError('tasks'))}>×</button>
        </div>
      )}

      {errors.form && (
        <div className="error-banner">
          <span>Form Error: {errors.form}</span>
          <button onClick={() => dispatch(clearError('form'))}>×</button>
        </div>
      )}

      <FilterBar
        filters={filters}
        projects={projects}
        users={users}
        onFiltersChange={handleFiltersChange}
      />

      <TaskList
        tasks={tasks}
        loading={loading.tasks}
        pendingCreates={pendingCreates}
        pendingDeletes={pendingDeletes}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />

      <TaskForm
        isOpen={taskForm.isOpen}
        mode={taskForm.mode}
        initialData={initialTaskData}
        users={users}
        projects={projects}
        loading={loading.tasks}
        onSubmit={handleFormSubmit}
        onClose={handleFormClose}
      />
    </div>
  );
};

export default TaskDashboard;