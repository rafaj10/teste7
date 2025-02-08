import {
  FETCH_CEP_REQUEST,
  FETCH_CEP_SUCCESS,
  FETCH_CEP_FAILURE,
} from './types'

const initialState = {
  data: null,
  loading: false,
  error: null,
}

const cepReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CEP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case FETCH_CEP_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      }
    case FETCH_CEP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}

export default cepReducer
