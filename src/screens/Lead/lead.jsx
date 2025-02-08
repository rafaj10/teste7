import cn from 'classnames'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Label,
  NavItem,
  NavLink,
  Row,
} from 'reactstrap'
import Tour from 'reactour'
import withRouter from '../../components/Common/withRouter'
import { dateToViewAndHour } from '../../helpers/frontend_helper'
import { useBoard } from '../../store/board/hooks'
import useLead from '../../store/lead/hooks'
import { LeadAgencyView } from './fragments/lead-agency-view'
import { LeadCompanyView } from './fragments/lead-company-view'
import { LeadContactsView } from './fragments/lead-contacts-view'
import { LeadCurrentStepView } from './fragments/lead-current-step-view'
import { LeadCustomFields } from './fragments/lead-custom-fields'
import LeadFileUploadTabView from './fragments/lead-fileupload-tab-view'
import { LeadHistoricTabView } from './fragments/lead-historic-tab-view'
import { LeadMeetingsTabView } from './fragments/lead-meetings-tab-view'
import { LeadObservationsTabView } from './fragments/lead-observations-tab-view'
import { LeadRequiredStepActions } from './fragments/lead-required-step-actions'
import { LeadTasksTabView } from './fragments/lead-tasks-tab-view'
import LeadModalLost from './fragments/lead-modal-list'
import LeadModalWon from './fragments/lead-modal-won'
import './lead.css'
import ModalProposalCreate from './modalProposalCreate'
import Breadcrumbs from '/src/components/Common/Breadcrumb'

const TABS = {
  HISTORIC: 'historic',
  TASKS: 'tasks',
  OBSERVATIONS: 'observations',
  FILES: 'files',
  MEETINGS: 'meetings',
}

