import {
  PEOPLES_LOADING,
  GET_PEOPLES_SUCCESS,
  GET_PEOPLES_FAIL,
  GET_AGENCIES_BY_COMPANY_SUCCESS,
  GET_AGENCIES_BY_COMPANY_FAIL,
  GET_PERSONS_BY_COMPANY_SUCCESS,
  GET_PERSONS_BY_COMPANY_FAIL,
  GET_PERSONS_BY_AGENCY_SUCCESS,
  GET_PERSONS_BY_AGENCY_FAIL,
  GET_PEOPLES_USERS_SUCCESS,
  GET_PEOPLES_USERS_FAIL,
  CREATE_PEOPLES_SUCESS,
} from './actionTypes'

const INIT_STATE = {
  createdPeople: null,
  peoples: [],
  agenciesByCompany: [],
  personsByCompany: [],
  personsByAgency: [],
  usersByTenant: [],
  error: {},
  loading: true,
}

const peoples = (state = INIT_STATE, action) => {
  switch (action.type) {
    case CREATE_PEOPLES_SUCESS:
      return {
        ...state,
        createdPeople: action.payload,
      }

    case GET_PEOPLES_SUCCESS:
      return {
        ...state,
        peoples: action.payload,
        loading: false,
      }

    case GET_PEOPLES_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }

    case GET_AGENCIES_BY_COMPANY_SUCCESS:
      return {
        ...state,
        agenciesByCompany: action.payload,
        loading: false,
      }

    case GET_AGENCIES_BY_COMPANY_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }

    case GET_PERSONS_BY_COMPANY_SUCCESS:
      return {
        ...state,
        personsByCompany: action.payload,
        loading: false,
      }

    case GET_PERSONS_BY_COMPANY_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }

    case GET_PERSONS_BY_AGENCY_SUCCESS:
      return {
        ...state,
        personsByAgency: action.payload,
        loading: false,
      }

    case GET_PERSONS_BY_AGENCY_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }

    case GET_PEOPLES_USERS_SUCCESS:
      return {
        ...state,
        usersByTenant: action.payload,
        loading: false,
      }

    case GET_PEOPLES_USERS_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }

    case PEOPLES_LOADING:
      return {
        ...state,
        loading: true,
      }

    default:
      return state
  }
}

export default peoples
