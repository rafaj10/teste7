import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { get, post, put, del } from '../../helpers/api_helper'

const useBoard = (tenantId) => {
  const queryClient = useQueryClient()

  const list = () => {
    return useQuery({
      queryKey: ['boards/list', tenantId],
      queryFn: async () => {
        const res = await get(`/tenants/${tenantId}/boards`)
        return res
      },
      enabled: !!tenantId,
    })
  }

  const create = () => {
    return useMutation({
      mutationFn: async (newBoard) => {
        const res = await post(`/tenants/${tenantId}/boards`, newBoard)
        return res
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['boards/list', tenantId])
      },
    })
  }

  const update = () => {
    return useMutation({
      mutationFn: async ({ boardId, updatedBoard }) => {
        const res = await put(
          `/tenants/${tenantId}/boards/${boardId}`,
          updatedBoard
        )
        console.log('UP +++++++++')
        console.log(boardId)
        console.log(JSON.stringify(updatedBoard))
        return res
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['boards/list', tenantId])
      },
    })
  }

  const remove = () => {
    return useMutation({
      mutationFn: async (boardId) => {
        await del(`/tenants/${tenantId}/boards/${boardId}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['boards/list', tenantId])
      },
    })
  }

  const listSteps = (boardId) => {
    return useQuery({
      queryKey: ['steps/list', boardId],
      queryFn: async () => {
        const res = await get(`/tenants/${tenantId}/boards/${boardId}/steps`)
        return res
      },
      enabled: !!boardId,
    })
  }

  const getStep = (boardId, stepId) => {
    return useQuery({
      queryKey: ['board/step', tenantId, boardId, stepId],
      queryFn: async () => {
        const res = await get(
          `/tenants/${tenantId}/boards/${boardId}/steps/${stepId}`
        )
        return res
      },
      enabled: !!tenantId && !!boardId && !!stepId,
    })
  }

  const addStep = () => {
    return useMutation({
      mutationFn: async ({ boardId, ...newStep }) => {
        const res = await post(
          `/tenants/${tenantId}/boards/${boardId}/steps`,
          newStep
        )
        return res
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['boards/list', tenantId])
      },
    })
  }

  const updateStep = () => {
    return useMutation({
      mutationFn: async ({ boardId, stepId, ...updatedStep }) => {
        const res = await put(
          `/tenants/${tenantId}/boards/${boardId}/steps/${stepId}`,
          updatedStep
        )
        return res
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['boards/list', tenantId])
      },
    })
  }

  const deleteStep = () => {
    return useMutation({
      mutationFn: async ({ boardId, stepId }) => {
        await del(`/tenants/${tenantId}/boards/${boardId}/steps/${stepId}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['boards/list', tenantId])
      },
    })
  }

  return {
    list,
    create,
    update,
    remove,
    listSteps,
    getStep,
    addStep,
    updateStep,
    deleteStep,
  }
}

export { useBoard }
