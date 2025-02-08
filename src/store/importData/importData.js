import { useMutation } from '@tanstack/react-query'
import { post } from '../../helpers/api_helper'
import { getDefaultTenantUrl } from '../../helpers/backend_helper'

const useImportData = () => {
  const tenant = getDefaultTenantUrl()

  const importDataMutation = useMutation({
    mutationKey: ['import/importData'],
    mutationFn: async ({ type, ...payload }) => {
      console.log('Type:', type)
      console.log('Payload:', JSON.stringify(payload))
      const result = await post(`${tenant}/people?type=${type}`, payload)
      console.log('Result:', JSON.stringify(result))
      return result
    },
    onError: (error) => {
      console.error('Error during import:', error)
    },
  })

  const addRelationMutation = useMutation({
    mutationKey: ['addRelation'],
    mutationFn: async ({ id_company, people, description }) => {
      const url = `${tenant}/people/${id_company}/relations`
      const payload = { people, description }
      const result = await post(url, payload)
      return result
    },
    onError: (error) => {
      console.error('Error adding relation:', error)
    },
  })

  return {
    importData: importDataMutation.mutateAsync,
    addRelation: addRelationMutation.mutateAsync,
  }
}

export { useImportData }
