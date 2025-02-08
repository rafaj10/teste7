import React, { useState, useEffect } from 'react'
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  Label,
  Input,
  FormFeedback,
  CardTitle,
  Button,
} from 'reactstrap'
import { Link, useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Spinners from '../../components/Common/Spinner'

import {
  getTasks as onGetTasks,
  addCardData as onAddCardData,
  updateCardData as onUpdateCardData,
  deleteKanban as OnDeleteKanban,
} from '../../store/tasks/actions'

//redux
import { useSelector, useDispatch } from 'react-redux'
import { createSelector } from 'reselect'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Breadcrumbs from '../../components/Common/Breadcrumb'
import { AddTeamMember } from '../../common/data'
import SimpleBar from 'simplebar-react'
import moment from 'moment'
import { ToastContainer } from 'react-toastify'

const TasksKanban = () => {
  document.title = '7stratos | Funil'
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [images, setImages] = useState([])

  const [isMenu, setisMenu] = useState(false)
  const [activeTab, setActiveTab] = useState('1')

  const options = [
    { value: 'AK', label: 'Alaska' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'CA', label: 'California' },
    { value: 'NV', label: 'Nevada' },
    { value: 'OR', label: 'Oregon' },
    { value: 'WA', label: 'Washington' },
  ]

  const selectOption = [
    { value: 'IA', label: 'Indicação' },
    { value: 'LI', label: 'Lista' },
    { value: 'LP', label: 'Landing Page' },
    { value: 'GA', label: 'Google' },
    { value: 'GA', label: 'Linkedin' },
    { value: 'GA', label: 'Insta' },
  ]

  const selectOptionProp = [
    { value: 'EU', label: 'André (Eu)' },
    { value: 'RA', label: 'Rafael Assis' },
    { value: 'NL', label: 'Nathalia Landin' },
    { value: 'CG', label: 'Claudio Gerreiro' },
    { value: 'CT', label: 'Cataria Santos' },
  ]

  const selectOptionPropFu = [
    { value: 'CC8', label: 'Lead' },
    { value: 'CC7', label: 'Em qualificação' },
    { value: 'CC6', label: 'Potenciais' },
    { value: 'CC5', label: 'Agendados' },
    { value: 'CC4', label: 'Reuniões' },
    { value: 'CC3', label: 'Propostas' },
    { value: 'CC2', label: 'Em negociação' },
    { value: 'CC1', label: 'Convertidos' },
  ]

  const selectOptionPropSe = [
    { value: 'CC8', label: 'Alimentação e Bebidas' },
    { value: 'CC7', label: 'Vestuário e calçados' },
    { value: 'CC6', label: 'Construção' },
    { value: 'CC5', label: 'Saúde' },
    { value: 'CC4', label: 'Educação' },
    { value: 'CC3', label: 'Financeiro' },
    { value: 'CC2', label: 'Serviços pessoais' },
    { value: 'CC1', label: 'Vendas e marketing' },
    { value: 'CC1', label: 'Entretenimento' },
  ]

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  const toggleMenu = () => {
    setisMenu(!isMenu)
  }

  const [modal, setModal] = useState(false)
  const toggle = () => {
    if (modal) {
      setModal(false)
      setImages([])
      setCard(null)
    } else {
      setModal(true)
    }
  }

  const selectTasksState = (state) => state.tasks
  const TasksKanbanProperties = createSelector(selectTasksState, (Tasks) => ({
    kanbanTasks: Tasks.tasks,
    loading: Tasks.loading,
  }))

  const { kanbanTasks, loading } = useSelector(TasksKanbanProperties)
  const [isLoading, setLoading] = useState(loading)
  useEffect(() => {
    dispatch(onGetTasks())
  }, [dispatch])

  const [cards, setCards] = useState()
  const [kanbanTasksCards, setKanbanTasksCards] = useState()

  useEffect(() => {
    setCards(kanbanTasks)
  }, [kanbanTasks])

  const onClickDelete = (card) => {
    // if (card && card.id) {
    //   dispatch(OnDeleteKanban(card.id))
    // }
    navigate('/lead')
  }

  const [isEdit, setIsEdit] = useState(false)
  const [card, setCard] = useState(null)
  const [toggleSwitch, settoggleSwitch] = useState(true)
  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      id: (card && card.cardId) || '',
      cardTitle: (card && card.cardTitle) || '',
      taskdesc: (card && card.taskdesc) || '',
      budget: (card && card.budget) || '',
      userImages: (card && card.userImages) || [],
      badgeText: (card && card.badgeText) || '',
    },
    validationSchema: Yup.object({
      cardTitle: Yup.string().required('Please Enter Your Job Title'),
      taskdesc: Yup.string().required('Please Enter Your Task Description'),
      budget: Yup.string().required('Please Enter Your budget'),
      badgeText: Yup.string().required('Please Enter Your Status'),
      userImages: Yup.array().required('Select at least one team member'),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedCards = {
          id: card ? card.id : 0,
          kanId: kanbanTasksCards,
          cardId: values.id,
          title: values.cardTitle,
          taskdesc: values.taskdesc,
          budget: values.budget,
          date: moment(new Date()).format('DD MMMM , YYYY'),
          badgeText: values.badgeText,
          badgeColor: values.badgeColor,
          userImages: values.userImages,
        }
        // update Job
        dispatch(onUpdateCardData(updatedCards))
        validation.resetForm()
      } else {
        const newCardData = {
          id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
          kanId: kanbanTasksCards,
          cardId: values['id'],
          title: values['cardTitle'],
          taskdesc: values['taskdesc'],
          budget: values['budget'],
          date: moment(new Date()).format('DD MMMM , YYYY'),
          userImages: values['userImages'],
          badgeText: values['badgeText'],
          badgeColor: values['badgeColor'],
        }
        dispatch(onAddCardData(newCardData))
        validation.resetForm()
      }
      toggle()
    },
  })

  const handleCardEdit = (arg, line) => {
    setModal(true)
    setCard(arg)

    let card = arg
    setCard({
      id: card.id,
      cardTitle: card.title,
      taskdesc: card.taskdesc,
      date: card.date,
      budget: card.budget,
      userImages: card.userImages,
      badgeText: card.badgeText,
      badgeColor: card.badgeColor,
    })

    setKanbanTasksCards(line.id)
    setIsEdit(true)

    toggle()
  }
  const handleImage = (image) => {
    const updatedImages = images.includes(image)
      ? images.filter((item) => item !== image)
      : [...images, image]

    setImages(updatedImages)
    validation.setFieldValue('userImages', updatedImages)
  }

  useEffect(() => {
    if (card) {
      setImages([...card?.userImages])
    }
  }, [card])

  const handleAddNewCard = (line) => {
    setCard('')
    setIsEdit(false)
    toggle()
    setKanbanTasksCards(line.id)
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return // If dropped outside a valid drop area, do nothing

    const { source, destination } = result
    // Reorder cards within the same card line
    if (source.droppableId === destination.droppableId) {
      const line = cards.find((line) => line.id === source.droppableId)
      const reorderedCards = Array.from(line.cards)
      const [movedCard] = reorderedCards.splice(source.index, 1)
      reorderedCards.splice(destination.index, 0, movedCard)

      const updatedLines = cards.map((line) => {
        if (line.id === source.droppableId) {
          return { ...line, cards: reorderedCards }
        }
        return line
      })

      setCards(updatedLines)
    } else {
      // Move card between different card lines
      const sourceLine = cards.find((line) => line.id === source.droppableId)
      const destinationLine = cards.find(
        (line) => line.id === destination.droppableId
      )
      const sourceCards = Array.from(sourceLine.cards)
      const destinationCards = Array.from(destinationLine.cards)
      const [movedCard] = sourceCards.splice(source.index, 1)
      destinationCards.splice(destination.index, 0, movedCard)

      const updatedLines = cards.map((line) => {
        if (line.id === source.droppableId) {
          return { ...line, cards: sourceCards }
        } else if (line.id === destination.droppableId) {
          return { ...line, cards: destinationCards }
        }
        return line
      })

      setCards(updatedLines)
    }
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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Prospecção" breadcrumbItem="Funil" />
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
                      <i className="mdi mdi-dots-vertical"></i>
                      Visualização
                    </DropdownToggle>
                    <DropdownMenu>
                      <li>
                        <DropdownItem href="#">Kanban</DropdownItem>
                      </li>
                      <li>
                        <DropdownItem href="#">Lista</DropdownItem>
                      </li>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <Link to="#!" className="btn btn-light me-1">
                    <i className="mdi mdi-filter"></i> Filtrar
                  </Link>
                  <Link to="/criar-cadencia" className="btn btn-light me-1">
                    <i className="mdi mdi-arrow-collapse-right"></i> Criar
                    Workflow
                  </Link>
                  <Link to="/importar-leads" className="btn btn-light me-1">
                    <i className="mdi mdi-application-import"></i> Importar
                    lista de leads
                  </Link>
                  <Link
                    to="#!"
                    onClick={() => setModal(true)}
                    className="btn btn-primary me-1"
                  >
                    <i className="mdi mdi-plus-box"></i> Criar Lead
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
          {isLoading ? (
            <Spinners setLoading={setLoading} />
          ) : (
            <div
              style={{
                width: 'auto',
                overflowX: 'scroll',
                display: 'flex',
                gap: '10px',
              }}
            >
              <DragDropContext onDragEnd={handleDragEnd}>
                {(cards || []).map((line) => (
                  <Col lg={3} key={line.id} style={{ maxWidth: '260px' }}>
                    <Card>
                      <div
                        style={{
                          height: '2px',
                          backgroundColor: line.columnColor,
                        }}
                      ></div>
                      <div style={{ height: '40px', backgroundColor: '#fff' }}>
                        <Row>
                          <Col xs="9">
                            <div
                              style={{ marginLeft: '10px', marginTop: '12px' }}
                            >
                              <span style={{ fontWeight: '600' }}>
                                {line.name} ({line.cards.length})
                              </span>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <CardBody style={{ backgroundColor: '#eaeaee' }}>
                        <Droppable
                          droppableId={line.id}
                          style={{ borderRadius: '5px' }}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {line.cards.map((card, index) => {
                                const badgeColor = getBadgeColor(card.badgeText)
                                return (
                                  <Draggable
                                    key={card.id}
                                    draggableId={card.id}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="card task-list"
                                      >
                                        <div className="task-box" id="uptask-1">
                                          <CardBody
                                            style={{
                                              backgroundColor: card.cardColor,
                                            }}
                                          >
                                            <UncontrolledDropdown className="float-end">
                                              <DropdownToggle
                                                className="arrow-none"
                                                tag="a"
                                                color="white"
                                              >
                                                <i className="mdi mdi-dots-vertical m-0 text-muted h5"></i>
                                              </DropdownToggle>
                                              <DropdownMenu className="dropdown-menu-end">
                                                <DropdownItem
                                                  className="edittask-details"
                                                  onClick={() =>
                                                    // handleCardEdit(card, line)
                                                    onClickDelete(card)
                                                  }
                                                >
                                                  Expandir detalhes
                                                </DropdownItem>
                                                <DropdownItem
                                                  className="deletetask"
                                                  onClick={() =>
                                                    onClickDelete(card)
                                                  }
                                                >
                                                  Ir para o lead
                                                </DropdownItem>
                                              </DropdownMenu>
                                            </UncontrolledDropdown>
                                            <div className="float-end ms-2">
                                              {card.badge && (
                                                <span
                                                  className={`bg-${card.badgeColor} badge bg-secondary font-size-10`}
                                                  id="task-status"
                                                >
                                                  {card.badgeText}
                                                </span>
                                              )}
                                            </div>
                                            <div>
                                              <h5 className="font-size-15">
                                                <Link
                                                  to="#"
                                                  className="text-dark"
                                                  id="task-name"
                                                >
                                                  {card.title}
                                                </Link>
                                              </h5>
                                              <p></p>
                                              <p className="text-muted font-size-11">
                                                <i className="fas fa-compress"></i>{' '}
                                                {card.tipo_empresa}
                                              </p>
                                              <p className="text-muted font-size-11">
                                                <i className="fas fa-address-card"></i>{' '}
                                                {card.contato_principal}
                                              </p>
                                              <p className="text-muted font-size-11">
                                                <i className="fas fa-pen-square"></i>{' '}
                                                {card.contato_principal_cargo}
                                              </p>
                                              <p className="text-muted font-size-11">
                                                <i className="fas fa-mail-bulk"></i>{' '}
                                                {card.contato_principal_email}
                                              </p>
                                              {/* <p className="text-muted">
                                                  <i className="fas fa-phone"></i> {card.contato_principal_cel}
                                                </p>
                                                <p className="text-muted">
                                                  <i className="fab fa-linkedin"></i> {card.contato_principal_social}
                                                </p>
                                                <p className="text-muted">
                                                  <i className="fas fa-map-marker-alt"></i> {card.localizacao}
                                                </p>
                                                <p className="text-muted">
                                                  <i className="fas fa-arrows-alt-v"></i> {card.tamanho}
                                                </p> */}
                                              <p className="text-muted font-size-11">
                                                <i className="fas fa-calendar-alt"></i>{' '}
                                                {card.ultima_interacao}
                                              </p>
                                            </div>
                                            {card.hasBudget && (
                                              <div className="text-end">
                                                <h5
                                                  className="font-size-15 mb-1"
                                                  id="task-budget"
                                                >
                                                  $ {card.budget}
                                                </h5>
                                                <p className="mb-0 text-muted">
                                                  Budget
                                                </p>
                                              </div>
                                            )}
                                          </CardBody>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                )
                              })}
                              {provided.placeholder}
                              {/* <div className="text-center d-grid">
                                  <Link
                                    to="#"
                                    className="btn btn-primary waves-effect waves-light addtask-btn"
                                    data-bs-toggle="modal"
                                    data-bs-target=".bs-example-modal-lg"
                                    data-id="#upcoming-task"
                                    onClick={() => handleAddNewCard(line)}
                                  >
                                    <i className="mdi mdi-plus me-1"></i> Add New
                                  </Link>
                                </div> */}
                            </div>
                          )}
                        </Droppable>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </DragDropContext>
            </div>
          )}
        </Container>
      </div>

      <Modal
        id="modalForm"
        isOpen={modal}
        toggle={toggle}
        centered={true}
        size="lg"
      >
        <ModalHeader
          toggle={toggle}
          style={{ backgroundColor: '#54398b', color: '#fff' }}
        >
          {!!isEdit ? 'Update Task' : 'Criar Lead'}
        </ModalHeader>
        <ModalBody style={{ backgroundColor: '#f0f0f0' }}>
          <Form
            onSubmit={(e) => {
              e.preventDefault()
              validation.handleSubmit()
              return false
            }}
          >
            <Row>
              <Col xs="12">
                {/* Dados básicos do lead */}
                <Card>
                  <CardBody>
                    <CardTitle className="mb-3">Informações do Lead</CardTitle>
                    <Row>
                      <Col sm="4">
                        <div className="mb-3">
                          <Label htmlFor="productname">Origem do lead</Label>
                          <Select
                            className="select2"
                            placeholder=""
                            options={selectOption}
                          />
                        </div>
                      </Col>
                      <Col sm="4">
                        <div className="mb-3">
                          <Label htmlFor="productname">
                            Proprietário do lead *
                          </Label>
                          <Select
                            className="select2"
                            placeholder=""
                            options={selectOptionProp}
                          />
                        </div>
                      </Col>
                      <Col sm="4">
                        <div className="mb-3">
                          <Label htmlFor="productname">Etapa do Funil *</Label>
                          <Select
                            className="select2"
                            placeholder=""
                            options={selectOptionPropFu}
                          />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>

                {/* Dados da empresa*/}
                <Card>
                  <CardBody>
                    <CardTitle>Empresa</CardTitle>
                    {/* <p className="card-title-desc mb-4">
                    Empresa na qual esse lead representa
                  </p> */}

                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="productname">Nome da empresa</Label>
                          <Input
                            id="productname"
                            name="productname"
                            type="text"
                            className="form-control"
                            // placeholder="Nome da empresa"
                          />
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="manufacturername">CEP</Label>
                          <Input
                            id="manufacturername"
                            name="manufacturername"
                            type="text"
                            className="form-control"
                            // placeholder="Manufacturer Name"
                          />
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="manufacturerbrand">Endereço</Label>
                          <Input
                            id="manufacturerbrand"
                            name="manufacturerbrand"
                            type="text"
                            className="form-control"
                            // placeholder="Manufacturer Brand"
                          />
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="price">Setor</Label>
                          <Select
                            className="select2"
                            placeholder=""
                            options={selectOptionPropSe}
                          />
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="manufacturerbrand">Site</Label>
                          <Input
                            id="manufacturerbrand"
                            name="manufacturerbrand"
                            type="text"
                            className="form-control"
                            // placeholder="Manufacturer Brand"
                          />
                        </div>
                      </Col>

                      <Col sm="6">
                        <div className="mb-3">
                          <Label className="control-label">CNPJ</Label>
                          {/* <select className="form-control select2">
                            <option>Select</option>
                            <option value="FA">Fashion</option>
                            <option value="EL">Electronic</option>
                          </select> */}
                          <Input
                            id="price"
                            name="price"
                            type="text"
                            className="form-control"
                            // placeholder="Price"
                          />
                        </div>
                        <div className="mb-3">
                          <Label className="control-label">Cidade</Label>
                          <Select
                            classNamePrefix="select2-selection"
                            placeholder=""
                            title="Country"
                            // options={options}
                            isMulti
                          />
                        </div>
                        <div className="mb-3">
                          <Label className="control-label">Estado</Label>
                          <Select
                            classNamePrefix="select2-selection"
                            placeholder=""
                            title="Country"
                            // options={options}
                            isMulti
                          />
                        </div>
                        {/* <div className="mb-3">
                          <Label htmlFor="productdesc">
                            Product Description
                          </Label>
                          <textarea
                            className="form-control mb-3"
                            id="productdesc"
                            rows="5"
                            placeholder="Product Description"
                          />
                        </div> */}
                        <div className="mb-3">
                          <Label htmlFor="price">Tamanho da empresa</Label>
                          <Select
                            className="select2"
                            placeholder=""
                            options={selectOption}
                          />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>

                {/* Dados da contato*/}
                <Card>
                  <CardBody>
                    <CardTitle>Dados do contato</CardTitle>
                    {/* <p className="card-title-desc mb-4">
                    Empresa na qual esse lead representa
                  </p> */}

                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="productname">Nome da contato</Label>
                          <Input
                            id="productname"
                            name="productname"
                            type="text"
                            className="form-control"
                            // placeholder="Product Name"
                          />
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="manufacturername">E-mail</Label>
                          <Input
                            id="manufacturername"
                            name="manufacturername"
                            type="text"
                            className="form-control"
                            // placeholder="Manufacturer Name"
                          />
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="manufacturerbrand">Telefone</Label>
                          <Input
                            id="manufacturerbrand"
                            name="manufacturerbrand"
                            type="text"
                            className="form-control"
                            // placeholder="Manufacturer Brand"
                          />
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="price">Linha de produtos</Label>
                          <Select
                            className="select2"
                            placeholder=""
                            options={selectOption}
                          />
                        </div>
                        <div className="mb-3">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="customSwitch2"
                            defaultChecked
                            onClick={(e) => {
                              settoggleSwitch(!toggleSwitch)
                            }}
                          />
                          <Label htmlFor="manufacturerbrand">
                            &nbsp;Contato estratégico?
                          </Label>
                        </div>
                      </Col>

                      <Col sm="6">
                        <div className="mb-3">
                          <Label className="control-label">Sobrenome</Label>
                          {/* <select className="form-control select2">
                            <option>Select</option>
                            <option value="FA">Fashion</option>
                            <option value="EL">Electronic</option>
                          </select> */}
                          <Input
                            id="price"
                            name="price"
                            type="text"
                            className="form-control"
                            // placeholder="Price"
                          />
                        </div>
                        <div className="mb-3">
                          <Label className="control-label">Cargo</Label>
                          <Select
                            classNamePrefix="select2-selection"
                            placeholder=""
                            title="Country"
                            // options={options}
                            isMulti
                          />
                        </div>
                        <div className="mb-3">
                          <Label className="control-label">Celular</Label>
                          <Select
                            classNamePrefix="select2-selection"
                            placeholder=""
                            title="Country"
                            // options={options}
                            isMulti
                          />
                        </div>
                        {/* <div className="mb-3">
                          <Label htmlFor="productdesc">
                            Product Description
                          </Label>
                          <textarea
                            className="form-control mb-3"
                            id="productdesc"
                            rows="5"
                            placeholder="Product Description"
                          />
                        </div> */}
                        <div className="mb-3">
                          <Label htmlFor="price">Linkedin</Label>
                          <Input
                            id="price"
                            name="price"
                            type="text"
                            className="form-control"
                            // placeholder="Price"
                          />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>

                <div
                  className="d-flex flex-wrap gap-2"
                  style={{ paddingBottom: '30px' }}
                >
                  <Button type="submit" color="primary">
                    Adicionar outro contato
                  </Button>
                </div>

                {/* Dados da agencia*/}
                <Card>
                  <CardBody>
                    <CardTitle>Agência</CardTitle>
                    {/* <p className="card-title-desc mb-4">
                    Empresa na qual esse lead representa
                  </p> */}

                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="productname">Nome da empresa</Label>
                          <Input
                            id="productname"
                            name="productname"
                            type="text"
                            className="form-control"
                            // placeholder="Product Name"
                          />
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="manufacturername">CEP</Label>
                          <Input
                            id="manufacturername"
                            name="manufacturername"
                            type="text"
                            className="form-control"
                            // placeholder="Manufacturer Name"
                          />
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="manufacturerbrand">Endereço</Label>
                          <Input
                            id="manufacturerbrand"
                            name="manufacturerbrand"
                            type="text"
                            className="form-control"
                            // placeholder="Manufacturer Brand"
                          />
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="price">Setor</Label>
                          <Select
                            className="select2"
                            placeholder=""
                            options={selectOptionPropSe}
                          />
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="manufacturerbrand">Site</Label>
                          <Input
                            id="manufacturerbrand"
                            name="manufacturerbrand"
                            type="text"
                            className="form-control"
                            // placeholder="Manufacturer Brand"
                          />
                        </div>
                      </Col>

                      <Col sm="6">
                        <div className="mb-3">
                          <Label className="control-label">CNPJ</Label>
                          {/* <select className="form-control select2">
                            <option>Select</option>
                            <option value="FA">Fashion</option>
                            <option value="EL">Electronic</option>
                          </select> */}
                          <Input
                            id="price"
                            name="price"
                            type="text"
                            className="form-control"
                            // placeholder="Price"
                          />
                        </div>
                        <div className="mb-3">
                          <Label className="control-label">Cidade</Label>
                          <Select
                            classNamePrefix="select2-selection"
                            placeholder=""
                            title="Country"
                            // options={options}
                            isMulti
                          />
                        </div>
                        <div className="mb-3">
                          <Label className="control-label">Estado</Label>
                          <Select
                            classNamePrefix="select2-selection"
                            placeholder=""
                            title="Country"
                            // options={options}
                            isMulti
                          />
                        </div>
                        {/* <div className="mb-3">
                          <Label htmlFor="productdesc">
                            Product Description
                          </Label>
                          <textarea
                            className="form-control mb-3"
                            id="productdesc"
                            rows="5"
                            placeholder="Product Description"
                          />
                        </div> */}
                        <div className="mb-3">
                          <Label htmlFor="price">Tamanho da empresa</Label>
                          <Select
                            className="select2"
                            placeholder=""
                            options={selectOption}
                          />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <CardTitle>Observações</CardTitle>
                    <Row>
                      <Col sm={12}>
                        <div className="mb-3">
                          <textarea
                            className="form-control"
                            id="metadescription"
                            rows="5"
                            // placeholder="Escreve algo ..."
                          />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col lg={20}>
                <div className="d-flex flex-wrap gap-2">
                  <Button type="submit" color="primary">
                    Criar lead
                  </Button>
                  <Button type="submit" color="secondary">
                    Cancelar
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>

      <ToastContainer />
    </React.Fragment>
  )
}

export default TasksKanban
