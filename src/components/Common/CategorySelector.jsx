import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { FormGroup, Input } from 'reactstrap'
import { getCategories } from '../../store/categories/actions'
import { useCategorySelector } from '../../store/categories/selectors'

const CategorySelector = ({ friendlyName, categoryType, setCategoryKey }) => {
  const dispatch = useDispatch()
  const { categories, loading } = useCategorySelector()
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    if (categoryType) {
      dispatch(getCategories(categoryType))
    }
  }, [dispatch, categoryType])

  useEffect(() => {
    setCategoryKey(selectedCategory)
  }, [selectedCategory, setCategoryKey])

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  return (
    <FormGroup>
      <Input
        type="select"
        id="categorySelect"
        onChange={handleCategoryChange}
        value={selectedCategory}
        disabled={loading}
      >
        <option value="">{friendlyName}</option>
        {categories.map((category) => (
          <option key={category.key} value={category.key}>
            {category.value}
          </option>
        ))}
      </Input>
    </FormGroup>
  )
}

export default CategorySelector
