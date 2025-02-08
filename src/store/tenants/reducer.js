import {
  GET_TENANT_SUCCESS,
  GET_TENANT_FAIL,
} from "./actionTypes"

const INIT_STATE = {
  tenants: [],
  error: {},
  loading: true
}

const tenants = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TENANT_SUCCESS:
      return {
        ...state,
        tenants: action.payload,
        loading: false
      }

    case GET_TENANT_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false
      }

    default:
      return state
  }
}

export default tenants
