// Entities reducer for normalized state management
import { combineReducers } from 'redux';
import {
  FETCH_TASKS_SUCCESS,
  FETCH_USERS_SUCCESS,
  FETCH_PROJECTS_SUCCESS,
  CREATE_TASK_SUCCESS,
  UPDATE_TASK_SUCCESS,
  DELETE_TASK_SUCCESS
} from '../actions/taskActions';

// Tasks reducer
const tasksReducer = (state = { byId: {}, allIds: [] }, action) => {
  switch (action.type) {
    case FETCH_TASKS_SUCCESS:
      const tasksById = {};
      const taskIds = [];
      
      action.payload.data.forEach(task => {
        tasksById[task.id] = task;
        taskIds.push(task.id);
      });
      
      return {
        byId: tasksById,
        allIds: taskIds
      };
      
    case CREATE_TASK_SUCCESS:
      return {
        byId: {
          ...state.byId,
          [action.payload.data.id]: action.payload.data
        },
        allIds: [...state.allIds, action.payload.data.id]
      };
      
    case UPDATE_TASK_SUCCESS:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.data.id]: action.payload.data
        }
      };
      
    case DELETE_TASK_SUCCESS:
      const { [action.payload.data.id]: deleted, ...remainingTasks } = state.byId;
      return {
        byId: remainingTasks,
        allIds: state.allIds.filter(id => id !== action.payload.data.id)
      };
      
    default:
      return state;
  }
};

// Users reducer
const usersReducer = (state = { byId: {}, allIds: [] }, action) => {
  switch (action.type) {
    case FETCH_USERS_SUCCESS:
      const usersById = {};
      const userIds = [];
      
      action.payload.data.forEach(user => {
        usersById[user.id] = user;
        userIds.push(user.id);
      });
      
      return {
        byId: usersById,
        allIds: userIds
      };
      
    default:
      return state;
  }
};

// Projects reducer
const projectsReducer = (state = { byId: {}, allIds: [] }, action) => {
  switch (action.type) {
    case FETCH_PROJECTS_SUCCESS:
      const projectsById = {};
      const projectIds = [];
      
      action.payload.data.forEach(project => {
        projectsById[project.id] = project;
        projectIds.push(project.id);
      });
      
      return {
        byId: projectsById,
        allIds: projectIds
      };
      
    default:
      return state;
  }
};

export default combineReducers({
  tasks: tasksReducer,
  users: usersReducer,
  projects: projectsReducer
});
