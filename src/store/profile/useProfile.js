import { useMutation, useQueryClient } from '@tanstack/react-query'
import { post } from '../../helpers/api_helper'

const useProfile = () => {
  const queryClient = useQueryClient()

  const changePassword = () => {
    return useMutation({
      mutationFn: async ({ password, newPassword }) => {
        const response = await post('/users/change_password', {
          password,
          newPassword,
        })
        return response
      },
      onSuccess: () => {
      },
      onError: (error) => {
      },
    })
  }

  // Você pode adicionar outras funções relacionadas ao perfil aqui, se necessário

  return {
    changePassword,
    // Outras funções podem ser exportadas aqui
  }
}

export { useProfile }
