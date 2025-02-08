export const IMPORT_LEADS_REQUEST = 'IMPORT_LEADS_REQUEST'
export const IMPORT_LEADS_SUCCESS = 'IMPORT_LEADS_SUCCESS'
export const IMPORT_LEADS_FAILURE = 'IMPORT_LEADS_FAILURE'
export const CONFIRM_IMPORT_LEADS = 'CONFIRM_IMPORT_LEADS'

export const importLeadsRequest = (file) => ({
  type: IMPORT_LEADS_REQUEST,
  payload: file,
})

export const importLeadsSuccess = (data) => ({
  type: IMPORT_LEADS_SUCCESS,
  payload: data,
})

export const importLeadsFailure = (error) => ({
  type: IMPORT_LEADS_FAILURE,
  payload: error,
})

export const confirmImportLeads = (leads) => ({
  type: CONFIRM_IMPORT_LEADS,
  payload: leads,
})
