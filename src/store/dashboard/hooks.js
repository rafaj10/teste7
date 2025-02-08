import { get } from '../../helpers/api_helper'
import { getDefaultTenantUrl } from '../../helpers/backend_helper'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useDashboard = () => {
  const tenant = getDefaultTenantUrl()

  const getDashboardInfo = () =>
    useQuery({
      queryKey: ['dashboard_counters/fetch'],
      queryFn: async () => {
        return await get(`${tenant}/dashboards`)
      },
    })

  const getDashboardInfoWithBoard = () =>
    useMutation({
      mutationKey: ['dashboard_with_board/fetch'],
      mutationFn: async (boardId) => {
        return await get(`${tenant}/dashboards?board=${boardId}`)
      },
    })

  const getBoardList = () =>
    useMutation({
      mutationKey: ['dashboard_board_list/fetch'],
      mutationFn: async () => {
        return await get(`${tenant}/boards`)
      },
    })

  return {
    getDashboardInfo,
    getDashboardInfoWithBoard,
    getBoardList,
  }
}
