import { post } from '../helpers/api_helper'
import * as helper from '../helpers/backend_helper'

export const createCompany = (company) => {
  const tenant = helper.getDefaultTenantUrl()
  return post(`${tenant}/people?type=company`, company)
}

export const createContact = (contact) => {
  const tenant = helper.getDefaultTenantUrl()
  return post(`${tenant}/people?type=person`, contact)
}

export const createLead = (boardId, lead) => {
  const tenant = helper.getDefaultTenantUrl()
  return post(`${tenant}/boards/${boardId}/leads`, lead)
}
