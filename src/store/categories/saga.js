import { call, put, takeLatest } from 'redux-saga/effects'
import {
  GET_CATEGORIES_REQUEST,
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_FAILURE,
} from './actions'
import categoryService from '../../service/categoryService'

function* fetchCategories(action) {
  try {
    const categories = yield call(categoryService.getCategories, action.payload)
    console.log('AEE ->' + JSON.stringify(categories))
    yield put({ type: GET_CATEGORIES_SUCCESS, payload: categories })
  } catch (error) {
    yield put({ type: GET_CATEGORIES_FAILURE, payload: error.message })
  }
}

export default function* categoriesSaga() {
  yield takeLatest(GET_CATEGORIES_REQUEST, fetchCategories)
}