const Lead = ({ router }) => {
  document.title = 'Leads | 7stratos'

  const { id } = router.params
  const [activeTab, setActiveTab] = useState(TABS.HISTORIC)
  const [editOwnerMode, setEditOwnerMode] = useState(false)
  const [modal, setModal] = useState(false)
  const [modalLost, setModalLost] = useState({
    open: false,
    lead: undefined,
  })
  const [modalWon, setModalWon] = useState({
    open: false,
    lead: undefined,
  })
  const [isTourOpen, setIsTourOpen] = useState(false)

  const leadHooks = useLead()
  const boardHooks = useBoard()
  const { data: board } = boardHooks.getBoard()
  const {
    data: lead,
    isLoading: leadIsLoading,
    refetch: leadRefetch,
  } = leadHooks.getLead()
  const { data: usersByTenant } = boardHooks.getUsersByTenants()
  const { data: proposals } = leadHooks.getProposals()
  const updateStep = leadHooks.updateStep()

  const tourSteps = [
    {
      selector: '.breadcrumb',
      content: 'Aqui você pode navegar pelos leads e acessar diferentes seções.',
    },
    {
      selector: '.lead-owner',
      content: 'Aqui você pode transferir o lead para outro proprietário.',
    },
    {
      selector: '.strategic-contacts',
      content: 'Seção de contatos estratégicos do lead.',
    },
    {
      selector: '.non-strategic-contacts',
      content: 'Seção de outros contatos do lead.',
    },
    {
      selector: '.proposals-section',
      content: 'Seção onde você pode visualizar as propostas associadas ao lead.',
    },
    {
      selector: '.move-lead',
      content: 'Aqui você pode mover o lead para outras etapas.',
    },
    {
      selector: '.required-actions',
      content: 'Seção de ações necessárias para o lead.',
    },
    {
      selector: '.nav-tabs',
      content: 'Use estas abas para navegar pelas diferentes seções do lead, como Histórico, Tarefas, Observações e Reuniões.',
    },
  ]

  const toggleModalLost = () => {
    setModalLost({
      open: false,
      lead: undefined,
      value: undefined,
    })
  }

  const toggleModalWon = () => {
    setModalWon({
      open: false,
      lead: undefined,
      value: undefined,
    })
  }

  const toggle = () => {
    setModal(!modal)
  }

  const reloadForms = () => {
    leadRefetch()
  }

  const areRequiredFieldsPresent = (card, requiredFields) => {
    const missingFields = requiredFields.filter((field) => {
      if (field.type === 'has_one_internal_contact') {
        return !(card.contacts && card.contacts.length > 0)
      }
      if (field.type === 'has_one_internal_contact_estrategic') {
        return !(card.contacts && card.contacts.some(contact => contact.strategic === true));
      }
      if (field.type === 'has_one_internal_agenda') {
        return (!card.counters || card.counters.meetings <= 0);
      }
      if (field.type === 'has_one_internal_task') {
        return (!card.counters || card.counters.tasks <= 0);
      }
      return !card.customFields || !card.customFields[field.name]
    })
    return missingFields
  }

  const onChangeLeadStep = ({ value, label }) => {

    const leadId = id
    const step = value
    const steps = board?.steps

    // Encontre o step (coluna) de destino
    const destinationStep = board?.steps.find((s) => s._id === step)
    const sourceStep = leadHooks.getCurrentStep({ steps: board?.steps ?? [] })

    // Valide se o card pode mover para o step de destino baseado nos campos obrigatórios dos steps intermediários
    const sourceIndex = steps.findIndex((s) => s._id === sourceStep._id)
    const destinationIndex = steps.findIndex(
      (s) => s._id === destinationStep._id
    )

    // Verificar campos obrigatórios no step atual
    const sourceRequiredFields = sourceStep.fields.filter(
      (field) => field.required
    )
    const missingFieldsInSource = areRequiredFieldsPresent(
      lead,
      sourceRequiredFields
    )

    if (missingFieldsInSource.length > 0) {
      const missingFieldNames = missingFieldsInSource
        .map((field) => field.label || field.name)
        .join(', ')
      alert(
        `Movimentação inválida: campos obrigatórios ausentes em "${sourceStep.name}" - ${missingFieldNames}`
      )
      console.log(
        `Movimentação inválida: campos obrigatórios ausentes em "${sourceStep.name}" - ${missingFieldNames}`
      )
      return
    }

    if (sourceIndex < destinationIndex) {
      for (let i = sourceIndex + 1; i <= destinationIndex; i++) {
        const intermediateStep = steps[i]
        const requiredFields = intermediateStep.fields.filter(
          (field) => field.required
        )
        const missingFields = areRequiredFieldsPresent(lead, requiredFields)

        if (missingFields.length > 0) {
          // Se o step atual for o step de destino, ele deve ser permitido
          if (i === destinationIndex) {
            break
          }
          const missingFieldNames = missingFields
            .map((field) => field.label || field.name)
            .join(', ')
          alert(
            `Movimentação inválida: campos obrigatórios ausentes em "${intermediateStep.name}" - ${missingFieldNames}`
          )
          console.log(
            `Movimentação inválida: campos obrigatórios ausentes em "${intermediateStep.name}" - ${missingFieldNames}`
          )
          return
        }
      }
    }

    if (destinationStep.flags.isWon) {
      setModalWon({ open: true, lead, value })
    }

    if (destinationStep.flags.isLost) {
      setModalLost({ open: true, lead, value })
      return
    }

    updateStep.mutate(
      {
        id,
        step: value,
        board: board._id,
      },
      {
        onSuccess: () => {
          leadRefetch()
        },
      }
    )
  }

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  useEffect(() => {
    leadRefetch()
  }, [])

  const getPaymentTypeLabel = (type) => {
    if (type === 'pix') {
      return 'Pix'
    }

    if (type === 'boleto') {
      return 'Boleto'
    }

    if (type === 'credit_card') {
      return 'Cartão de Crédito'
    }

    return 'Não informado'
  }

  if (!lead) return 'Carregando lead...'
  if (!board) return 'Carregando board...'

  const currentStep = leadHooks.getCurrentStep({ steps: board?.steps ?? [] })

  return (
    <React.Fragment>
      <Tour
        steps={tourSteps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
        startAt={0}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Leads" breadcrumbItem={lead?.company.name} />
          <Row>
            <Col xl="3">
            {proposals && proposals.length > 0 && (
                <Card className="proposals-section">
                  <CardTitle>
                    <div className="title">
                      <span>Propostas</span>
                    </div>
                  </CardTitle>
                  <CardBody>
                    {proposals?.map((proposal, i) => {
                      return (
                        <div key={i} className="proposal-item">
                          <div>
                            <span>Nome: </span>
                            <span>{proposal.name}</span>
                          </div>
                          <div>
                            <span>Contato: </span>
                            <span>{proposal.contact?.name}</span>
                          </div>
                          <div>
                            <span>Temperatura: </span>
                            <span>{proposal.temperature}</span>
                          </div>
                          <div>
                            <span>Forma de pagamento: </span>
                            <span>
                              {getPaymentTypeLabel(proposal.paymentType)}
                            </span>
                          </div>
                          <div>
                            <span>Data de fechamento: </span>
                            <span>
                              {moment
                                .utc(proposal.closeDate)
                                .format('DD/MM/YYYY')}
                            </span>
                          </div>

                          <span className="section-title">Produtos</span>
                          {proposal?.products?.map((product, i) => {
                            return (
                              <div key={i} className="propostal-item">
                                <div>
                                  <span>Nome: </span>
                                  <span>{product._id.description}</span>
                                </div>
                                <div>
                                  <span>Valor: </span>
                                  <span style={{ fontWeight: 'bold' }}>
                                    {product?.price?.toLocaleString('pt-BR', {
                                      style: 'currency',
                                      currency: 'BRL',
                                    })}
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </CardBody>
                </Card>
              )}
              <Card>
                <CardBody>
                  <CardTitle
                    className="mb-2 lead-owner"
                    style={{ fontSize: '12px', color: '#54398b' }}
                  >
                    {editOwnerMode
                      ? 'Transferir lead para...'
                      : 'Proprietario do lead'}
                  </CardTitle>
                  <CardTitle className="mb-4">
                    <div
                      className="d-flex"
                      style={{ gap: 4, alignItems: 'center' }}
                    >
                      <Button
                        color="link"
                        onClick={() => {
                          setEditOwnerMode(!editOwnerMode)
                        }}
                      >
                        <i className="fa fa-pen fa-md" />
                      </Button>
                      {editOwnerMode ? (
                        <div style={{ width: '100%' }}>
                          <Select
                            classNamePrefix="select2-selection"
                            placeholder="Transferir lead para..."
                            value={{
                              value: lead.owner._id,
                              label: lead.owner.name,
                            }}
                            onChange={(option) => {
                              updateStep.mutate(
                                {
                                  id,
                                  board: board._id,
                                  owner: option.value,
                                },
                                {
                                  onSuccess: () => {
                                    setEditOwnerMode(false)
                                    leadRefetch()
                                  },
                                }
                              )
                            }}
                            options={usersByTenant?.map((user) => {
                              return {
                                value: user._id,
                                label: user.name,
                              }
                            })}
                          />
                        </div>
                      ) : (
                        <>
                          {!leadIsLoading ? (
                            lead.owner.name
                          ) : (
                            <i className="fa fa-spinner fa-spin" />
                          )}
                        </>
                      )}
                    </div>
                  </CardTitle>
                  <CardTitle
                    className="mb-2"
                    style={{ fontSize: '12px', color: '#54398b' }}
                  >
                    Origem do lead
                  </CardTitle>
                  <CardTitle className="mb-4">{lead.origin}</CardTitle>
                  <div className="mb-4 strategic-contacts">
                    <LeadContactsView
                      title="Contato estrategico"
                      type="strategicContacts"
                    />
                  </div>
                  <div className="non-strategic-contacts">
                    <LeadContactsView
                      title="Outros contatos"
                      type="nonStrategicContacts"
                    />
                  </div>
                  <LeadCompanyView />
                  <LeadAgencyView />
                  <div className="mt-4">
                    <LeadCustomFields />
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl="9">
              <Card>
                <div
                  className={cn('mt-4 move-lead', {
                    'mb-4': boardHooks.hasRequiredFields({
                      step: lead?.step?._id,
                    }),
                  })}
                  style={{ paddingLeft: 20 }}
                >
                  <LeadCurrentStepView isLate={leadHooks.isStepLate()} />
                  {leadHooks.isStepLate() && (
                    <div className="lead-duedate">
                      <span>
                        <i className="fa fa-exclamation-triangle" />{' '}
                        {moment(lead?.dueDate).fromNow()} na etapa
                      </span>
                      <span>
                        Última interação: {dateToViewAndHour(lead?.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>

                {
                  // PEGA O CURRENT STEP E FAZ OQ QUISER/COLOCA QLQR BOTAO ACAO
                }



{/*
                {!boardHooks.hasRequiredFields({ step: lead?.step?._id }) && ( */}
                  <Row>
                    <Col>
                      <CardBody>
                        <div>
                          <Label>Mover lead</Label>
                          <Select
                            classNamePrefix="select2-selection"
                            placeholder="Mover lead para etapa..."
                            onChange={onChangeLeadStep}
                            options={board.steps?.map((step) => {
                              return {
                                value: step._id,
                                label: step.name,
                              }
                            })}
                          />
                        </div>
                      </CardBody>
                    </Col>
                  </Row>
                {/* )} */}
              </Card>

              {(currentStep?.flags?.allowProposal || currentStep?.flags?.allowClose) && (
              <Card className="required-actions">
                  <CardBody>
                    <CardTitle className="mb-4">Ações possivéis</CardTitle>
                    {currentStep?.flags?.allowClose && (
                  <div
                    style={{
                      padding: 10,
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                    }}
                  >
                    <div>Você pode converter se preciso:</div>
                    <Button
                      size="sm"
                      color="success"
                      onClick={() => {
                        const wonStep = boardHooks.getWonStep()
                        onChangeLeadStep({ value: wonStep._id })
                      }}
                    >
                      Converter
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      onClick={() => {
                        const lostStep = boardHooks.getLostStep()
                        onChangeLeadStep({
                          value: lostStep._id,
                          label: 'Perdidos',
                        })
                      }}
                    >
                      Perdido
                    </Button>
                  </div>
                )}

                {currentStep?.flags?.allowProposal && (
                                    <div
                                    style={{
                                      padding: 10,
                                      display: 'flex',
                                      gap: 8,
                                      alignItems: 'center',
                                    }}
                                  >
                                    <div>Você pode criar uma proposta:</div>
                                    <Button
                                      size="sm"
                                      color="success"
                                      onClick={toggle}
                                    >
                                      Criar proposta
                                    </Button>
                                  </div>
                )}
                  </CardBody>
                </Card>
              )}

              {boardHooks.hasRequiredFields({ step: lead?.step?._id }) && (
                <Card className="required-actions">
                  <CardBody>
                    <CardTitle className="mb-4">Ações necessárias</CardTitle>
                    <LeadRequiredStepActions id={id} />
                  </CardBody>
                </Card>
              )}

              <Card>
                <CardBody>
                  <ul className="nav nav-tabs nav-tabs-custom">
                    <NavItem>
                      <NavLink
                        className={cn({
                          active: activeTab === TABS.HISTORIC,
                        })}
                        onClick={() => toggleTab(TABS.HISTORIC)}
                      >
                        Histórico
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={cn({ active: activeTab === TABS.TASKS })}
                        onClick={() => toggleTab(TABS.TASKS)}
                      >
                        Tarefas
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={cn({
                          active: activeTab === TABS.OBSERVATIONS,
                        })}
                        onClick={() => toggleTab(TABS.OBSERVATIONS)}
                      >
                        Observações
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={cn({
                          active: activeTab === TABS.MEETINGS,
                        })}
                        onClick={() => toggleTab(TABS.MEETINGS)}
                      >
                        Reuniões
                      </NavLink>
                    </NavItem>
                    {/* <NavItem>
                        <NavLink
                          className={cn({
                            active: activeTab === TABS.FILES,
                          })}
                          onClick={() => toggleTab(TABS.FILES)}
                        >
                          Arquivos
                        </NavLink>
                      </NavItem> */}
                  </ul>

                  <div>
                    <LeadTab activeTab={activeTab} type={TABS.TASKS}>
                      <LeadTasksTabView id={id} />
                    </LeadTab>
                    <LeadTab activeTab={activeTab} type={TABS.OBSERVATIONS}>
                      <LeadObservationsTabView id={id} />
                    </LeadTab>
                    <LeadTab activeTab={activeTab} type={TABS.MEETINGS}>
                      <LeadMeetingsTabView id={id} />
                    </LeadTab>
                    <LeadTab activeTab={activeTab} type={TABS.FILES}>
                      <LeadFileUploadTabView id={id} />
                    </LeadTab>
                    <LeadTab activeTab={activeTab} type={TABS.HISTORIC}>
                      <LeadHistoricTabView id={id} />
                    </LeadTab>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <ModalProposalCreate
        modal={modal}
        toggle={toggle}
        createPeople={() => {}}
        updatePeople={() => {}}
        typeName={''}
        isCreateLoading={false}
        editing={false}
      />

      <LeadModalLost config={modalLost} toggle={toggleModalLost} />
      <LeadModalWon config={modalWon} toggle={toggleModalWon} />
    </React.Fragment>
  )
}

function LeadTab({ activeTab, type, children }) {
  return <div className={cn({ hidden: activeTab !== type })}>{children}</div>
}

Lead.propTypes = {}

export default withRouter(Lead)
