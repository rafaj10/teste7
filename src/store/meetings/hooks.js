import { useQuery, useMutation } from '@tanstack/react-query'
import { get, post } from '../../helpers/api_helper'
import { getDefaultTenantUrl } from '../../helpers/backend_helper'

export const useMeetings = () => {
  const tenant = getDefaultTenantUrl()

  const getMeetings = () =>
    useQuery({
      queryKey: ['meeting/fetch'],
      queryFn: async () => {
        const response = await get(`${tenant}/meetings`)
        return response
      },
    })

  const createMeeting = () =>
    useMutation({
      mutationKey: ['meeting/create'],
      mutationFn: async (data) => {
        const response = await post(`${tenant}/meetings`, data)
        return response
      },
    })

  return {
    getMeetings,
    createMeeting,
  }
}

