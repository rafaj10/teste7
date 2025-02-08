import { Button, CardTitle, Table } from 'reactstrap'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import ModalCreate from '../../Peoples/modalCreate'
import useLead from '../../../store/lead/hooks'
import clx from 'classnames'
import '../lead.css'
import {
  createPeoples as onCreatePeople,
  updatePeoples as onUpdatePeople,
  loadingPeoples as onLoadingPeoples,
} from '../../../store/peoples/actions'

export const LeadAgencyView = () => {
  const leadHooks = useLead()
  const { data: lead, refetch } = leadHooks.getLead()
  const [contactModal, setContactModal] = useState(false)
  const [toggleView, setToggleView] = useState(false)

  const dispatch = useDispatch()

  const createPeople = (payload) => {
    dispatch(onLoadingPeoples())
    dispatch(onCreatePeople('agency', payload, false, lead, refetch))
    toggleContactModal()
  }

  const updatePeople = (peopleId, payload) => {
    dispatch(onLoadingPeoples())
    dispatch(onUpdatePeople(peopleId, 'agency', payload, refetch))
    toggleContactModal()
  }

  const toggleContactModal = () => {
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

  return (
    <>
      <div>
        <CardTitle
          className="mb-4"
          style={{
            marginTop: 15,
            fontSize: '12px',
            color: '#54398b',
            display: 'flex',
            justifyContent: 'space-between',
            cursor: 'pointer',
            alignItems: 'center',
          }}
          onClick={() => setToggleView(!toggleView)}
        >
          <div>Agencia</div>

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
          {!lead.agency ? (
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
                      {lead.agency?.name}
                    </td>
                  </tr>
                  {lead.agency?.contacts?.map((contact, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          {getContactIcon(contact?.type)}
                          {contact?.value}
                        </td>
                      </tr>
                    )
                  })}
                  {lead.agency?.addresses?.map((address, index) => (
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
                          Editar dados dessa agencia
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
        createPeople={createPeople}
        updatePeople={updatePeople}
        modal={contactModal}
        toggle={toggleContactModal}
        typeName={'Agencia'}
        isCreateLoading={false}
        editing={lead.agency}
        relation={lead.company}
      />
    </>
  )
}
