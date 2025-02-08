import { GET_WORKFLOWS_SUCCESS, CREATE_WORKFLOW_SUCCESS } from './actions'

const initialState = {
  workflows: [],
  loading: true,
}

const workflowsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_WORKFLOWS_SUCCESS:
      return { ...state, workflows: action.payload, loading: false }
    case CREATE_WORKFLOW_SUCCESS:
      return { ...state, workflows: [...state.workflows, action.payload] }
    default:
      return state
  }
}

export default workflowsReducer
