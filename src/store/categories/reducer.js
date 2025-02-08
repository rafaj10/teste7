import {
  GET_CATEGORIES_REQUEST,
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_FAILURE,
} from './actions'

const initialState = {
  categories: [],
  loading: false,
  error: null,
}

const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORIES_REQUEST:
      return { ...state, loading: true }
    case GET_CATEGORIES_SUCCESS:
      return { ...state, categories: action.payload, loading: false }
    case GET_CATEGORIES_FAILURE:
      return { ...state, error: action.payload, loading: false }
    default:
      return state
  }
}

export default categoriesReducer
