import { get, post, put, del } from '../helpers/api_helper'
import * as helper from '../helpers/backend_helper'

const workflowService = {
  getWorkflows: async () => {
    const tenant = helper.getDefaultTenantUrl()
    const response = await get(`${tenant}/workflows`)
    return response
  },
  createWorkflow: async (workflow) => {
    const tenant = helper.getDefaultTenantUrl()
    const response = await post(`${tenant}/workflows`, workflow)
    return response
  },
  updateWorkflow: async (id, workflow) => {
    const tenant = helper.getDefaultTenantUrl()
    const response = await put(`${tenant}/workflows/${id}`, workflow)
    return response
  },
  deleteWorkflow: async (id) => {
    const tenant = helper.getDefaultTenantUrl()
    const response = await del(`${tenant}/workflows/${id}`)
    return response
  },
}

export default workflowService
