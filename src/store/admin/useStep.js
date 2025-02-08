import { useMutation, useQueryClient } from '@tanstack/react-query'
import { get, post, put, del } from '../../helpers/api_helper'
import { getDefaultTenantUrl } from '../../helpers/backend_helper'

export const useStep = (tenantId, boardId) => {
  const tenantUrl = getDefaultTenantUrl(tenantId)
  const queryClient = useQueryClient()

  const create = () =>
    useMutation({
      mutationFn: (payload) =>
        post(`${tenantUrl}/boards/${boardId}/steps`, payload),
      onSuccess: () => queryClient.invalidateQueries(['boards', tenantId]),
    })

  const update = () =>
    useMutation({
      mutationFn: ({ stepId, payload }) =>
        put(`${tenantUrl}/boards/${boardId}/steps/${stepId}`, payload),
      onSuccess: () => queryClient.invalidateQueries(['boards', tenantId]),
    })

  const remove = () =>
    useMutation({
      mutationFn: (stepId) =>
        del(`${tenantUrl}/boards/${boardId}/steps/${stepId}`),
      onSuccess: () => queryClient.invalidateQueries(['boards', tenantId]),
    })

  return { create, update, remove }
}

