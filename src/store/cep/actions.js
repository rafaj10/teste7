import {
  FETCH_CEP_REQUEST,
  FETCH_CEP_SUCCESS,
  FETCH_CEP_FAILURE,
} from './types'

export const fetchCepRequest = (cep) => ({
  type: FETCH_CEP_REQUEST,
  payload: cep,
})

export const fetchCepSuccess = (data) => ({
  type: FETCH_CEP_SUCCESS,
  payload: data,
})

export const fetchCepFailure = (error) => ({
  type: FETCH_CEP_FAILURE,
  payload: error,
})
