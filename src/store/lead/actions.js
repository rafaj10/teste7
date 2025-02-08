import * as types from './types'

// Lead Details
export const getLeadDetailsByIdReq = ({ id, board }) => ({
  type: types.GET_LEAD_DETAILS_BY_ID_REQUEST,
  payload: { id, board },
})

export const getLeadDetailsByIdSuc = (data) => ({
  type: types.GET_LEAD_DETAILS_BY_ID_SUCCESS,
  payload: data,
})

export const getLeadDetailsByIdFail = (err) => ({
  type: types.GET_LEAD_DETAILS_BY_ID_FAILURE,
  payload: err,
})

export const resetLeadDetails = () => ({
  type: types.RESET_LEAD_DETAILS,
})

export const updateLeadStepReq = (data, cb) => ({
  type: types.UPDATE_LEAD_STEP_REQUEST,
  payload: data,
  cb,
})

export const updateLeadStepSuc = () => ({
  type: types.UPDATE_LEAD_STEP_SUCCESS,
})

export const updateLeadStepFail = (err) => ({
  type: types.UPDATE_LEAD_STEP_FAILURE,
  payload: err,
})

// Lead Tasks
export const getLeadTasksReq = ({ id }) => ({
  type: types.GET_LEAD_TASKS_REQUEST,
  payload: { id },
})

export const getLeadTasksSuc = (data) => ({
  type: types.GET_LEAD_TASKS_SUCCESS,
  payload: data,
})

export const getLeadTasksFail = (err) => ({
  type: types.GET_LEAD_TASKS_FAILURE,
  payload: err,
})

export const toggleTaskReq = (data) => ({
  type: types.TOGGLE_TASK,
  payload: data,
})

export const createTaskReq = (data, callback) => ({
  type: types.CREATE_TASK_REQUEST,
  payload: data,
  callback: callback,
})

export const createTaskSuc = (data) => ({
  type: types.CREATE_TASK_SUCCESS,
  payload: data,
})

export const createTaskFail = (err) => ({
  type: types.CREATE_TASK_FAILURE,
  payload: err,
})

export const deleteTaskReq = ({ leadId, taskId }) => ({
  type: types.DELETE_TASK_REQUEST,
  payload: { leadId, taskId },
})

// Lead Observations
export const getLeadObservationsReq = ({ id }) => ({
  type: types.GET_LEAD_OBSERVATIONS_REQUEST,
  payload: { id },
})

export const getLeadObservationsSuc = (data) => ({
  type: types.GET_LEAD_OBSERVATIONS_SUCCESS,
  payload: data,
})

export const getLeadObservationsFail = (err) => ({
  type: types.GET_LEAD_OBSERVATIONS_FAILURE,
  payload: err,
})

export const createObservationReq = (data, callback) => ({
  type: types.CREATE_LEAD_OBSERVATION_REQUEST,
  payload: data,
  callback: callback,
})

export const createObservationSuc = (data) => ({
  type: types.CREATE_LEAD_OBSERVATION_SUCCESS,
  payload: data,
})

export const createObservationFail = (err) => ({
  type: types.CREATE_LEAD_OBSERVATION_FAILURE,
  payload: err,
})

// MEETINGS
export const getLeadMeetingsReq = ({ id }) => ({
  type: types.GET_LEAD_MEETINGS_REQUEST,
  payload: { id },
})

export const getLeadMeetingsSuc = (data) => ({
  type: types.GET_LEAD_MEETINGS_SUCCESS,
  payload: data,
})

export const getLeadMeetingsFail = (err) => ({
  type: types.GET_LEAD_MEETINGS_FAILURE,
  payload: err,
})

export const createMeetingReq = (data, callback) => ({
  type: types.CREATE_MEETING_REQUEST,
  payload: data,
  callback: callback,
})

export const createMeetingSuc = (data) => ({
  type: types.CREATE_MEETING_SUCCESS,
  payload: data,
})

export const createMeetingFail = (err) => ({
  type: types.CREATE_MEETING_FAILURE,
  payload: err,
})
