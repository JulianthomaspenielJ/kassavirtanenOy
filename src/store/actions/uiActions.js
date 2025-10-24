// UI action creators

// Action Types
export const OPEN_TASK_FORM = 'OPEN_TASK_FORM';
export const CLOSE_TASK_FORM = 'CLOSE_TASK_FORM';
export const SET_FORM_MODE = 'SET_FORM_MODE';

export const SET_FILTERS = 'SET_FILTERS';
export const CLEAR_FILTERS = 'CLEAR_FILTERS';
export const SET_SEARCH = 'SET_SEARCH';

export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

// Task Form Actions
export const openTaskForm = (mode, taskId = null) => ({
  type: OPEN_TASK_FORM,
  payload: { mode, taskId }
});

export const closeTaskForm = () => ({
  type: CLOSE_TASK_FORM
});

export const setFormMode = (mode) => ({
  type: SET_FORM_MODE,
  payload: { mode }
});

// Filter Actions
export const setFilters = (filters) => ({
  type: SET_FILTERS,
  payload: filters
});

export const clearFilters = () => ({
  type: CLEAR_FILTERS
});

export const setSearch = (search) => ({
  type: SET_SEARCH,
  payload: search
});

// Loading Actions
export const setLoading = (key, loading) => ({
  type: SET_LOADING,
  payload: { key, loading }
});

// Error Actions
export const setError = (key, error) => ({
  type: SET_ERROR,
  payload: { key, error }
});

export const clearError = (key) => ({
  type: CLEAR_ERROR,
  payload: key
});