import { useQuery } from '@tanstack/react-query'
import { get } from '../../helpers/api_helper'
import { getDefaultTenantUrl } from '../../helpers/backend_helper'

export const useSearchPeople = (type, query) => {
  const tenant = getDefaultTenantUrl()

  return useQuery({
    queryKey: ['searchPeople', type, query],
    queryFn: async () => {
      const data = await get(`${tenant}/people?type=${type}&name=${query}`)
      return data
    },
    enabled: !!query,
  })
}
