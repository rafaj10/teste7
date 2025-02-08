import {
  IMPORT_LEADS_REQUEST,
  IMPORT_LEADS_SUCCESS,
  IMPORT_LEADS_FAILURE,
  CONFIRM_IMPORT_LEADS,
} from './types'

const initialState = {
  data: null,
  loading: false,
  error: null,
}

const importarLeadsReducer = (state = initialState, action) => {
  switch (action.type) {
    case IMPORT_LEADS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case IMPORT_LEADS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      }
    case IMPORT_LEADS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case CONFIRM_IMPORT_LEADS:
      return initialState
    default:
      return state
  }
}

export default importarLeadsReducer
