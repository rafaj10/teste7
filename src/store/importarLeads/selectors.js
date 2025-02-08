import { useSelector } from 'react-redux'

export const useImportarLeadsSelector = () => {
  const data = useSelector(({ ImportarLeads }) => ImportarLeads.data)
  const loading = useSelector(({ ImportarLeads }) => ImportarLeads.loading)
  const error = useSelector(({ ImportarLeads }) => ImportarLeads.error)

  return { data, loading, error }
}
