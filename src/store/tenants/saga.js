import { call, put, takeEvery } from "redux-saga/effects"

// Redux States
import { GET_TENANTS } from "./actionTypes"

import {
  getTenantsSucess,
  getTenantsFail,
} from "./actions"

//Include Both Helper File with needed methods
import { getTenants } from "../../helpers/fakebackend_helper"

function* fetchTenants() {
  try {
    const response = yield call(getTenants)
    yield put(getTenantsSucess(response))
  } catch (error) {
    yield put(getTenantsFail(error))
  }
}

function* tenantsSaga() {
  yield takeEvery(GET_TENANTS, fetchTenants)
}

export default tenantsSaga;
