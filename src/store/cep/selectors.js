import { useSelector } from 'react-redux'

export const useCepSelector = () => {
  const cepData = useSelector(({ Cep }) => Cep.data)
  const loading = useSelector(({ Cep }) => Cep.loading)
  const error = useSelector(({ Cep }) => Cep.error)

  return { cepData, loading, error }
}
