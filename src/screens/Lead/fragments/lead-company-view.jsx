import React, { useState, useEffect } from 'react'
import { Button, CardTitle, Table } from 'reactstrap'
import { useDispatch } from 'react-redux'
import ModalCreate from '../../Peoples/modalCreate'
import useLead from '../../../store/lead/hooks'
import clx from 'classnames'
import '../lead.css'
import {
  updatePeoples as onUpdatePeople,
  loadingPeoples as onLoadingPeoples,
} from '../../../store/peoples/actions'
import { useCategoryMultiSelector } from '../../../components/Common/CategoryMultiSelector/CategoryMultiSelectorHooks' // Importando o hook

export const LeadCompanyView = () => {
  const leadHooks = useLead()
  const { data: lead, refetch } = leadHooks.getLead()
  const [contactModal, setContactModal] = useState(false)
  const [toggleView, setToggleView] = useState(false)

  const dispatch = useDispatch()

  const updatePeople = (peopleId, payload) => {
    dispatch(onLoadingPeoples())
    dispatch(onUpdatePeople(peopleId, 'company', payload, refetch))
    toggleContactModal()
    refetch()
  }

  const toggleContactModal = (e) => {
    setContactModal(!contactModal)
  }

  const getContactIcon = (type) => {
    switch (type) {
      case 'email':
        return <i className="fas fa-envelope" style={{ marginRight: 10 }} />
      case 'cnpj':
        return <i className="fas fa-file-alt" style={{ marginRight: 10 }} />
      case 'tamanho':
        return <i className="fas fa-users" style={{ marginRight: 10 }} />
      case 'setor':
        return <i className="fas fa-map-pin" style={{ marginRight: 10 }} />
      default:
        return <i className="fas fa-envelope" style={{ marginRight: 10 }} />
    }
  }

  const { getData } = useCategoryMultiSelector()

  const {
    data: sectorsData,
    isLoading: isSectorsLoading,
    error: sectorsError,
    refetch: refetchSectors,
  } = getData('sectors')

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = getData('category_sector')

  const sectorKey = lead?.company?.sector
  const categoryKey = lead?.company?.sector+"|"+lead?.company?.category

  const categoryValue = categoriesData?.find(
    (category) => category.key === categoryKey
  )?.value || categoryKey

  const sectorValue = sectorsData?.find(
    (sector) => sector.key === sectorKey
  )?.value || sectorKey

  return (
    <>
      <div>
        <CardTitle
          className="mb-2 mt-4 "
          style={{
            fontSize: '12px',
            color: '#54398b',
            display: 'flex',
            justifyContent: 'space-between',
            cursor: 'pointer',
            alignItems: 'center',
          }}
          onClick={() => setToggleView(!toggleView)}
        >
          <div>Empresa</div>

          <div className="toggler">
            <i
              className={clx('fas', {
                'fa-chevron-up': toggleView,
                'fa-chevron-down': !toggleView,
              })}
            />
          </div>
        </CardTitle>

        <div style={{ display: !toggleView ? 'block' : 'none' }}>
          {!lead.company ? (
            <div>
              <Button color="link" onClick={toggleContactModal}>
                Clique aqui para cadastrar um nova agencia
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table className="table-nowrap mb-0">
                <tbody>
                  <tr>
                    <td>
                      <i
                        className="fas fa-pen-square"
                        style={{ marginRight: 10 }}
                      />
                      {lead.company?.name}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <i
                        className="fas fa-pen-square"
                        style={{ marginRight: 10 }}
                      />
                      {isSectorsLoading ? 'Carregando...' : sectorValue}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <i
                        className="fas fa-pen-square"
                        style={{ marginRight: 10 }}
                      />
                      {isCategoriesLoading ? 'Carregando...' : categoryValue}
                    </td>
                  </tr>
                  {lead.company?.documents?.map((contact, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          {getContactIcon(contact?.type)}
                          {contact?.value}
                        </td>
                      </tr>
                    )
                  })}
                  {lead.company?.contacts?.map((contact, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          {getContactIcon(contact?.type)}
                          {contact?.value === "" ? "---" : contact?.value}
                        </td>
                      </tr>
                    )
                  })}
                  {lead.company?.addresses?.map((address, index) => (
                    <tr key={index}>
                      <td>
                        <div className="mb-2">
                          <div style={{ fontWeight: '800' }}>
                            Endereço {address?.type}
                          </div>
                          <div className="mt-2">
                            <i
                              className="fas fa-home"
                              style={{ marginRight: 10 }}
                            />
                            {address?.address} - {address?.city} -{' '}
                            {address?.state} - {address?.zipcode}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      onClick={toggleContactModal}
                      style={{ cursor: 'pointer' }}
                    >
                      {lead.company && (
                        <>
                          <i
                            className="fa fa-pen fa-md"
                            onClick={toggleContactModal}
                            style={{ marginRight: 10 }}
                          />{' '}
                          Editar dados dessa empresa
                        </>
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
      <ModalCreate
        createPeople={() => {}}
        updatePeople={updatePeople}
        modal={contactModal}
        toggle={toggleContactModal}
        typeName={'Empresa'}
        isCreateLoading={false}
        editing={lead.company}
      />
    </>
  )
}

export default LeadCompanyView
