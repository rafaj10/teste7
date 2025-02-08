import { call, put, takeLatest } from 'redux-saga/effects'
import {
  GET_WORKFLOWS,
  CREATE_WORKFLOW,
  UPDATE_WORKFLOW,
  DELETE_WORKFLOW,
  GET_WORKFLOWS_SUCCESS,
  CREATE_WORKFLOW_SUCCESS,
  UPDATE_WORKFLOW_SUCCESS,
  DELETE_WORKFLOW_SUCCESS,
} from './actions'
import workflowService from '../../service/workflowService'

function* fetchWorkflows() {
  const workflows = yield call(workflowService.getWorkflows)
  yield put({ type: GET_WORKFLOWS_SUCCESS, payload: workflows })
}

function* createWorkflow(action) {
  const workflow = yield call(workflowService.createWorkflow, action.payload)
  yield put({ type: CREATE_WORKFLOW_SUCCESS, payload: workflow })
}

function* updateWorkflow(action) {
  const { workflow } = action.payload
  try {
    yield call(workflowService.updateWorkflow, workflow._id, workflow)
    const workflows = yield call(workflowService.getWorkflows)
    yield put({ type: GET_WORKFLOWS_SUCCESS, payload: workflows })
  } catch (error) {
    console.error('Error updating workflow:', error)
  }
}

function* deleteWorkflow(action) {
  yield call(workflowService.deleteWorkflow, action.payload)
  const workflows = yield call(workflowService.getWorkflows)
  yield put({ type: GET_WORKFLOWS_SUCCESS, payload: workflows })
}

export default function* workflowsSaga() {
  yield takeLatest(GET_WORKFLOWS, fetchWorkflows)
  yield takeLatest(CREATE_WORKFLOW, createWorkflow)
  yield takeLatest(UPDATE_WORKFLOW, updateWorkflow)
  yield takeLatest(DELETE_WORKFLOW, deleteWorkflow)
}
