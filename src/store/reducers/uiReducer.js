// UI reducer for managing UI state
import {
  OPEN_TASK_FORM,
  CLOSE_TASK_FORM,
  SET_FILTERS,
  CLEAR_FILTERS,
  SET_SEARCH,
  SET_LOADING,
  SET_ERROR,
  CLEAR_ERROR
} from '../actions/uiActions';

import {
  FETCH_TASKS_REQUEST,
  FETCH_TASKS_SUCCESS,
  FETCH_TASKS_FAILURE,
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  FETCH_PROJECTS_REQUEST,
  FETCH_PROJECTS_SUCCESS,
  FETCH_PROJECTS_FAILURE,
  CREATE_TASK_REQUEST,
  CREATE_TASK_SUCCESS,
  CREATE_TASK_FAILURE,
  UPDATE_TASK_REQUEST,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_FAILURE,
  DELETE_TASK_REQUEST,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_FAILURE
} from '../actions/taskActions';

const initialState = {
  taskForm: {
    isOpen: false,
    mode: 'create',
    taskId: null
  },
  filters: {
    projectId: null,
    assigneeId: null,
    status: 'all',
    taskType: 'all',
    search: ''
  },
  loading: {
    tasks: false,
    users: false,
    projects: false
  },
  errors: {
    tasks: null,
    users: null,
    projects: null,
    form: null
  }
};

export default function uiReducer(state = initialState, action) {
  switch (action.type) {
    // Task Form Management
    case OPEN_TASK_FORM:
      return {
        ...state,
        taskForm: {
          isOpen: true,
          mode: action.payload.mode,
          taskId: action.payload.taskId || null
        }
      };
      
    case CLOSE_TASK_FORM:
      return {
        ...state,
        taskForm: {
          isOpen: false,
          mode: 'create',
          taskId: null
        }
      };
      
    // Filter Management
    case SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
      
    case CLEAR_FILTERS:
      return {
        ...state,
        filters: {
          projectId: null,
          assigneeId: null,
          status: 'all',
          taskType: 'all',
          search: ''
        }
      };
      
    case SET_SEARCH:
      return {
        ...state,
        filters: {
          ...state.filters,
          search: action.payload
        }
      };
      
    // Loading States
    case FETCH_TASKS_REQUEST:
    case CREATE_TASK_REQUEST:
    case UPDATE_TASK_REQUEST:
    case DELETE_TASK_REQUEST:
      return {
        ...state,
        loading: {
          ...state.loading,
          tasks: true
        }
      };
      
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: {
          ...state.loading,
          users: true
        }
      };
      
    case FETCH_PROJECTS_REQUEST:
      return {
        ...state,
        loading: {
          ...state.loading,
          projects: true
        }
      };
      
    case FETCH_TASKS_SUCCESS:
    case FETCH_TASKS_FAILURE:
    case CREATE_TASK_SUCCESS:
    case CREATE_TASK_FAILURE:
    case UPDATE_TASK_SUCCESS:
    case UPDATE_TASK_FAILURE:
    case DELETE_TASK_SUCCESS:
    case DELETE_TASK_FAILURE:
      return {
        ...state,
        loading: {
          ...state.loading,
          tasks: false
        }
      };
      
    case FETCH_USERS_SUCCESS:
    case FETCH_USERS_FAILURE:
      return {
        ...state,
        loading: {
          ...state.loading,
          users: false
        }
      };
      
    case FETCH_PROJECTS_SUCCESS:
    case FETCH_PROJECTS_FAILURE:
      return {
        ...state,
        loading: {
          ...state.loading,
          projects: false
        }
      };
      
    // Error Management
    case FETCH_TASKS_FAILURE:
      return {
        ...state,
        errors: {
          ...state.errors,
          tasks: action.payload
        }
      };
      
    case FETCH_USERS_FAILURE:
      return {
        ...state,
        errors: {
          ...state.errors,
          users: action.payload
        }
      };
      
    case FETCH_PROJECTS_FAILURE:
      return {
        ...state,
        errors: {
          ...state.errors,
          projects: action.payload
        }
      };
      
    case CREATE_TASK_FAILURE:
    case UPDATE_TASK_FAILURE:
      return {
        ...state,
        errors: {
          ...state.errors,
          form: action.payload
        }
      };
      
    case CLEAR_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload]: null
        }
      };
      
    default:
      return state;
  }
}
