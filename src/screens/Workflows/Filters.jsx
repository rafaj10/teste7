import React from 'react'
import { Row, Col, Input, Label } from 'reactstrap'

const Filters = ({ filters, setFieldValue }) => (
  <>
    <div className="mb-3">
      <Label className="form-label">Origens</Label>
      <Input
        type="select"
        name="filters.origins"
        value={filters.origins}
        onChange={(e) =>
          setFieldValue(
            'filters.origins',
            [].slice.call(e.target.selectedOptions).map((item) => item.value)
          )
        }
        multiple
      >
        {' '}
        <option value="1">Lista</option>
        <option value="2">Insta</option>
        <option value="3">Manual</option>
      </Input>
    </div>
    <div className="mb-3">
      <Label className="form-label">Setores</Label>
      <Input
        type="select"
        name="filters.sectors"
        value={filters.sectors}
        onChange={(e) =>
          setFieldValue(
            'filters.sectors',
            [].slice.call(e.target.selectedOptions).map((item) => item.value)
          )
        }
        multiple
      >
        <option value="2">Agrícola</option>
        <option value="3">Financeiro</option>
        <option value="4">Comercial</option>
      </Input>
    </div>
  </>
)

export default Filters
