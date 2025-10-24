// Task sagas for handling async operations
import { call, put, takeEvery, takeLatest, race, delay, select } from 'redux-saga/effects';
import { mockApi } from '../../api/mockApi';
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
  CREATE_TASK_OPTIMISTIC,
  UPDATE_TASK_REQUEST,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_FAILURE,
  UPDATE_TASK_OPTIMISTIC,
  DELETE_TASK_REQUEST,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_FAILURE,
  DELETE_TASK_OPTIMISTIC
} from '../actions/taskActions';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Helper function for retry logic
function* retrySaga(fn, maxRetries = MAX_RETRIES) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return yield call(fn);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      yield delay(RETRY_DELAY * (i + 1));
    }
  }
}

// Fetch Tasks Saga
function* fetchTasksSaga(action) {
  try {
    console.log('fetchTasksSaga called with:', action.payload);
    const { filters } = action.payload;
    const response = yield call(retrySaga, () => mockApi.fetchTasks(filters));
    console.log('fetchTasksSaga response:', response);
    yield put({ type: FETCH_TASKS_SUCCESS, payload: response });
  } catch (error) {
    console.log('fetchTasksSaga error:', error);
    yield put({ type: FETCH_TASKS_FAILURE, payload: error.message });
  }
}

// Fetch Users Saga
function* fetchUsersSaga() {
  try {
    const response = yield call(retrySaga, () => mockApi.fetchUsers());
    yield put({ type: FETCH_USERS_SUCCESS, payload: response });
  } catch (error) {
    yield put({ type: FETCH_USERS_FAILURE, payload: error.message });
  }
}

// Fetch Projects Saga
function* fetchProjectsSaga() {
  try {
    const response = yield call(retrySaga, () => mockApi.fetchProjects());
    yield put({ type: FETCH_PROJECTS_SUCCESS, payload: response });
  } catch (error) {
    yield put({ type: FETCH_PROJECTS_FAILURE, payload: error.message });
  }
}

// Create Task Saga with Optimistic Updates
function* createTaskSaga(action) {
  const { taskData } = action.payload;
  
  try {
    // Dispatch optimistic update
    yield put({ type: CREATE_TASK_OPTIMISTIC, payload: taskData });
    
    // Make API call
    const response = yield call(retrySaga, () => mockApi.createTask(taskData));
    yield put({ type: CREATE_TASK_SUCCESS, payload: response });
  } catch (error) {
    yield put({ type: CREATE_TASK_FAILURE, payload: { error: error.message, tempId: taskData.tempId } });
  }
}

// Update Task Saga with Optimistic Updates
function* updateTaskSaga(action) {
  const { taskId, updates } = action.payload;
  
  try {
    // Dispatch optimistic update
    yield put({ type: UPDATE_TASK_OPTIMISTIC, payload: { taskId, updates } });
    
    // Make API call
    const response = yield call(retrySaga, () => mockApi.updateTask(taskId, updates));
    yield put({ type: UPDATE_TASK_SUCCESS, payload: response });
  } catch (error) {
    yield put({ type: UPDATE_TASK_FAILURE, payload: { error: error.message, taskId } });
  }
}

// Delete Task Saga with Optimistic Updates
function* deleteTaskSaga(action) {
  const { taskId } = action.payload;
  
  try {
    // Dispatch optimistic update
    yield put({ type: DELETE_TASK_OPTIMISTIC, payload: { taskId } });
    
    // Make API call
    const response = yield call(retrySaga, () => mockApi.deleteTask(taskId));
    yield put({ type: DELETE_TASK_SUCCESS, payload: response });
  } catch (error) {
    yield put({ type: DELETE_TASK_FAILURE, payload: { error: error.message, taskId } });
  }
}

// Task Sagas
export default function* taskSagas() {
  yield takeLatest(FETCH_TASKS_REQUEST, fetchTasksSaga);
  yield takeLatest(FETCH_USERS_REQUEST, fetchUsersSaga);
  yield takeLatest(FETCH_PROJECTS_REQUEST, fetchProjectsSaga);
  yield takeLatest(CREATE_TASK_REQUEST, createTaskSaga);
  yield takeLatest(UPDATE_TASK_REQUEST, updateTaskSaga);
  yield takeLatest(DELETE_TASK_REQUEST, deleteTaskSaga);
}