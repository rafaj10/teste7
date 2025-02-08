import axios from 'axios'
import { QueryClient } from '@tanstack/react-query'

//pass new generated access token here
const token = JSON.parse(localStorage.getItem('authUser')) || null

//apply base url for axios
const API_URL = import.meta.env.VITE_APP_API

const axiosApi = axios.create({
  baseURL: API_URL,
})

axiosApi.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem('authUser')) || null
    if (token) {
      config.headers.Authorization = `Bearer ${token.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
)

export async function get(url, config = {}) {
  return await axiosApi.get(url, { ...config }).then((response) => {
    // console.log(JSON.stringify(response.data))
    return response.data
  })
}

export async function post(url, data, config = {}) {
  console.log(url)
  console.log('DATA -> ' + JSON.stringify(data))
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then((response) => response.data)
}

export async function postArray(url, data, config = {}) {
  return axiosApi
    .post(url, data, { ...config })
    .then((response) => response.data)
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then((response) => response.data)
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then((response) => response.data)
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
  },
})
