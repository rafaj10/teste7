import React, { useState } from 'react'
import { Table, Input } from 'reactstrap'
import ListTh from './ListTh'

const BoardList = ({ onClickDetails, steps, leadList }) => {
  const [selectedLeads, setSelectedLeads] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedLeads([])
    } else {
      const allLeadIds = leadList.map((card) => card._id)
      setSelectedLeads(allLeadIds)
    }
    setSelectAll(!selectAll)
  }

  const handleSelectLead = (id) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(selectedLeads.filter((leadId) => leadId !== id))
    } else {
      setSelectedLeads([...selectedLeads, id])
    }
  }

  return (
    <>
      <Table>
        <thead>
          <tr>
            <ListTh>
              <Input
                type="checkbox"
                className="form-check-input"
                id="selectAll"
                name="selectAll"
                value={selectAll}
                onChange={handleSelectAll}
              />
            </ListTh>
            <ListTh>Lead</ListTh>
            <ListTh>Origem do lead</ListTh>
            <ListTh>Setor</ListTh>
            <ListTh>Etapa do funil</ListTh>
            <ListTh>
              <i className="fas fa-dollar-sign" style={{ marginRight: 8 }}></i>
              Valor da proposta
            </ListTh>
            <ListTh>Prazo</ListTh>
            <ListTh>
              <i className="fas fa-address-card" style={{ marginRight: 8 }}></i>
              Contato
            </ListTh>
            <ListTh>
              <i className="fas fa-envelope" style={{ marginRight: 8 }}></i>
              Email
            </ListTh>
            <ListTh>
              <i className="fas fa-phone" style={{ marginRight: 8 }}></i>
              Telefone
            </ListTh>
          </tr>
        </thead>
        <tbody>
          {leadList?.map((card, index) => {
            const getStrategicContantc = card.contacts.filter(
              (contact) => contact.strategic
            )
            const getStepColor = steps.find(
              (step) => step._id === card.step._id
            )

            const isSelected = selectedLeads.includes(card._id)

            return (
              <tr
                // onClick={() => onClickDetails(card)}
                style={{ width: '100%', cursor: 'pointer' }}
                key={index}
              >
                <td>
                  <Input
                    type="checkbox"
                    className="form-check-input"
                    id={`select-${card._id}`}
                    name={`select-${card._id}`}
                    value={isSelected ?? false}
                    checked={isSelected ? 'checked' : undefined}
                    defaultChecked={selectedLeads.includes(card._id) ?? false}
                    onChange={(e) => {
                      e.stopPropagation()
                      handleSelectLead(card._id)
                    }}
                  />
                </td>
                <td>{card?.title}</td>
                <td>{card?.origin}</td>
                <td>{card?.company?.alias}</td>
                <td
                  style={{
                    borderLeft: '4px solid',
                    borderLeftColor: getStepColor.color,
                  }}
                >
                  {card?.step?.name}
                </td>
                <td>...</td>
                <td>...</td>
                <td>{getStrategicContantc?.[0]?.person?.name}</td>
                <td>...</td>
                <td>...</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </>
  )
}

export default BoardList
