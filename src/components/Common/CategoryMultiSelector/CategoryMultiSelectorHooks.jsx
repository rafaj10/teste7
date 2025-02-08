import { useQuery } from '@tanstack/react-query'
import { get } from '../../../helpers/api_helper'
import { getDefaultTenantUrl } from '../../../helpers/backend_helper'

export const useCategoryMultiSelector = () => {
  const tenant = getDefaultTenantUrl()

  const getAgencies = () =>
    useQuery({
      queryKey: ['getAgencies'],
      queryFn: async () => {
        const data = await get(`${tenant}/people?type=agency`)
        return data
      },
    })

  const getData = (type) =>
    useQuery({
      queryKey: ['getCategoryMultiSelector', type],
      queryFn: async () => {
        // const data = await get(`${tenant}/categories/${type}`) // todo no futuro categories so do tenant
        const data = await get(`categories/${type}`)
        return data
      },
    })

  return {
    getData,
    getAgencies,
  }
}

