import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { get, post, put, del } from '../../helpers/api_helper'

const useRole = (tenantId) => {
  const queryClient = useQueryClient()

  const list = () => {
    return useQuery({
      queryKey: ['roles', tenantId],
      queryFn: async () => {
        const res = await get(`/tenants/${tenantId}/roles`)
        return res
      },
    })
  }

  const listPermissions = () => {
    return useQuery({
      queryKey: ['permissions'],
      queryFn: async () => {
        const res = await get('/permissions')
        return res
      },
    })
  }

  const create = () => {
    return useMutation({
      mutationFn: async (newRole) => {
        const res = await post(`/tenants/${tenantId}/roles`, newRole)
        return res
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['roles', tenantId])
      },
    })
  }

  const update = () => {
    return useMutation({
      mutationFn: async (updatedRole) => {
        const res = await put(
          `/tenants/${tenantId}/roles/${updatedRole._id}`,
          updatedRole
        )
        return res
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['roles', tenantId])
      },
    })
  }

  const remove = () => {
    return useMutation({
      mutationFn: async (roleId) => {
        await del(`/tenants/${tenantId}/roles/${roleId}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['roles', tenantId])
      },
    })
  }

  return { list, listPermissions, create, update, remove }
}

export { useRole }
