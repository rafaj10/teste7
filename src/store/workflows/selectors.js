import { useSelector } from 'react-redux'

export const useWorkflowSelector = () => {
  const workflows = useSelector(({ Workflows }) => Workflows.workflows)
  const loading = useSelector(({ Workflows }) => Workflows.loading)
  return { workflows, loading }
}
