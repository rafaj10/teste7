import React, { useState, useEffect } from 'react'
import { FormGroup, Input } from 'reactstrap'
import { useCategoryMultiSelector } from './CategoryMultiSelectorHooks'

const SectorAndCategorySelector = ({ onChange, initialSector, initialCategory }) => {
  const { getData } = useCategoryMultiSelector()

  const [sectors, setSectors] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedSector, setSelectedSector] = useState(initialSector || '')
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || '')
  const [loadingSectors, setLoadingSectors] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(false)

  const { data: sectorData, isLoading: sectorLoading } = getData('sectors')
  const {
    data: categoryData,
    isLoading: categoryLoading,
    refetch: fetchCategories,
  } = getData('category_sector')

  useEffect(() => {
    if (sectorData) {
      setSectors(sectorData)
      setLoadingSectors(sectorLoading)
    }
  }, [sectorData, sectorLoading])

  useEffect(() => {
    if (selectedSector && categoryData) {
      const filteredCategories = categoryData.filter((category) =>
        category.key.startsWith(`${selectedSector}|`)
      )
      setCategories(filteredCategories)
      setLoadingCategories(categoryLoading)
    }
  }, [selectedSector, categoryData, categoryLoading])

  useEffect(() => {
    setSelectedSector(initialSector)
    setSelectedCategory(initialCategory)
  }, [initialSector, initialCategory])

  const handleSectorChange = (e) => {
    const sector = e.target.value
    setSelectedSector(sector)
    setSelectedCategory('')
    if (sector) {
      fetchCategories()
    }
    if (onChange) {
      onChange({ sector, category: '' })
    }
  }

  const handleCategoryChange = (e) => {
    const category = e.target.value
    console.log(category)
    setSelectedCategory(category)
    if (onChange) {
      onChange({ sector: selectedSector, category })
    }
  }

  return (
    <>
      <FormGroup>
        <Input
          type="select"
          id="sectorSelect"
          onChange={handleSectorChange}
          value={selectedSector}
          disabled={loadingSectors}
        >
          <option value="">Selecione o setor</option>
          {sectors.map((sector) => (
            <option key={sector.key} value={sector.key}>
              {sector.value}
            </option>
          ))}
        </Input>
      </FormGroup>
      {selectedSector && (
        <FormGroup>
          <Input
            type="select"
            id="categorySelect"
            onChange={handleCategoryChange}
            value={selectedCategory}
            disabled={!selectedSector || loadingCategories}
          >
            <option key="sec_cat" value="">Seleciona uma categoria</option>
            {categories.map((category) => (
              <option key={category.key} value={category.key}>
                {category.value}
              </option>
            ))}
          </Input>
        </FormGroup>
      )}
    </>
  )
}

export default SectorAndCategorySelector
