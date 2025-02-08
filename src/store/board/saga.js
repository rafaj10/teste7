import { call, put, takeLatest } from 'redux-saga/effects'

import {
  fetchBoardById,
  fetchBoardList,
  fetchBoardLeadList,
} from '../../service/board'

import * as types from './types'

function* getBoardById(action) {
  try {
    const verify = action.payload === undefined ? action : action.payload
    const board = yield call(fetchBoardById, verify)
    yield put({ type: types.GET_BOARD_BY_ID_SUCCESS, payload: board })
  } catch (error) {
    yield put({ type: types.GET_BOARD_BY_ID_FAILURE, payload: error })
  }
}

function* getBoardList(action) {
  try {
    const list = yield call(fetchBoardList, action.payload)
    yield put({ type: types.GET_BOARD_LIST_SUCCESS, payload: list })
    //yield call(getBoardById, list[0]._id)
    //const listLeads = yield call(fetchBoardLeadList, list[0]._id)
    //yield put({ type: types.GET_BOARD_LEADS_LIST_SUCCESS, payload: listLeads })
  } catch (error) {
    yield put({ type: types.GET_BOARD_LIST_FAILURE, payload: error })
  }
}

function* getBoardLeadLists(action) {
  try {
    const leads = yield call(fetchBoardLeadList, action.payload.id, action.payload.filters)
    yield put({ type: types.GET_BOARD_LEADS_LIST_SUCCESS, payload: leads })
  } catch (error) {
    yield put({ type: types.GET_BOARD_LEADS_LIST_FAILURE, payload: error })
  }
}

export default function* boardSaga() {
  yield takeLatest(types.GET_BOARD_BY_ID_REQUEST, getBoardById)
  yield takeLatest(types.GET_BOARD_LIST_REQUEST, getBoardList)
  yield takeLatest(types.GET_BOARD_LEADS_LIST_REQUEST, getBoardLeadLists)
}
