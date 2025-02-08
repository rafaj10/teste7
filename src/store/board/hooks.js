import { get, queryClient } from '../../helpers/api_helper'
import { getDefaultTenantUrl } from '../../helpers/backend_helper'
import { useQuery } from '@tanstack/react-query'
import qs from 'qs'

export const useBoard = () => {
  const parsed = qs.parse(window.location.search, { ignoreQueryPrefix: true })
  const boardId = parsed.board
  const tenant = getDefaultTenantUrl()

  const getUsersByTenants = () =>
    useQuery({
      queryKey: ['users/fetch'],
      queryFn: async () => {
        return await get(`${tenant}/users`)
      },
    })

  const getBoard = () =>
    useQuery({
      queryKey: ['board/fetch', boardId],
      queryFn: async () => {
        return await get(`${tenant}/boards/${boardId}`)
      },
    })

  const hasRequiredFields = ({ step }) => {
    const board = queryClient.getQueryData(['board/fetch', boardId])
    const currentStep = board?.steps?.find((s) => s._id === step)
    return currentStep?.fields?.length > 0
  }

  const getNextStep = ({ current }) => {
    const board = queryClient.getQueryData(['board/fetch', boardId])

    const currentStepIndex =
      board.steps?.findIndex((s) => s._id === current) ?? 0

    return (
      board.steps[currentStepIndex + 1]?._id ??
      board.steps[currentStepIndex]?._id
    )
  }

  const getStarterStep = () => {
    const board = queryClient.getQueryData(['board/fetch', boardId])
    return board.steps.find((step) => step.flags.starter)
  }

  const getWonStep = () => {
    const board = queryClient.getQueryData(['board/fetch', boardId])
    return board.steps.find((step) => step.flags.isWon)
  }

  const getLostStep = () => {
    const board = queryClient.getQueryData(['board/fetch', boardId])
    return board.steps.find((step) => step.flags.isLost)
  }

  const getRequiredFields = ({ step }) => {
    const board = queryClient.getQueryData(['board/fetch', boardId])
    const currentStep = board.steps?.find((s) => s._id === step)
    return currentStep?.fields ?? []
  }

  const getBoardFields = () => {
    const board = queryClient.getQueryData(['board/fetch', boardId])
    const steps = board?.steps ?? []
    const fields = steps.map((step) => step.fields).flat()
    return fields
  }

  return {
    getBoard,
    getUsersByTenants,
    hasRequiredFields,
    getNextStep,
    getRequiredFields,
    getBoardFields,
    getStarterStep,
    getWonStep,
    getLostStep,
  }
}

