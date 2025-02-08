import { useQuery, useMutation } from '@tanstack/react-query'
import { get, post } from '../../helpers/api_helper'
import { getDefaultTenantUrl } from '../../helpers/backend_helper'

export const useNotification = () => {
  const tenant = getDefaultTenantUrl()

  const getNotificationCounter = () =>
    useQuery({
      queryKey: ['notifications_counter'],
      queryFn: async () => {
        return await get(`${tenant}/notifications/count`)
      },
    })

  const getNotifications = () =>
    useQuery({
      queryKey: ['notifications'],
      queryFn: async () => {
        return await get(`${tenant}/notifications`)
      },
    })

  const readNotification = () =>
    useMutation({
      mutationKey: ['readNotification'],
      mutationFn: async (id) => {
        return await post(`${tenant}/notifications/${id}/read`)
      },
    })

  return {
    getNotifications,
    readNotification,
    getNotificationCounter,
  }
}

