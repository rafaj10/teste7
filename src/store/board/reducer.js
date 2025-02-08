import * as types from './types'

const INIT_STATE = {
  boards: [],
  leads: [],
  currentBoard: null,
  loading: false,
  error: null,
}

const boardReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case types.GET_BOARD_BY_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case types.GET_BOARD_LEADS_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case types.GET_BOARD_BY_ID_SUCCESS:
      return {
        ...state,
        currentBoard: action.payload,
        loading: false,
        error: null,
      }
    case types.GET_BOARD_LEADS_LIST_SUCCESS:
      return {
        ...state,
        leads: action.payload,
        loading: false,
        error: null,
      }
    case types.GET_BOARD_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case types.GET_BOARD_LEADS_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case types.GET_BOARD_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case types.GET_BOARD_LIST_SUCCESS:
      return {
        ...state,
        boards: action.payload,
        loading: false,
        error: null,
      }
    case types.GET_BOARD_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }

    default:
      return state
  }
}

export default boardReducer
