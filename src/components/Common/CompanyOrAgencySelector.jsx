import React, { useState, useEffect, useCallback } from 'react'
import { Row } from 'reactstrap'
import DataListInput from 'react-datalist-input'
import debounce from 'lodash.debounce'
import 'react-datalist-input/dist/styles.css'
import { useSearchPeople } from '../../store/peoples/hook'

const CompanyOrAgencySelector = ({ type, onChange }) => {
  const [query, setQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const { data, isLoading } = useSearchPeople(type, query)

  const debouncedSetQuery = useCallback(
    debounce((value) => {
      setQuery(value)
    }, 1500),
    []
  )

  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel()
    }
  }, [debouncedSetQuery])

  useEffect(() => {
    if (selectedItem && selectedItem.value !== query) {
      setSelectedItem(null)
      if (onChange) {
        onChange(null)
      }
    }
  }, [query, selectedItem, onChange])

  const handleInputChange = (e) => {
    const value = e.target.value
    debouncedSetQuery(value)
  }

  const handleSelectChange = (selected) => {
    setSelectedItem(selected)
    if (onChange) {
      onChange(selected)
    }
    setQuery(selected.value) // Ensure input value is set to selected item
  }

  const formattedData =
    data?.map((item) => ({
      id: item._id,
      value: item.name,
      ...item
    })) || []

  return (
    <Row>
      <div className="col-md-10">
        <div style={{ position: 'relative' }} className="form-control input-color">
          <DataListInput
            placeholder="Digite para buscar..."
            style={{ borderColor: '#fff' }}
            items={formattedData}
            onInput={handleInputChange}
            onSelect={handleSelectChange}
            inputProps={{ disabled: isLoading, value: query,
              style: {
              border: 'none',
              boxShadow: 'none',
              outline: 'none',
              width: '100%',
              marginLeft: '-5px',
            }
            }}
          />
        </div>
      </div>
    </Row>
  )
}

export default CompanyOrAgencySelector
