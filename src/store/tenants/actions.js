import {
  GET_TENANTS,
  GET_TENANT_SUCCESS,
  GET_TENANT_FAIL,
} from "./actionTypes"

export const getTenants = () => ({
  type: GET_TENANTS,
})

export const getTenantsSucess = tenants => ({
  type: GET_TENANT_SUCCESS,
  payload: tenants,
})

export const getTenantsFail = error => ({
  type: GET_TENANT_FAIL,
  payload: error,
})
