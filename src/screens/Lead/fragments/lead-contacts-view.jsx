import { Fragment, useState } from 'react'
import {
  Button,
  CardTitle,
  Table,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from 'reactstrap'
import { useDispatch } from 'react-redux'
import ModalCreateContact from '../../Peoples/modalCreateContact'
import useLead from '../../../store/lead/hooks'
import clx from 'classnames'
import '../lead.css'
import {
  createPeoples as onCreatePeople,
  updatePeoples as onUpdatePeople,
  loadingPeoples as onLoadingPeoples,
} from '/src/store/peoples/actions'
import Spinners from '../../../components/Common/Spinner'

export const LeadContactsView = ({ title, type }) => {
  const [toggleView, setToggleView] = useState(false)
  const [contactModal, setContactModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState(false)
  const [selectedPeopleToRelation, setSelectedPeopleToRelation] = useState(null)
  const [drp_primary1, setDrp_primary1] = useState(false)

  const leadHooks = useLead()
  const { data: lead, refetch } = leadHooks.getLead()
  const { mutateAsync: updateStrategic, isPending: isUpdatingStratgic } =
    leadHooks.updateStratgic()

  const dispatch = useDispatch()

  const createPeople = (payload) => {
    dispatch(onLoadingPeoples())
    dispatch(onCreatePeople('person', payload, false, lead, refetch))
    toggleContactModal()
  }

  const updatePeople = (peopleId, payload) => {
    dispatch(onLoadingPeoples())
    dispatch(onUpdatePeople(peopleId, 'person', payload, refetch)) // TODO CALLBACK
    toggleContactModal()
  }

  const toggleContactModal = () => {
    setContactModal(!contactModal)
  }

  const nonStrategicContacts = lead?.contacts?.filter(
    (contact) => !contact?.strategic
  )

  const strategicContacts = lead?.contacts?.filter(
    (contact) => contact?.strategic
  )

  const handleContact = async (contact) => {
    await updateStrategic({ id: lead._id, contactId: contact.person._id })
    refetch()
  }

  const getContactIcon = (type) => {
    console.log("-->" + type)
    switch (type) {
      case 'email':
        return <i className="fas fa-envelope" style={{ marginRight: 10 }} />
      case 'sobrenome':
        return <i className="fas fa-address-book" style={{ marginRight: 10 }} />
      case 'datanascimento':
        return <i className="fas fa-address-card" style={{ marginRight: 10 }} />
      case 'cargo':
        return <i className="fas fa-money-bill-alt" style={{ marginRight: 10 }} />
      case 'telefone':
        return <i className="fas fa-phone" style={{ marginRight: 10 }} />
      case 'celular':
          return <i className="fas fa-phone" style={{ marginRight: 10 }} />
      case 'linkedin':
          return <i className="fas fa-star" style={{ marginRight: 10 }} />
      default:
        return <i className="fas fa-envelope" style={{ marginRight: 10 }} />
    }
  }

  const leadInfo =
    type === 'strategicContacts' ? strategicContacts : nonStrategicContacts

  return (
    <>
      <div>
        <CardTitle
          className="mb-2"
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
          <div>{title}</div>

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
          {strategicContacts.length === 0 && type === 'strategicContacts' && (
            <div>
              <p>Voce precisa marcar algum contato como estratégico.</p>
            </div>
          )}

          <div className="table-responsive">
            <Table responsive>
              <tbody>
                {leadInfo?.map((contact, index) => (
                  <Fragment key={index}>
                    <tr>
                      <td>
                        <h5
                          style={{
                            gap: 8,
                            display: 'flex',
                            padding: 0,
                            margin: 0,
                          }}
                        >
                          {contact?.person?.name}
                          <button
                            disabled={type === 'strategicContacts'}
                            style={{
                              border: 0,
                              background: 'transparent',
                              color: '#000',
                            }}
                            onClick={() => handleContact(contact)}
                          >
                            {isUpdatingStratgic ? (
                              <Spinner size="sm" color="primary" />
                            ) : (
                              <i
                                className={clx('bx', {
                                  'bxs-pin': contact.strategic,
                                  'bx-pin': !contact.strategic,
                                })}
                              />
                            )}
                          </button>
                        </h5>
                      </td>
                    </tr>
                    {contact?.person?.contacts?.filter(a => a !== "").map((cc, ii) => {
                      return (
                        <tr key={ii}>
                          <td>
                            {getContactIcon(cc?.type)}
                            {cc?.value === "" ? "---" : cc?.value}
                          </td>
                        </tr>
                      )
                    })}
                    <tr>
                      <td>
                        <i
                          className="fas fa-building"
                          style={{ marginRight: 10 }}
                        />
                        {contact?.ref?.name}
                      </td>
                    </tr>
                    <tr>
                      <td
                        onClick={() => {
                          setSelectedPeopleToRelation(null)
                          setSelectedContact(contact.person)
                          toggleContactModal()
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <i
                          className="fa fa-pen fa-md"
                          onClick={() => {
                            setSelectedPeopleToRelation(null)
                            setSelectedContact(contact.person)
                            toggleContactModal()
                          }}
                          style={{ marginRight: 10 }}
                        />{' '}
                        Editar dados desse contato
                      </td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </Table>
          </div>

          {type === 'nonStrategicContacts' && (
            <div className="btn-group">
              <ButtonDropdown
                isOpen={drp_primary1}
                toggle={() => setDrp_primary1(!drp_primary1)}
              >
                <Button id="caret" color="primary">
                  Criar contato para
                </Button>
                <DropdownToggle caret color="primary">
                  <i className="mdi mdi-chevron-down" />
                </DropdownToggle>
                <DropdownMenu>
                  {lead.company && (
                    <DropdownItem
                      onClick={() => {
                        setSelectedPeopleToRelation(lead.company)
                        setSelectedContact(false)
                        toggleContactModal()
                      }}
                    >
                      {lead.company.name}
                    </DropdownItem>
                  )}

                  {lead.agency && (
                    <DropdownItem
                      onClick={() => {
                        setSelectedPeopleToRelation(lead.agency)
                        setSelectedContact(false)
                        toggleContactModal()
                      }}
                    >
                      {lead.agency.name}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </ButtonDropdown>
            </div>
          )}
        </div>
      </div>
      <ModalCreateContact
        createPeople={createPeople}
        updatePeople={updatePeople}
        modal={contactModal}
        toggle={toggleContactModal}
        typeName={'Contato'}
        isCreateLoading={false}
        editing={selectedContact}
        relation={selectedPeopleToRelation}
      />
    </>
  )
}
