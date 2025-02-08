import { useQuery, useMutation } from '@tanstack/react-query'
import { get, post, del, put } from '../../helpers/api_helper'
import { getDefaultTenantUrl } from '../../helpers/backend_helper'

const useEmailTemplate = () => {
  const tenant = getDefaultTenantUrl()

  const getById = (id) => {
    return useQuery({
      queryKey: ['emailtemplate/getbyid', id],
      queryFn: async () => {
        return await get(`${tenant}/email_templates/${id}`)
      },
    })
  }

  const list = () => {
    return useQuery({
      queryKey: ['emailtemplate/list'],
      queryFn: async () => {
        const res = await get(`${tenant}/email_templates`)
        return res
      },
    })
  }

  const create = () => {
    return useMutation({
      mutationKey: ['emailtemplate/create'],
      mutationFn: async ({ ...payload }) => {
        const result = await post(`${tenant}/email_templates`, { ...payload })
        return result.data
      },
    })
  }

  const update = () => {
    return useMutation({
      mutationKey: ['emailtemplate/update'],
      mutationFn: async ({ id, ...payload }) => {
        const result = await put(`${tenant}/email_templates/${id}`, {
          ...payload,
        })
        return result.data
      },
    })
  }

  const remove = () => {
    return useMutation({
      mutationKey: ['emailtemplate/remove'],
      mutationFn: async (id) => {
        await del(`${tenant}/email_templates/${id}`)
      },
    })
  }

  return { create, update, remove, getById, list }
}

export { useEmailTemplate }
