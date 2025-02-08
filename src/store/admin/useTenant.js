import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { get, post } from '../../helpers/api_helper'

const useTenant = () => {
  const queryClient = useQueryClient()

  const list = () => {
    return useQuery({
      queryKey: ['tenants/list'],
      queryFn: async () => {
        const res = await get('/tenants')
        return res
      },
    })
  }

  const create = () => {
    return useMutation({
      mutationFn: async (newTenant) => {
        const res = await post('/tenants', newTenant)
        return res
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['tenants/list'])
      },
    })
  }

  return { list, create }
}

export { useTenant }
