import { io } from 'socket.io-client'

const API_URL = import.meta.env.VITE_APP_API
const token = JSON.parse(localStorage.getItem('authUser')) || null

function getOpts(_token) {
  return {
    autoConnect: false,
    retries: 1,
    reconnectionDelay: 3000,
    reconnection: true,
    transports: ['websocket'],
    query: {
      token: 'Bearer ' + (_token ?? token?.token),
    },
  }
}

export let socketManager = io(API_URL, getOpts())

export async function setSocketManagerToken() {
  const reftoken = JSON.parse(localStorage.getItem('authUser'))
  socketManager = io(API_URL, getOpts(reftoken?.token))
  socketManager.connect()
}

export function clearSocketConnection() {
  socketManager.off('connect')
  socketManager.off('disconnect')
  socketManager.off('new_notification')
  socketManager.disconnect()
}

