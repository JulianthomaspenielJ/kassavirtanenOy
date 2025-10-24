// Optimistic reducer for handling optimistic updates
import {
  CREATE_TASK_OPTIMISTIC,
  CREATE_TASK_SUCCESS,
  CREATE_TASK_FAILURE,
  UPDATE_TASK_OPTIMISTIC,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_FAILURE,
  DELETE_TASK_OPTIMISTIC,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_FAILURE
} from '../actions/taskActions';

const initialState = {
  pendingCreates: [],
  pendingUpdates: {},
  pendingDeletes: []
};

export default function optimisticReducer(state = initialState, action) {
  switch (action.type) {
    // Create Task Optimistic Updates
    case CREATE_TASK_OPTIMISTIC:
      return {
        ...state,
        pendingCreates: [...state.pendingCreates, action.payload]
      };
      
    case CREATE_TASK_SUCCESS:
      return {
        ...state,
        pendingCreates: state.pendingCreates.filter(
          task => task.tempId !== action.payload.tempId
        )
      };
      
    case CREATE_TASK_FAILURE:
      return {
        ...state,
        pendingCreates: state.pendingCreates.filter(
          task => task.tempId !== action.payload.tempId
        )
      };
      
    // Update Task Optimistic Updates
    case UPDATE_TASK_OPTIMISTIC:
      return {
        ...state,
        pendingUpdates: {
          ...state.pendingUpdates,
          [action.payload.taskId]: action.payload.updates
        }
      };
      
    case UPDATE_TASK_SUCCESS:
    case UPDATE_TASK_FAILURE:
      const { [action.payload.taskId]: removed, ...remainingUpdates } = state.pendingUpdates;
      return {
        ...state,
        pendingUpdates: remainingUpdates
      };
      
    // Delete Task Optimistic Updates
    case DELETE_TASK_OPTIMISTIC:
      return {
        ...state,
        pendingDeletes: [...state.pendingDeletes, action.payload.taskId]
      };
      
    case DELETE_TASK_SUCCESS:
    case DELETE_TASK_FAILURE:
      return {
        ...state,
        pendingDeletes: state.pendingDeletes.filter(
          id => id !== action.payload.taskId
        )
      };
      
    default:
      return state;
  }
}
