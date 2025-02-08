import { useSelector } from 'react-redux'

export const useCategorySelector = () => {
  const categories =
    useSelector(({ Categories }) => Categories.categories) || []
  const loading = useSelector(({ Categories }) => Categories.loading)
  const error = useSelector(({ Categories }) => Categories.error)
  return { categories, loading, error }
}
