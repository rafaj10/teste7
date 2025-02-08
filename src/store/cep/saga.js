import { call, put, takeLatest } from 'redux-saga/effects'
import { fetchCep } from '../../service/cep'
import { FETCH_CEP_REQUEST } from './types'
import { fetchCepSuccess, fetchCepFailure } from './actions'

function* fetchCepSaga(action) {
  try {
    const response = yield call(fetchCep, action.payload)
    console.log('API Response:', response)
    if (response && response.data) {
      yield put(fetchCepSuccess(response.data))
    } else {
      yield put(fetchCepSuccess(response)) // Adjusting to send the entire response if response.data is undefined
    }
  } catch (error) {
    console.error('API Error:', error)
    yield put(fetchCepFailure(error.message))
  }
}

export default function* cepSaga() {
  yield takeLatest(FETCH_CEP_REQUEST, fetchCepSaga)
}
