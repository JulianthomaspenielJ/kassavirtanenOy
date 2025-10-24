// Memoized selectors for accessing normalized state
import { createSelector } from 'reselect';

// Basic selectors
const getEntities = (state) => state.entities;
const getUI = (state) => state.ui;
const getOptimistic = (state) => state.optimistic;

// Entity selectors
export const getTasks = createSelector(
  [getEntities],
  (entities) => entities.tasks
);

export const getUsers = createSelector(
  [getEntities],
  (entities) => entities.users
);

export const getProjects = createSelector(
  [getEntities],
  (entities) => entities.projects
);

// Task selectors
export const getAllTasks = createSelector(
  [getTasks],
  (tasks) => tasks.allIds.map(id => tasks.byId[id])
);

export const getTaskById = (state, taskId) => {
  const tasks = getTasks(state);
  return tasks.byId[taskId];
};

// User selectors
export const getAllUsers = createSelector(
  [getUsers],
  (users) => users.allIds.map(id => users.byId[id])
);

export const getUserById = (state, userId) => {
  const users = getUsers(state);
  return users.byId[userId];
};

// Project selectors
export const getAllProjects = createSelector(
  [getProjects],
  (projects) => projects.allIds.map(id => projects.byId[id])
);

export const getProjectById = (state, projectId) => {
  const projects = getProjects(state);
  return projects.byId[projectId];
};

// UI selectors
export const getTaskForm = createSelector(
  [getUI],
  (ui) => ui.taskForm
);

export const getFilters = createSelector(
  [getUI],
  (ui) => ui.filters
);

export const getLoading = createSelector(
  [getUI],
  (ui) => ui.loading
);

export const getErrors = createSelector(
  [getUI],
  (ui) => ui.errors
);

// Optimistic selectors
export const getPendingCreates = createSelector(
  [getOptimistic],
  (optimistic) => optimistic.pendingCreates
);

export const getPendingUpdates = createSelector(
  [getOptimistic],
  (optimistic) => optimistic.pendingUpdates
);

export const getPendingDeletes = createSelector(
  [getOptimistic],
  (optimistic) => optimistic.pendingDeletes
);

// Complex selectors
export const getFilteredTasks = createSelector(
  [getAllTasks, getFilters, getPendingCreates, getPendingDeletes],
  (tasks, filters, pendingCreates, pendingDeletes) => {
    let filteredTasks = [...tasks];
    
    // Add pending creates
    filteredTasks = [...filteredTasks, ...pendingCreates];
    
    // Remove pending deletes
    filteredTasks = filteredTasks.filter(task => !pendingDeletes.includes(task.id));
    
    // Apply filters
    if (filters.projectId) {
      filteredTasks = filteredTasks.filter(task => task.projectId === filters.projectId);
    }
    
    if (filters.assigneeId) {
      filteredTasks = filteredTasks.filter(task => task.assigneeId === filters.assigneeId);
    }
    
    if (filters.status && filters.status !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }
    
    if (filters.taskType && filters.taskType !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.taskType === filters.taskType);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower))
      );
    }
    
    return filteredTasks;
  }
);

// Get users for a specific project
export const getProjectUsers = createSelector(
  [getAllUsers, getProjectById],
  (users, project) => {
    if (!project) return [];
    return users.filter(user => project.userIds.includes(user.id));
  }
);

// Get task with optimistic updates applied
export const getTaskWithOptimisticUpdates = createSelector(
  [getTaskById, getPendingUpdates],
  (task, pendingUpdates) => {
    if (!task) return null;
    
    const updates = pendingUpdates[task.id];
    if (!updates) return task;
    
    return { ...task, ...updates };
  }
);

// Check if task is being deleted
export const isTaskBeingDeleted = createSelector(
  [getPendingDeletes],
  (pendingDeletes) => (taskId) => pendingDeletes.includes(taskId)
);

// Check if task is being created
export const isTaskBeingCreated = createSelector(
  [getPendingCreates],
  (pendingCreates) => (taskId) => pendingCreates.some(task => task.id === taskId)
);
