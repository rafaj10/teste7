import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledTooltip,
} from 'reactstrap'
import moment from 'moment/moment'
import TableContainer from '../../components/Common/TableContainer'
import Spinners from '../../components/Common/Spinner'
import Breadcrumbs from '../../components/Common/Breadcrumb'
import WorkflowModal from './WorkflowModal'
import {
  getWorkflows,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
} from '../../store/workflows/actions'
import { useWorkflowSelector } from '../../store/workflows/selectors'
import { ToastContainer } from 'react-toastify'
import verificationImg from '../../assets/images/verification-img.png'

const WorkflowList = () => {
  const dispatch = useDispatch()
  const { workflows, loading } = useWorkflowSelector()
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false) // Novo estado para o modal de confirmação
  const [workflowToDelete, setWorkflowToDelete] = useState(null) // Novo estado para armazenar o workflow a ser deletado

  useEffect(() => {
    dispatch(getWorkflows())
  }, [dispatch])

  const toggle = () => setModal(!modal)
  const toggleDeleteModal = () => setDeleteModal(!deleteModal) // Função para alternar o modal de confirmação

  const handleCreateWorkflow = (workflow) => {
    dispatch(createWorkflow(workflow))
    toggle()
  }

  const handleUpdateWorkflow = (id, updatedWorkflow) => {
    dispatch(updateWorkflow(id, updatedWorkflow))
    toggle()
  }

  const handleDeleteWorkflow = () => {
    dispatch(deleteWorkflow(workflowToDelete))
    toggleDeleteModal()
  }

  const onClickEdit = (workflow) => {
    setEditing(workflow)
    toggle()
  }

  const onClickDelete = (id) => {
    setWorkflowToDelete(id)
    toggleDeleteModal()
  }

  const columns = useMemo(
    () => [
      {
        Header: 'Título',
        accessor: 'title',
        Cell: ({ cell: { value }, row: { original } }) => (
          <h5 className="font-size-14 mb-1">
            <Link
              className="text-dark"
              to="#"
              onClick={() => onClickEdit(original)}
            >
              {value}
            </Link>
          </h5>
        ),
      },
      {
        Header: 'Tarefas',
        accessor: 'tasks',
        Cell: ({ cell: { value } }) => (
          <div>
            {value.map((task, index) => (
              <div key={index}>- {task.title}</div>
            ))}
          </div>
        ),
      },
      {
        Header: 'Data de criação',
        accessor: 'criacao',
        filterable: true,
        Cell: (cellProps) => {
          return (
            <>
              <p className="font-size-14 mb-1">
                {moment(cellProps.row.original.createdAt).format(
                  'DD/MM/YYYY HH:mm'
                )}
              </p>
            </>
          )
        },
      },
      {
        Header: 'Ações',
        Cell: ({ row: { original } }) => (
          <div className="d-flex gap-3">
            <i
              className="mdi mdi-pencil font-size-18"
              id="edittooltip"
              style={{ cursor: 'pointer' }}
              onClick={() => onClickEdit(original)}
            />
            <UncontrolledTooltip placement="top" target="edittooltip">
              Editar
            </UncontrolledTooltip>
            <i
              className="mdi mdi-delete font-size-18"
              style={{ color: 'red', cursor: 'pointer' }}
              id="deletetooltip"
              onClick={() => onClickDelete(original._id)}
            />
            <UncontrolledTooltip placement="top" target="deletetooltip">
              Excluir
            </UncontrolledTooltip>
          </div>
        ),
      },
    ],
    []
  )

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Lista" breadcrumbItem="Workflows" />
          <Row>
            <Col lg="12">
              <div
                className="d-flex align-items-center"
                style={{ marginBottom: '20px' }}
              >
                <div className="flex-shrink-0">
                  <Button
                    color="primary"
                    onClick={() => {
                      setEditing(null)
                      toggle()
                    }}
                  >
                    <i className="mdi mdi-plus-box"></i> Adicionar Workflow
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
          {loading ? (
            <Spinners />
          ) : workflows.length === 0 ? (
            <Row className="justify-content-center mt-lg-5">
              <Col xl="5" sm="8">
                <Card>
                  <CardBody>
                    <div className="text-center">
                      <Row className="justify-content-center">
                        <Col lg="10">
                          <h4 className="mt-4 fw-semibold">
                            Opa, nada aqui...
                          </h4>
                          <p className="text-muted mt-3">
                            Ainda não temos nenhum registro de workflow por
                            aqui, você pode adicionar clicando no botão de "+"
                            acima.
                          </p>
                        </Col>
                      </Row>
                      <Row className="justify-content-center mt-5 mb-2">
                        <Col sm="6" xs="8">
                          <div>
                            <img
                              src={verificationImg}
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      isPagination={true}
                      columns={columns}
                      data={workflows}
                      isGlobalFilter={false}
                      isAddUserList={false}
                      isShowingPageLength={false}
                      iscustomPageSizeOptions={false}
                      customPageSize={8}
                      tableClass="table align-middle table-nowrap table-hover"
                      theadClass="table-light"
                      paginationDiv="col-sm-12 col-md-7"
                      pagination="pagination pagination-rounded justify-content-end mt-4"
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>
      <ToastContainer />
      {modal && (
        <WorkflowModal
          isOpen={modal}
          toggle={toggle}
          createWorkflow={handleCreateWorkflow}
          updateWorkflow={handleUpdateWorkflow}
          editing={editing}
        />
      )}
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Confirmar Exclusão</ModalHeader>
        <ModalBody>Tem certeza que deseja excluir este workflow?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDeleteWorkflow}>
            Excluir
          </Button>{' '}
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  )
}

export default WorkflowList
