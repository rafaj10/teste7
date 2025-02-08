import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Button,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from 'reactstrap'
import Tour from 'reactour'
import withRouter from '../../components/Common/withRouter'
import Spinners from '../../components/Common/Spinner'
import {
  getBoardByIdReq,
  getBoardLeadsListReq,
} from '../../store/board/actions'
import BoardKanban from './fragments/BoardKanban'
import BoardList from './fragments/BoardList'
import { updateLeadStepReq } from '../../store/lead/actions'
//redux
import { useDispatch } from 'react-redux'
import Breadcrumbs from '../../components/Common/Breadcrumb'
import { ToastContainer } from 'react-toastify'
import { useBoardSelector } from '../../store/board/selectors'
import { FunilFilter } from './fragments/FunilFilter'
import LeadModalLost from '../Lead/fragments/lead-modal-list'
import LeadModalWon from '../Lead/fragments/lead-modal-won'

import {
  socketManager,
} from '../../socket'

const Funil = ({ router }) => {
  document.title = '7stratos | Funil'
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { id } = router.params
  const { steps, leadList, boardById } = useBoardSelector()
  const loadingBoardList = useBoardSelector().isLoading
  const [viewType, setViewType] = useState('kanban')
  const [firstSelected, setFirstSelected] = useState(false)

  const [filterModal, setFilterModal] = useState({ open: false })
  const [isTourOpen, setIsTourOpen] = useState(false)

  const [modalWon, setModalWon] = useState({
    open: false,
    lead: undefined,
  })

  const tourSteps = [
    {
      selector: '.breadcrumb',
      content: 'Aqui você pode navegar pelo dashboard e acessar diferentes seções.',
    },
    {
      selector: '.dropdown',
      content: 'Alterne entre visualizações de Kanban e Lista.',
    },
    {
      selector: '.btn-primary',
      content: 'Clique aqui para criar uma nova oportunidade ou lead.',
    },
    {
      selector: '.mdi-filter',
      content: 'Use este botão para filtrar as oportunidades e leads.',
    },
    {
      selector: '.board-content',
      content: 'Aqui você pode ver os leads e oportunidades em formato Kanban ou Lista.',
    },
  ]

  const toggleModalWon = () => {
    setModalWon({
      open: false,
      lead: undefined,
      value: undefined,
    })
  }

  useEffect(() => {
    dispatch(getBoardByIdReq(id))
    dispatch(getBoardLeadsListReq(id, null))

    queueMicrotask(() => {
      socketManager.emit('join', `board_${id}`)
      socketManager.on('step_changed', ({ lead, step }) => {
        dispatch(getBoardLeadsListReq(id, null))
      })
    })

    return () => {
      socketManager.emit('leave', `board_${id}`)
    }
  }, [router.params.id])

  const onClickDetails = (card) => {
    navigate(`/lead/${card._id}?board=${id}`)
  }

  const areRequiredFieldsPresent = (card, requiredFields) => {
    //TODOOOO
    const missingFields = requiredFields.filter((field) => {
      if (field.type === 'has_one_internal_contact') {
        return !(card.contacts && card.contacts.length > 0)
      }
      if (field.type === 'has_one_internal_contact_estrategic') {
        return !(card.contacts && card.contacts.some(contact => contact.strategic === true));
      }
      if (field.type === 'has_one_internal_agenda') {
        return !(card.counters && card.counters.meetings > 0);
      }
      if (field.type === 'has_one_internal_task') {
        return !(card.counters && card.counters.tasks > 0);
      }
      return !card.customFields || !card.customFields[field.name]
    })
    return missingFields
  }

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    // Verifique se o card está sendo movido dentro da mesma coluna
    if (destination.droppableId === source.droppableId) return

    const leadId = draggableId
    const step = destination.droppableId

    // Encontre o card que está sendo movido
    const card = leadList.find((lead) => lead._id === leadId)
    // Encontre o step (coluna) de destino
    const destinationStep = steps.find((s) => s._id === step)
    const sourceStep = steps.find((s) => s._id === source.droppableId)

    // Verifique se os tipos correspondem
    // if (card.type !== destinationStep.type) {
    //   alert('Movimentação inválida: tipos diferentes')
    //   console.log('Movimentação inválida: tipos diferentes')
    //   return
    // }

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
      card,
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
        const missingFields = areRequiredFieldsPresent(card, requiredFields)

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
      setModalWon({ open: true })
    }

    if (destinationStep.flags.isLost) {
      // TODO MODAL LOST
      // setModalWon({ open: true, lead, value })
      //return
    }

    // Tipos correspondem e validação dos campos obrigatórios passou, prossiga com a movimentação
    dispatch(
      updateLeadStepReq(
        {
          id: leadId,
          step: step,
          board: id,
        },
        () => {
          dispatch(getBoardByIdReq(id))
          dispatch(getBoardLeadsListReq(id, null))
        }
      )
    )
  }

  const getBadgeColor = (text) => {
    switch (text) {
      case 'Waiting':
        return 'secondary'
      case 'Approved':
        return 'primary'
      case 'Pending':
        return 'warning'
      default:
        return 'success'
    }
  }

  const handleSelect = (selected) => {
    setFirstSelected(true)
    setViewType(selected)
  }

  const handleOpenFilter = () => {
    setFilterModal({ open: !filterModal.open })
  }

  const handleApplyFilter = (filters) => {
    setFilterModal({ open: false }); // Fecha o modal de filtros
    console.log('HandleFilters === '+ JSON.stringify(filters))
    dispatch(getBoardLeadsListReq(id, filters)); // Dispara a ação com os filtros
  }

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
          <Breadcrumbs title="Funil" breadcrumbItem={boardById.name} />
          {loadingBoardList ? (
            <Spinners setLoading={loadingBoardList} />
          ) : (
            <Row>
              <Col lg="12">
                <div
                  className="d-flex align-items-center"
                  style={{ marginBottom: '20px' }}
                >
                  <div className="flex-shrink-0">
                    <UncontrolledDropdown className="dropdown d-inline-block me-1">
                      <DropdownToggle
                        type="menu"
                        className="btn btn-light"
                        id="dropdownMenuButton1"
                      >
                        <i
                          className={
                            !firstSelected
                              ? 'mdi mdi-dots-vertical'
                              : viewType === 'kanban'
                                ? 'mdi mdi-view-dashboard-outline'
                                : 'mdi mdi-format-list-bulleted'
                          }
                          style={{ marginRight: 8 }}
                        ></i>
                        {!firstSelected
                          ? 'Visualização'
                          : viewType === 'kanban'
                            ? 'Kanban'
                            : 'Lista'}
                      </DropdownToggle>
                      <DropdownMenu>
                        <li>
                          <DropdownItem
                            onClick={() => handleSelect('kanban')}
                            href="#"
                          >
                            Kanban
                          </DropdownItem>
                        </li>
                        {/* <li>
                          <DropdownItem
                            onClick={() => handleSelect('list')}
                            href="#"
                          >
                            Lista
                          </DropdownItem>
                        </li> */}
                      </DropdownMenu>
                    </UncontrolledDropdown>
                    {
                      boardById.type === "crm" ? (
                        <Link
                        to={`/lead/novo?board=${id}`}
                        className="btn btn-primary me-1"
                      >
                        <i className="mdi mdi-plus-box"></i> Criar Oportunidade
                      </Link>
                      ) : (
                        <>
                          <Link
                            to={`/lead/novo?board=${id}`}
                            className="btn btn-primary me-1"
                          >
                            <i className="mdi mdi-plus-box"></i> Criar Lead
                          </Link>
                          {/* <Link
                            to={`/importar-dados?q=funil&board=${id}`}
                            className="btn btn-secondary me-1"
                          >
                            <i className="mdi mdi-file-import"></i> Importar Leads
                          </Link> */}
                      </>
                      )
                    }
                    <Button onClick={handleOpenFilter}>
                      <i className="mdi mdi-filter"></i> Filtrar
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          )}
          <div
            className="board-content"
            style={{
              width: 'auto',
              overflowX: 'scroll',
              display: 'flex',
              gap: '10px',
            }}
          >
            {viewType === 'kanban' ? (
              <BoardKanban
                onDragEnd={handleDragEnd}
                steps={steps}
                onClickDetails={onClickDetails}
                leadList={leadList}
              />
            ) : (
              <BoardList
                steps={steps}
                onClickDetails={onClickDetails}
                leadList={leadList}
              />
            )}
          </div>
        </Container>
      </div>
      <ToastContainer />
      <FunilFilter
        isOpen={filterModal.open}
        toggle={() => setFilterModal({ ...filterModal, open: false })}
        onApplyFilter={handleApplyFilter}
        from={'lead'}
      />
      <LeadModalWon config={modalWon} toggle={toggleModalWon} />
    </React.Fragment>
  )
}

export default withRouter(Funil)
