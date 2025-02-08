export const GET_WORKFLOWS = 'GET_WORKFLOWS'
export const GET_WORKFLOWS_SUCCESS = 'GET_WORKFLOWS_SUCCESS'
export const CREATE_WORKFLOW = 'CREATE_WORKFLOW'
export const CREATE_WORKFLOW_SUCCESS = 'CREATE_WORKFLOW_SUCCESS'
export const UPDATE_WORKFLOW = 'UPDATE_WORKFLOW'
export const UPDATE_WORKFLOW_SUCCESS = 'UPDATE_WORKFLOW_SUCCESS'
export const DELETE_WORKFLOW = 'DELETE_WORKFLOW'
export const DELETE_WORKFLOW_SUCCESS = 'DELETE_WORKFLOW_SUCCESS'

export const getWorkflows = () => ({
  type: GET_WORKFLOWS,
})

export const createWorkflow = (workflow) => ({
  type: CREATE_WORKFLOW,
  payload: workflow,
})

export const updateWorkflow = (id, workflow) => ({
  type: UPDATE_WORKFLOW,
  payload: { id, workflow },
})

export const deleteWorkflow = (id) => ({
  type: DELETE_WORKFLOW,
  payload: id,
})
