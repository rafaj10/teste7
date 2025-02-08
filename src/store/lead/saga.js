import { call, put, takeLatest } from 'redux-saga/effects'

import { toast } from 'sonner'
import * as service from '../../service/lead'
import * as actions from './actions'
import * as types from './types'

function* fetchLeadDetailsById(action) {
  try {
    const response = yield call(service.getLeadDetailsById, action.payload)
    yield put(actions.getLeadDetailsByIdSuc(response))
  } catch (error) {
    yield put(actions.getLeadDetailsByIdFail(error))
  }
}

function* fetchTasks(action) {
  try {
    const response = yield call(service.getTasksByLeadId, action.payload)
    yield put(actions.getLeadTasksSuc(response))
  } catch (error) {
    yield put(actions.getLeadTasksFail(error))
  }
}

function* toggleTask(action) {
  try {
    yield call(service.toggleTask, action.payload)
    yield put(actions.getLeadTasksReq({ id: action.payload.id }))
  } catch (error) {
    toast.error(`Erro ao atualizar tarefa - ${error.message}`)
    yield put(actions.getLeadTasksReq({ id: action.payload.id }))
  }
}

function* deleteTask(action) {
  try {
    yield call(service.deleteTask, action.payload)
    yield put(actions.getLeadTasksReq({ id: action.payload.leadId }))
  } catch (error) {
    toast.error(`Erro ao deletar tarefa - ${error.message}`)
  }
}

function* createTask(action) {
  try {
    yield call(service.createTask, action.payload)
    toast.success('Tarefa criada com sucesso')
    if (action.callback) action.callback()
    yield put(actions.getLeadTasksReq({ id: action.payload.leadId }))
  } catch (error) {
    toast.error(`Erro ao criar tarefa - ${error.message}`)
    yield put(actions.createTaskFail(error))
  }
}

function* fetchLeadObservations(action) {
  try {
    const response = yield call(service.getLeadObservations, action.payload)
    yield put(actions.getLeadObservationsSuc(response))
  } catch (error) {
    yield put(actions.getLeadObservationsFail(error))
  }
}

function* createLeadObservation(action) {
  try {
    yield call(service.createObservation, action.payload)
    yield put(actions.getLeadObservationsReq({ id: action.payload.id }))
    if (action.callback) action.callback()
    toast.success('Observação criada com sucesso')
  } catch (error) {
    toast.error(`Erro ao criar observação - ${error.message}`)
    yield put(actions.createObservationFail(error))
  }
}

function* fetchLeadMeetings(action) {
  try {
    const response = yield call(service.getLeadMeetings, action.payload)
    yield put(actions.getLeadMeetingsSuc(response))
  } catch (error) {
    yield put(actions.getLeadMeetingsFail(error))
  }
}

function* createLeadMeeting(action) {
  try {
    yield call(service.createMeeting, action.payload)
    yield put(actions.getLeadMeetingsReq({ id: action.payload.leadId }))
    if (action.callback) action.callback()
    toast.success('Reunião criada com sucesso')
  } catch (error) {
    toast.error(`Erro ao criar reunião - ${error.message}`)
    yield put(actions.createMeetingFail(error))
  }
}

function* updateLeadStep(action) {
  try {
    yield call(service.updateLeadStep, action.payload)
    yield put(actions.updateLeadStepSuc())
    yield put(
      actions.getLeadDetailsByIdReq({
        id: action.payload.id,
        board: action.payload.board,
      })
    )
    if (action.cb) {
      action.cb()
    }
  } catch (error) {
    yield put(actions.updateLeadStepFail(error))
  }
}

function* leadSaga() {
  yield takeLatest(types.GET_LEAD_DETAILS_BY_ID_REQUEST, fetchLeadDetailsById)
  yield takeLatest(types.GET_LEAD_TASKS_REQUEST, fetchTasks)
  yield takeLatest(types.TOGGLE_TASK, toggleTask)
  yield takeLatest(types.CREATE_TASK_REQUEST, createTask)
  yield takeLatest(types.GET_LEAD_OBSERVATIONS_REQUEST, fetchLeadObservations)
  yield takeLatest(types.CREATE_LEAD_OBSERVATION_REQUEST, createLeadObservation)
  yield takeLatest(types.DELETE_TASK_REQUEST, deleteTask)
  yield takeLatest(types.GET_LEAD_MEETINGS_REQUEST, fetchLeadMeetings)
  yield takeLatest(types.CREATE_MEETING_REQUEST, createLeadMeeting)
  yield takeLatest(types.UPDATE_LEAD_STEP_REQUEST, updateLeadStep)
}

export default leadSaga
