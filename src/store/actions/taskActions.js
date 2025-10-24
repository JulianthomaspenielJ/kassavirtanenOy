// Task action creators

// Action Types
export const FETCH_TASKS_REQUEST = 'FETCH_TASKS_REQUEST';
export const FETCH_TASKS_SUCCESS = 'FETCH_TASKS_SUCCESS';
export const FETCH_TASKS_FAILURE = 'FETCH_TASKS_FAILURE';

export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

export const FETCH_PROJECTS_REQUEST = 'FETCH_PROJECTS_REQUEST';
export const FETCH_PROJECTS_SUCCESS = 'FETCH_PROJECTS_SUCCESS';
export const FETCH_PROJECTS_FAILURE = 'FETCH_PROJECTS_FAILURE';

export const CREATE_TASK_REQUEST = 'CREATE_TASK_REQUEST';
export const CREATE_TASK_SUCCESS = 'CREATE_TASK_SUCCESS';
export const CREATE_TASK_FAILURE = 'CREATE_TASK_FAILURE';
export const CREATE_TASK_OPTIMISTIC = 'CREATE_TASK_OPTIMISTIC';

export const UPDATE_TASK_REQUEST = 'UPDATE_TASK_REQUEST';
export const UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS';
export const UPDATE_TASK_FAILURE = 'UPDATE_TASK_FAILURE';
export const UPDATE_TASK_OPTIMISTIC = 'UPDATE_TASK_OPTIMISTIC';

export const DELETE_TASK_REQUEST = 'DELETE_TASK_REQUEST';
export const DELETE_TASK_SUCCESS = 'DELETE_TASK_SUCCESS';
export const DELETE_TASK_FAILURE = 'DELETE_TASK_FAILURE';
export const DELETE_TASK_OPTIMISTIC = 'DELETE_TASK_OPTIMISTIC';

// Fetch Tasks Actions
export const fetchTasksRequest = (filters = {}) => ({
  type: FETCH_TASKS_REQUEST,
  payload: { filters }
});

export const fetchTasksSuccess = (data) => ({
  type: FETCH_TASKS_SUCCESS,
  payload: { data }
});

export const fetchTasksFailure = (error) => ({
  type: FETCH_TASKS_FAILURE,
  payload: { error }
});

// Fetch Users Actions
export const fetchUsersRequest = () => ({
  type: FETCH_USERS_REQUEST
});

export const fetchUsersSuccess = (data) => ({
  type: FETCH_USERS_SUCCESS,
  payload: { data }
});

export const fetchUsersFailure = (error) => ({
  type: FETCH_USERS_FAILURE,
  payload: { error }
});

// Fetch Projects Actions
export const fetchProjectsRequest = () => ({
  type: FETCH_PROJECTS_REQUEST
});

export const fetchProjectsSuccess = (data) => ({
  type: FETCH_PROJECTS_SUCCESS,
  payload: { data }
});

export const fetchProjectsFailure = (error) => ({
  type: FETCH_PROJECTS_FAILURE,
  payload: { error }
});

// Create Task Actions
export const createTaskRequest = (taskData) => ({
  type: CREATE_TASK_REQUEST,
  payload: { taskData }
});

export const createTaskSuccess = (data) => ({
  type: CREATE_TASK_SUCCESS,
  payload: { data }
});

export const createTaskFailure = (error) => ({
  type: CREATE_TASK_FAILURE,
  payload: { error }
});

export const createTaskOptimistic = (taskData) => ({
  type: CREATE_TASK_OPTIMISTIC,
  payload: { ...taskData, tempId: `temp_${Date.now()}` }
});

// Update Task Actions
export const updateTaskRequest = (taskId, updates) => ({
  type: UPDATE_TASK_REQUEST,
  payload: { taskId, updates }
});

export const updateTaskSuccess = (data) => ({
  type: UPDATE_TASK_SUCCESS,
  payload: { data }
});

export const updateTaskFailure = (error) => ({
  type: UPDATE_TASK_FAILURE,
  payload: { error }
});

export const updateTaskOptimistic = (taskId, updates) => ({
  type: UPDATE_TASK_OPTIMISTIC,
  payload: { taskId, updates }
});

// Delete Task Actions
export const deleteTaskRequest = (taskId) => ({
  type: DELETE_TASK_REQUEST,
  payload: { taskId }
});

export const deleteTaskSuccess = (data) => ({
  type: DELETE_TASK_SUCCESS,
  payload: { data }
});

export const deleteTaskFailure = (error) => ({
  type: DELETE_TASK_FAILURE,
  payload: { error }
});

export const deleteTaskOptimistic = (taskId) => ({
  type: DELETE_TASK_OPTIMISTIC,
  payload: { taskId }
});