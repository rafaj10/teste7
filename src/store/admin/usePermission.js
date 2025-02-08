import { useQuery } from '@tanstack/react-query'
import { get } from '../../helpers/api_helper'
import { getDefaultTenantUrl } from '../../helpers/backend_helper'

export const usePermission = () => {
  const tenantUrl = getDefaultTenantUrl()

  const list = () =>
    useQuery({
      queryKey: ['permissions'],
      queryFn: () => get(`${tenantUrl}/permissions`),
    })

  return { list }
}
