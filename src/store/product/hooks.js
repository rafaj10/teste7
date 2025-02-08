import { useQuery, useMutation } from '@tanstack/react-query'
import { get, post, del, put } from '../../helpers/api_helper'
import { getDefaultTenantUrl } from '../../helpers/backend_helper'

const useProduct = () => {
  const tenant = getDefaultTenantUrl()

  const getById = (id) => {
    return useQuery({
      queryKey: ['product/getbyid', id],
      queryFn: async () => {
        return await get(`${tenant}/products/${id}`)
      },
    })
  }

  const list = () => {
    return useQuery({
      queryKey: ['products/list'],
      queryFn: async () => {
        const res = await get(`${tenant}/products`)
        return res
      },
    })
  }

  const create = () => {
    return useMutation({
      mutationKey: ['products/create'],
      mutationFn: async ({ ...payload }) => {
        const result = await post(`${tenant}/products`, { ...payload })
        return result.data
      },
    })
  }

  const update = () => {
    return useMutation({
      mutationKey: ['products/update'],
      mutationFn: async ({ id, ...payload }) => {
        const result = await put(`${tenant}/products/${id}`, {
          ...payload,
        })
        return result.data
      },
    })
  }

  const remove = () => {
    return useMutation({
      mutationKey: ['products/remove'],
      mutationFn: async (id) => {
        await del(`${tenant}/products/${id}`)
      },
    })
  }

  return { create, update, remove, getById, list }
}

export { useProduct }
