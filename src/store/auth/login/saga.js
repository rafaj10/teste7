import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

// Login Redux States
import { LOGIN_USER, LOGOUT_USER } from './actionTypes'
import { apiError, loginSuccess } from './actions'

import { postLogin, getMe } from '../../../helpers/backend_helper'
import {
  clearSocketConnection,
  setSocketManagerToken,
  socketManager,
} from '../../../socket'

function* loginUser({ payload: { user, history } }) {
  try {
    const response = yield call(postLogin, {
      email: user.email,
      password: user.password,
    })
    localStorage.setItem('authUser', JSON.stringify(response))
    const responseMe = yield call(getMe)
    localStorage.setItem('user', JSON.stringify(responseMe))
    localStorage.setItem('userId', JSON.stringify(responseMe._id))
    localStorage.setItem('userTenants', JSON.stringify(responseMe.tenants))
    localStorage.setItem(
      'userDefaultTenant',
      JSON.stringify(responseMe.tenants[0])
    )
    setSocketManagerToken()
    yield put(loginSuccess(response))
    history('/inicio')
  } catch (error) {
    yield put(apiError(error))
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem('authUser')
    localStorage.removeItem('user')
    clearSocketConnection()
    history('/login')
  } catch (error) {
    yield put(apiError(error))
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser)
  yield takeEvery(LOGOUT_USER, logoutUser)
}

export default authSaga

