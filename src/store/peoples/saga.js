import { call, put, takeEvery } from 'redux-saga/effects'

// Redux States
import {
  CREATE_LEAD,
  CREATE_PEOPLES,
  DELETE_PEOPLES,
  GET_AGENCIES_BY_COMPANY,
  GET_PEOPLES,
  GET_PEOPLES_USERS,
  GET_PERSONS_BY_AGENCY,
  GET_PERSONS_BY_COMPANY,
  PEOPLES_LOADING,
  UPDATE_PEOPLES,
  CREATE_PEOPLES_SUCESS,
} from './actionTypes'

import {
  getAgenciesByCompanySucess,
  getPeoplesFail,
  getPeoplesSucess,
  getPersonsByAgencySucess,
  getPersonsByCompanySucess,
  getUsersByTenantSucess,
  loadingPeoples,
  createPeopleSucess,
} from './actions'

import * as actionsLead from '../lead/actions'

//Include Both Helper File with needed methods
import {
  createLead,
  createPeoples,
  deletePeoples,
  getAgenciesByCompany,
  getPeoples,
  getPersonsBy,
  getUsersTenants,
  updatePeoples,
} from '../../helpers/backend_helper'

import * as service from '../../service/lead'

function* fetchPeoples({ payload }) {
  try {
    put(loadingPeoples)
    const response = yield call(getPeoples, payload.type, payload.filters)
    yield put(getPeoplesSucess(response))
  } catch (error) {
    yield put(getPeoplesFail(error))
  }
}

function* fetchAgenciesByCompany({ payload }) {
  try {
    put(loadingPeoples)
    const response = yield call(getAgenciesByCompany, payload)
    yield put(getAgenciesByCompanySucess(response))
  } catch (error) {
    yield put(getPeoplesFail(error))
  }
}

function* fetchPersonByCompany({ payload }) {
  try {
    put(loadingPeoples)
    const response = yield call(getPersonsBy, payload)
    yield put(getPersonsByCompanySucess(response))
  } catch (error) {
    yield put(getPeoplesFail(error))
  }
}

function* fetchPersonByAgency({ payload }) {
  try {
    put(loadingPeoples)
    const response = yield call(getPersonsBy, payload)
    yield put(getPersonsByAgencySucess(response))
  } catch (error) {
    yield put(getPeoplesFail(error))
  }
}

function* fetchUsersByTenant() {
  try {
    put(loadingPeoples)
    const response = yield call(getUsersTenants)
    yield put(getUsersByTenantSucess(response))
  } catch (error) {
    yield put(getPeoplesFail(error))
  }
}

function* createPeople({ payload }) {
  try {
    const people = yield call(createPeoples, payload.type, payload.data)
    yield put(createPeopleSucess(people))

    if (payload.shouldReload) {
      const response = yield call(getPeoples, payload.type)
      yield put(getPeoplesSucess(response))
    }

    if (payload.lead) {
      if (payload.type == 'person') {
        let newPeople = {
          person: people._id,
          strategic: false,
          ref: people.relations[0].people,
        }
        let contacts = []
        if (payload.lead.contacts) {
          contacts = payload.lead.contacts.map((contact) => ({
            person: contact.person._id,
            ref: contact.ref._id,
            strategic: contact.strategic,
          }))
        }
        contacts.push(newPeople)
        yield call(service.updateContactsAll, {
          id: payload.lead._id,
          contacts,
        })
      } else if (payload.type == 'agency') {
        yield call(service.updateLeadStep, {
          id: payload.lead._id,
          board: payload.lead.board,
          agency: people._id,
        })
      }
    }

    if (payload.callback) payload.callback(true, people)

  } catch (error) {
    if (payload.callback) payload.callback(false, error)
    console.log(JSON.stringify(error))
    yield put(getPeoplesFail(error))
  }
}

function* updatePeople({ payload }) {
  try {
    yield call(updatePeoples, payload.peopleId, payload.type, payload.data)
    const response = yield call(getPeoples, payload.type)
    yield put(getPeoplesSucess(response))
    if (payload.callback) payload.callback('success')
  } catch (error) {
    if (payload.callback) payload.callback('fail', error)
    yield put(getPeoplesFail(error))
  }
}

function* deletePeople({ payload }) {
  try {
    yield call(deletePeoples, payload.peopleId, payload.type)
    const response = yield call(getPeoples, payload.type)
    yield put(getPeoplesSucess(response))
    if (payload.callback) payload.callback('success')
  } catch (error) {
    if (payload.callback) payload.callback('fail', error)
    yield put(getPeoplesFail(error))
  }
}

function* createNewLead({ payload }) {
  try {
    yield call(createLead, payload.boardId, payload.data)
    if (payload.callback) payload.callback('success')
  } catch (error) {
    if (payload.callback) payload.callback('fail', error)
    yield put(getPeoplesFail(error))
  }
}

function* loadPeoples() {
  put(loadingPeoples)
}

function* peoplesSaga() {
  yield takeEvery(GET_PEOPLES, fetchPeoples)
  yield takeEvery(GET_AGENCIES_BY_COMPANY, fetchAgenciesByCompany)
  yield takeEvery(GET_PERSONS_BY_COMPANY, fetchPersonByCompany)
  yield takeEvery(GET_PERSONS_BY_AGENCY, fetchPersonByAgency)
  yield takeEvery(PEOPLES_LOADING, loadPeoples)
  yield takeEvery(CREATE_PEOPLES, createPeople)
  yield takeEvery(UPDATE_PEOPLES, updatePeople)
  yield takeEvery(DELETE_PEOPLES, deletePeople)
  yield takeEvery(GET_PEOPLES_USERS, fetchUsersByTenant)
  yield takeEvery(CREATE_LEAD, createNewLead)
}

export default peoplesSaga
