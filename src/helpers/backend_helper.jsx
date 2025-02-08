import axios from 'axios'
import { del, get, post, put } from './api_helper'
import * as url from './url_helper'

const API_URL = import.meta.env.VITE_APP_API

// Gets the logged in user data from local session
const getLoggedInUser = () => {
  const user = localStorage.getItem('user')
  if (user) return JSON.parse(user)
  return null
}

export const getDefaultTenantUrl = () => {
  const tenant = localStorage.getItem('userDefaultTenant')
  if (tenant) return '/tenants/' + JSON.parse(tenant)._id
  return ''
}

//is user is logged in
const isUserAuthenticated = () => {
  return getLoggedInUser() !== null
}

const postLogin = (data) => {
  return axios
    .post(API_URL + url.POST_LOGIN, data)
    .then((response) => {
      if (response.status >= 200 || response.status <= 299) return response.data
      throw response.data
    })
    .catch((error) => {
      let message
      if (error.response && error.response.status) {
        switch (error.response.status) {
          case 404:
            message = 'Sorry! the page you are looking for could not be found'
            break
          case 500:
            message =
              'Sorry! something went wrong, please contact our support team'
            break
          case 400:
            message = 'Credenciais invalidas'
            break
        }
      }
      throw message
    })
}

export const getMe = () => get(url.USERS_ME)

export const getTenants = () => get(url.GET_TENANTS)

export const getUsersTenants = () => get(getDefaultTenantUrl() + url.USERS)

function buildQueryString(filters) {
  let params = [];
  Object.keys(filters).forEach(key => {
    if (Array.isArray(filters[key])) {
      filters[key].forEach(value => {
        if (key === 'categories') {
          const categoryValue = value.split('|')[1];
          params.push(`${encodeURIComponent(key)}[]=${encodeURIComponent(categoryValue)}`);
        } else {
          params.push(`${encodeURIComponent(key)}[]=${encodeURIComponent(value)}`);
        }
      });
    } else if (filters[key] instanceof Date) {
      params.push(`${encodeURIComponent(key)}=${encodeURIComponent(filters[key].toISOString().split('T')[0])}`);
    } else if (filters[key] !== '') {
      params.push(`${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`);
    }
  });
  return params.join('&');
}

export const getPeoples = (type, filters) => {
  console.log('OK >> Filter >> '+ JSON.stringify(filters))

  if (filters && Object.keys(filters).length > 0) {
    const query = buildQueryString(filters);
    console.log('OK >> Query >> '+ JSON.stringify(query))
    console.log('OK >> url >> '+       getDefaultTenantUrl() +
    url.GET_PEOPLES +
    '?type=' +
    type +
    '&expand=relation&' +
    query)
    return   get(
      getDefaultTenantUrl() +
      url.GET_PEOPLES +
      '?type=' +
      type +
      '&expand=relation&' +
      query
    )
  } else {
    return   get(
      getDefaultTenantUrl() +
      url.GET_PEOPLES +
      '?type=' +
      type +
      '&expand=relation'
    )
  }
}

export const getAgenciesByCompany = (relation) =>
  get(
    getDefaultTenantUrl() +
    url.GET_PEOPLES +
    '?type=' +
    'agency'
    // 'agency' +
    // '&relation=' +
    // relation +
    // '&expand=relation'
  )

export const getPersonsBy = (relation) =>
  get(
    getDefaultTenantUrl() +
    url.GET_PEOPLES +
    '?type=' +
    'person' +
    '&relation=' +
    relation +
    '&expand=relation'
  )

// export const getPersonsByAgency = (relation) =>
//   get(
//     getDefaultTenantUrl() +
//       url.GET_PEOPLES +
//       '?type=' +
//       'person' +
//       '&relation=' +
//       relation +
//       '&expand=relation'
//   )

export const createPeoples = (type, data) =>
  post(getDefaultTenantUrl() + url.GET_PEOPLES + '?type=' + type, data)

export const updatePeoples = (peopleId, type, data) =>
  put(
    getDefaultTenantUrl() + url.GET_PEOPLES + '/' + peopleId + '?type=' + type,
    data
  )

export const deletePeoples = (peopleId, type) =>
  del(
    getDefaultTenantUrl() + url.GET_PEOPLES + '/' + peopleId + '?type=' + type
  )

export const createLead = (boardId, data) =>
  post(getDefaultTenantUrl() + '/boards/' + boardId + '/leads', data)

export { getLoggedInUser, isUserAuthenticated, postLogin }