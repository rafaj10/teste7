import {
  CREATE_LEAD,
  CREATE_PEOPLES,
  DELETE_PEOPLES,
  GET_AGENCIES_BY_COMPANY,
  GET_AGENCIES_BY_COMPANY_SUCCESS,
  GET_PEOPLES,
  GET_PEOPLES_FAIL,
  GET_PEOPLES_SUCCESS,
  GET_PEOPLES_USERS,
  GET_PEOPLES_USERS_SUCCESS,
  GET_PERSONS_BY_AGENCY,
  GET_PERSONS_BY_AGENCY_SUCCESS,
  GET_PERSONS_BY_COMPANY,
  GET_PERSONS_BY_COMPANY_SUCCESS,
  PEOPLES_LOADING,
  UPDATE_PEOPLES,
  CREATE_PEOPLES_SUCESS,
} from './actionTypes'

export const loadingPeoples = () => ({
  type: PEOPLES_LOADING,
})

export const getPeoples = (type, filters) => ({
  type: GET_PEOPLES,
  payload: { type, filters },
})

export const getAgenciesByCompany = (relation) => ({
  type: GET_AGENCIES_BY_COMPANY,
  payload: relation,
})

export const getPersonsByCompany = (relation) => ({
  type: GET_PERSONS_BY_COMPANY,
  payload: relation,
})

export const getPersonsByAgency = (relation) => ({
  type: GET_PERSONS_BY_AGENCY,
  payload: relation,
})

export const createPeoples = (type, data, shouldReload, lead, callback) => ({
  type: CREATE_PEOPLES,
  payload: { type, data, shouldReload, lead, callback },
})

export const updatePeoples = (peopleId, type, data, callback) => ({
  type: UPDATE_PEOPLES,
  payload: { peopleId, type, data, callback },
})

export const createLeads = (boardId, data, callback) => ({
  type: CREATE_LEAD,
  payload: { boardId, data, callback },
})

export const deletePeoples = (peopleId, type, callback) => ({
  type: DELETE_PEOPLES,
  payload: { peopleId, type, callback },
})

export const getPeoplesSucess = (peoples) => ({
  type: GET_PEOPLES_SUCCESS,
  payload: peoples,
})

export const getPeoplesFail = (error) => ({
  type: GET_PEOPLES_FAIL,
  payload: error,
})

export const getAgenciesByCompanySucess = (agencies) => ({
  type: GET_AGENCIES_BY_COMPANY_SUCCESS,
  payload: agencies,
})

export const getPersonsByCompanySucess = (agencies) => ({
  type: GET_PERSONS_BY_COMPANY_SUCCESS,
  payload: agencies,
})

export const getPersonsByAgencySucess = (agencies) => ({
  type: GET_PERSONS_BY_AGENCY_SUCCESS,
  payload: agencies,
})

export const getUsersByTenant = () => ({
  type: GET_PEOPLES_USERS,
})

export const getUsersByTenantSucess = (users) => ({
  type: GET_PEOPLES_USERS_SUCCESS,
  payload: users,
})

export const createPeopleSucess = (people) => ({
  type: CREATE_PEOPLES_SUCESS,
  payload: people,
})
