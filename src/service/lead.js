import { del, get, post, put, postArray } from '../helpers/api_helper'
import * as helper from '../helpers/backend_helper'

export const getLeadDetailsById = ({ board, id }) => {
  const tenant = helper.getDefaultTenantUrl()
  return get(`${tenant}/boards/${board}/leads/${id}`)
}

export const getTasksByLeadId = ({ id }) => {
  const tenant = helper.getDefaultTenantUrl()
  return get(`${tenant}/leads/${id}/tasks`)
}

export const toggleTask = ({ id, taskId, ...payload }) => {
  const tenant = helper.getDefaultTenantUrl()
  return put(`${tenant}/leads/${id}/tasks/${taskId}`, {
    ...payload,
  })
}

export const createTask = (data) => {
  const tenant = helper.getDefaultTenantUrl()
  return post(`${tenant}/leads/${data.leadId}/tasks`, data)
}

export const getLeadObservations = ({ id }) => {
  const tenant = helper.getDefaultTenantUrl()
  return get(`${tenant}/leads/${id}/observations`)
}

export const createObservation = ({ id, ...data }) => {
  const tenant = helper.getDefaultTenantUrl()
  return post(`${tenant}/leads/${id}/observations`, data)
}

export const deleteTask = ({ taskId, leadId }) => {
  const tenant = helper.getDefaultTenantUrl()
  return del(`${tenant}/leads/${leadId}/tasks/${taskId}`)
}

export const getLeadMeetings = ({ id }) => {
  const tenant = helper.getDefaultTenantUrl()
  return get(`${tenant}/leads/${id}/meetings`)
}

export const createMeeting = ({ leadId, ...data }) => {
  const tenant = helper.getDefaultTenantUrl()
  return post(`${tenant}/leads/${leadId}/meetings`, data)
}

export const updateLeadStep = ({ id, board, ...data }) => {
  const tenant = helper.getDefaultTenantUrl()
  return put(`${tenant}/boards/${board}/leads/${id}`, { ...data })
}

export const updateContactsAll = ({ id, contacts }) => {
  const tenant = helper.getDefaultTenantUrl()
  return post(`${tenant}/leads/${id}/contacts`, { contacts: contacts })
}
