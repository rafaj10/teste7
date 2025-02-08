import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { get, post, put } from '../../helpers/api_helper'

const useUser = (tenantId) => {
  const queryClient = useQueryClient()

  const list = () => {
    return useQuery({
      queryKey: ['users/list', tenantId],
      queryFn: async () => {
        const res = await get(`/tenants/${tenantId}/users`)
        return res
      },
      enabled: !!tenantId, // só faz a requisição se o tenantId estiver disponível
    })
  }

  const create = () => {
    return useMutation({
      mutationFn: async (newUser) => {
        const res = await post('/users', newUser)
        return res
      },
      onSuccess: async (data) => {
        await post(`/tenants/${tenantId}/users`, { user: data._id })
        queryClient.invalidateQueries(['users/list', tenantId])
      },
    })
  }

  const updateRoles = () => {
    return useMutation({
      mutationFn: async ({ userId, roles }) => {
        const res = await put(`/tenants/${tenantId}/users/${userId}`, {
          roles,
          permissions: [],
        })
        return res
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['users/list', tenantId])
      },
    })
  }

  return { list, create, updateRoles }
}

export { useUser }
