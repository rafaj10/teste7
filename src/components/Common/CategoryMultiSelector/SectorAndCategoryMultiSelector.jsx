import React, { useState, useEffect } from 'react'
import { useCategoryMultiSelector } from './CategoryMultiSelectorHooks'
import { FormGroup, Input, Label, FormText } from 'reactstrap'
import './CategoryMultiSelector.css'

const SectorAndCategoryMultiSelector = ({ onChange }) => {
  const { getData } = useCategoryMultiSelector()

  const [sectors, setSectors] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedSector, setSelectedSector] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
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

  const handleSectorChange = (e) => {
    const sector = e.target.value
    if (selectedSector === sector) {
      setSelectedSector('')
      setCategories([])
    } else {
      setSelectedSector(sector)
      setSelectedCategories([]) // Reset selected categories when sector changes
      fetchCategories()
    }
  }

  const handleCategoryChange = (e) => {
    const category = e.target.name
    const isChecked = e.target.checked
    const updatedCategories = isChecked
      ? [...selectedCategories, category]
      : selectedCategories.filter((c) => c !== category)
    setSelectedCategories(updatedCategories)
    if (onChange) {
      onChange({ sector: selectedSector, categories: updatedCategories })
    }
  }

  return (
    <div>
      <FormGroup tag="fieldset">
        <Label for="sectorSelect">Selecione o Setor</Label>
        {loadingSectors ? (
          <FormText>Loading...</FormText>
        ) : (
          sectors.map((sector) => (
            <FormGroup check key={sector.key}>
              <Label check>
                <Input
                  type="checkbox"
                  name="sector"
                  value={sector.key}
                  checked={selectedSector === sector.key}
                  onChange={handleSectorChange}
                />
                {sector.value}
              </Label>
            </FormGroup>
          ))
        )}
      </FormGroup>
      {selectedSector && (
        <FormGroup>
          <Label>Categorias</Label>
          <div className="category-container">
            {loadingCategories ? (
              <div>Loading...</div>
            ) : categories.length === 0 ? (
              <div>Nenhum registro encontrado...</div>
            ) : (
              categories.map((category) => (
                <div key={category.key} className="category-item">
                  <div className="form-check">
                    <Input
                      type="checkbox"
                      className="form-check-input"
                      id={category.key}
                      name={category.key}
                      checked={selectedCategories.includes(category.key)}
                      onChange={handleCategoryChange}
                    />
                    <label className="form-check-label" htmlFor={category.key}>
                      {category.value}
                    </label>
                  </div>
                </div>
              ))
            )}
          </div>
        </FormGroup>
      )}
    </div>
  )
}

export default SectorAndCategoryMultiSelector
