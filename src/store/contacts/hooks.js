import { useQuery, useMutation } from '@tanstack/react-query'
import { get, post, del, put } from '../../helpers/api_helper'
import { getDefaultTenantUrl } from '../../helpers/backend_helper'

const useContact = () => {
  const tenant = getDefaultTenantUrl()

  const getById = (id) => {
    return useQuery({
      queryKey: ['contact/getbyid', id],
      queryFn: async () => {
        return await get(`${tenant}/people/${id}?type=person`)
      },
    })
  }

  const list = () => {
    return useQuery({
      queryKey: ['contacts/list'],
      queryFn: async () => {
        const res = await get(`${tenant}/people?type=person`)
        return res
      },
    })
  }

  const create = () => {
    return useMutation({
      mutationKey: ['contacts/create'],
      mutationFn: async ({ ...payload }) => {
        const result = await post(`${tenant}/people?type=person`, {
          ...payload,
        })
        return result.data
      },
    })
  }

  const update = () => {
    return useMutation({
      mutationKey: ['contacts/update'],
      mutationFn: async ({ id, ...payload }) => {
        const result = await put(`${tenant}/people/${id}?type=person`, {
          ...payload,
        })
        return result.data
      },
    })
  }

  const remove = () => {
    return useMutation({
      mutationKey: ['contacts/remove'],
      mutationFn: async (id) => {
        await del(`${tenant}/people/${id}?type=person`)
      },
    })
  }

  return { create, update, remove, getById, list }
}

export { useContact }
