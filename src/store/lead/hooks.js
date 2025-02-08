import { useParams } from 'react-router-dom'
import { get, post, del, queryClient, put } from '../../helpers/api_helper'
import { getDefaultTenantUrl } from '../../helpers/backend_helper'
import { useQuery, useMutation } from '@tanstack/react-query'
import qs from 'qs'

const useLead = () => {
  const parsed = qs.parse(window.location.search, { ignoreQueryPrefix: true })
  const boardId = parsed.board

  const { id } = useParams()

  const tenant = getDefaultTenantUrl()

  const getLead = () =>
    useQuery({
      queryKey: ['lead/fetch', boardId, id],
      queryFn: async () => {
        return await get(`${tenant}/boards/${boardId}/leads/${id}`)
      },
    })

  const getHistories = (id) =>
    useQuery({
      queryKey: ['lead_histories/fetch', id],
      queryFn: async () => {
        return await get(`${tenant}/leads/${id}/histories`)
      },
    })

  const getLeadTasks = (id) =>
    useQuery({
      queryKey: ['lead_tasks/fetch', id],
      queryFn: async () => {
        if (!id) return Promise.resolve([])
        const result = await get(`${tenant}/leads/${id}/tasks`)
        return result ?? []
      },
    })

  const getLeadMeetings = (id) =>
    useQuery({
      queryKey: ['lead_meetings/fetch', id],
      queryFn: async () => {
        if (!id) return Promise.resolve([])
        const result = await get(`${tenant}/leads/${id}/meetings`)
        return result ?? []
    },
  })

  const toggleTask = () =>
    useMutation({
      mutationKey: ['tasks/toggle'],
      mutationFn: async ({ id, taskId, ...payload }) => {
        const result = await put(`${tenant}/leads/${id}/tasks/${taskId}`, {
          ...payload,
        })
        return result.data
      },
    })

  const deleteTask = () =>
    useMutation({
      mutationKey: ['tasks/delete'],
      mutationFn: async ({ taskId, leadId }) => {
        return await del(`${tenant}/leads/${leadId}/tasks/${taskId}`)
      },
    })

  const updateFields = () =>
    useMutation({
      mutationKey: ['lead_fields/update'],
      mutationFn: async ({ id, fields }) => {
        const result = await post(`${tenant}/leads/${id}/fields`, {
          fields,
        })
        return result.data
      },
    })

  const updateStep = () =>
    useMutation({
      mutationKey: ['lead_step/update'],
      mutationFn: async (payload) => {
        const result = await put(
          `${tenant}/boards/${boardId}/leads/${id}`,
          payload
        )
        return result.data
      },
    })

  const createOrUpdateTask = () =>
    useMutation({
      mutationKey: ['tasks/create'],
      mutationFn: async ({ _id, ...payload }) => {
        if (!_id) {
          const result = await post(
            `${tenant}/leads/${payload.leadId}/tasks`,
            payload
          )
          return result.data
        }

        const result = await put(
          `${tenant}/leads/${payload.leadId}/tasks/${_id}`,
          payload
        )

        return result.data
      },
    })

  const createProposal = () =>
    useMutation({
      mutationKey: ['proposals/create'],
      mutationFn: async (payload) => {
        const result = await post(`${tenant}/leads/${id}/proposals`, payload)
        return result.data
      },
    })

  const getProposals = () =>
    useQuery({
      queryKey: ['proposals/fetch', id],
      queryFn: async () => {
        return await get(`${tenant}/leads/${id}/proposals`)
      },
    })

  const getCurrentStep = ({ steps }) => {
    const lead = queryClient.getQueryData(['lead/fetch', boardId, id])
    return steps.find((step) => step._id === lead?.step?._id)
  }

  const isStepLate = () => {
    const lead = queryClient.getQueryData(['lead/fetch', boardId, id])
    const dueDate = lead?.dueDate

    if (!dueDate) return false

    const now = new Date()
    const due = new Date(dueDate)

    return now > due
  }

  const getProducts = () =>
    useQuery({
      queryKey: ['products/fetch'],
      queryFn: async () => {
        return await get(`${tenant}/products`)
      },
    })

  const registerLostReason = () =>
    useMutation({
      mutationKey: ['lead_lost_reason/register'],
      mutationFn: async ({ id, board, reason, observation }) => {
        return await post(`${tenant}/boards/${board}/leads/${id}/lost_reason`, {
          reason,
          observation,
        })
      },
    })

  const updateStratgic = () =>
    useMutation({
      mutationKey: ['lead_strategic/update'],
      mutationFn: async ({ id, contactId }) => {
        return await put(
          `${tenant}/leads/${id}/contacts/${contactId}/strategic`
        )
      },
    })

  return {
    updateFields,
    getCurrentStep,
    getHistories,
    getLead,
    updateStep,
    isStepLate: isStepLate,
    getProducts,
    createProposal,
    getProposals,
    createOrUpdateTask,
    getLeadTasks,
    toggleTask,
    deleteTask,
    registerLostReason,
    updateStratgic,
    resetLeadQuery: () => {
      queryClient.resetQueries({ queryKey: ['lead/fetch', boardId, id] })
      queryClient.invalidateQueries()
    },
  }
}

export default useLead
