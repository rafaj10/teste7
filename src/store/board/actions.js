import * as types from './types'

export const getBoardByIdReq = (id) => ({
  type: types.GET_BOARD_BY_ID_REQUEST,
  payload: id,
})

export const getBoardByIdSuccess = (board) => ({
  type: types.GET_BOARD_BY_ID_SUCCESS,
  payload: board,
})

export const getBoardByIdFailure = (error) => ({
  type: types.GET_BOARD_BY_ID_FAILURE,
  payload: error,
})

export const getBoardListReq = () => ({
  type: types.GET_BOARD_LIST_REQUEST,
})

export const getBoardListSuc = (board) => ({
  type: types.GET_BOARD_LIST_REQUEST,
  payload: board,
})

export const getBoardListFail = (error) => ({
  type: types.GET_BOARD_LIST_FAILURE,
  payload: error,
})

export const getBoardLeadsListReq = (id, filters) => ({
  type: types.GET_BOARD_LEADS_LIST_REQUEST,
  payload: { id, filters },
})

export const getBoardLeadsListSuc = (board) => ({
  type: types.GET_BOARD_LEADS_LIST_SUCCESS,
  payload: board,
})

export const getBoardLeadsListFail = (error) => ({
  type: types.GET_BOARD_LEADS_LIST_FAILURE,
  payload: error,
})
