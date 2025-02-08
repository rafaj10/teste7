import { call, put, takeLatest } from 'redux-saga/effects'
import { IMPORT_LEADS_REQUEST, CONFIRM_IMPORT_LEADS } from './types'
import { importLeadsSuccess, importLeadsFailure } from './actions'
import { readExcelFile } from '../../service/importarLeadsService'
import {
  createCompany,
  createContact,
  createLead,
} from '../../service/leadsService'
import * as helper from '../../helpers/backend_helper'
import { toast } from 'react-toastify'

function* importLeadsSaga(action) {
  try {
    const jsonData = yield call(readExcelFile, action.payload)
    yield put(importLeadsSuccess(jsonData))
  } catch (error) {
    yield put(importLeadsFailure(error.message))
  }
}

function* confirmImportLeadsSaga(action) {
  try {
    const { formattedLeads, boardId, stepId } = action.payload

    if (!Array.isArray(formattedLeads)) {
      throw new Error('formattedLeads is not iterable')
    }

    const userId = helper.getLoggedInUser()?._id

    for (let lead of formattedLeads) {
      // Criação da empresa
      const companyResponse = yield call(createCompany, lead.company)
      const companyId = companyResponse._id
      toast.success(`Empresa ${lead.company.name} cadastrada com sucesso!`)

      let contactId = null
      if (lead.contact) {
        const contactResponse = yield call(createContact, {
          ...lead.contact,
          relations: [{ _id: companyId, type: 'company', description: '' }],
        })
        contactId = contactResponse._id
        toast.success(`Contato ${lead.contact.name} cadastrado com sucesso!`)
      }

      // Criação do lead
      const leadData = {
        step: stepId,
        company: companyId,
        agency: '',
        contacts: contactId
          ? [
              {
                person: contactId,
                ref: companyId,
                strategic: true,
              },
            ]
          : [],
        owner: userId,
        origin: 'lista',
        title: '',
      }

      yield call(createLead, boardId, leadData)
      toast.success(
        `Lead para empresa ${lead.company.name} cadastrado com sucesso!`
      )
    }

    yield put(importLeadsSuccess(formattedLeads))
  } catch (error) {
    yield put(importLeadsFailure(error.message))
  }
}

export default function* importarLeadsSaga() {
  yield takeLatest(IMPORT_LEADS_REQUEST, importLeadsSaga)
  yield takeLatest(CONFIRM_IMPORT_LEADS, confirmImportLeadsSaga)
}
