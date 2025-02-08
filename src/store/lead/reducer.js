import * as types from './types'

const INIT_STATE = {
  data: {
    owner: { name: '', _id: null },
    origin: '',
    contacts: [],
    company: {},
    agency: {},
  },
  error: null,
  loading: false,

  tasks: {
    error: null,
    loading: false,
    data: [],
  },

  observations: {
    error: null,
    loading: false,
    data: [],
  },

  meetings: {
    error: null,
    loading: false,
    data: [],
  },
}

const leads = (state = INIT_STATE, action) => {
  switch (action.type) {
    // Lead Details
    case types.GET_LEAD_DETAILS_BY_ID_REQUEST:
      return { ...state, loading: true }
    case types.GET_LEAD_DETAILS_BY_ID_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false,
      }
    case types.GET_LEAD_DETAILS_BY_ID_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case types.RESET_LEAD_DETAILS:
      return {
        ...INIT_STATE,
      }
    case types.UPDATE_LEAD_STEP_REQUEST:
      return { ...state, loading: true }
    case types.UPDATE_LEAD_STEP_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case types.UPDATE_LEAD_STEP_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    // Lead Tasks
    case types.GET_LEAD_TASKS_REQUEST:
      return { ...state, tasks: { ...state.tasks, loading: true } }
    case types.GET_LEAD_TASKS_SUCCESS:
      return {
        ...state,
        tasks: { ...state.tasks, data: action.payload, loading: false },
      }
    case types.GET_LEAD_TASKS_FAILURE:
      return {
        ...state,
        tasks: { ...state.tasks, error: action.payload, loading: false },
      }
    case types.CREATE_TASK_REQUEST:
      return { ...state, tasks: { ...state.tasks, loading: true } }
    case types.CREATE_TASK_SUCCESS:
      return state
    case types.CREATE_TASK_FAILURE:
      return {
        ...state,
        tasks: { ...state.tasks, error: action.payload, loading: false },
      }
    // Lead Observations
    case types.GET_LEAD_OBSERVATIONS_REQUEST:
      return {
        ...state,
        observations: { ...state.observations, loading: true },
      }
    case types.GET_LEAD_OBSERVATIONS_SUCCESS:
      return {
        ...state,
        observations: {
          ...state.observations,
          data: action.payload,
          loading: false,
        },
      }
    case types.GET_LEAD_OBSERVATIONS_FAILURE:
      return {
        ...state,
        observations: {
          ...state.observations,
          error: action.payload,
          loading: false,
        },
      }
    // Lead Meetings
    case types.GET_LEAD_MEETINGS_REQUEST:
      return { ...state, meetings: { ...state.meetings, loading: true } }
    case types.GET_LEAD_MEETINGS_SUCCESS:
      return {
        ...state,
        meetings: { ...state.meetings, data: action.payload, loading: false },
      }
    case types.GET_LEAD_MEETINGS_FAILURE:
      return {
        ...state,
        meetings: { ...state.meetings, error: action.payload, loading: false },
      }
    case types.CREATE_MEETING_REQUEST:
      return { ...state, meetings: { ...state.meetings, loading: true } }
    case types.CREATE_MEETING_SUCCESS:
      return state
    case types.CREATE_MEETING_FAILURE:
      return {
        ...state,
        meetings: { ...state.meetings, error: action.payload, loading: false },
      }
    default:
      return state
  }
}

export default leads
