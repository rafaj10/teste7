import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap'
import TableContainer from '../../components/Common/TableContainer'
import { useBoard } from '../../store/admin/useBoard'
import BoardForm from './components/BoardForm'
import Swal from 'sweetalert2'

const BoardsTab = ({ tenantId }) => {
  const { data, isLoading } = useBoard(tenantId).list()
  const createBoard = useBoard(tenantId).create()
  const updateBoard = useBoard(tenantId).update()
  const removeBoard = useBoard(tenantId).remove()
  const createStep = useBoard(tenantId).addStep()
  const updateStep = useBoard(tenantId).updateStep()
  const deleteStep = useBoard(tenantId).deleteStep()

  const [modal, setModal] = useState(false)
  const [selectedBoard, setSelectedBoard] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const toggle = () => setModal(!modal)

  const handleCreate = (board) => {
    if (isEditMode) {
      console.log("--------- x")
      console.log(JSON.stringify({ boardId: board._id, updatedBoard: {name: board.name, type: board.type, icon: board.icon, visible: board.visible} }))
      console.log("--------- x")
      updateBoard.mutate({ boardId: selectedBoard._id, updatedBoard: {name: board.name, type: board.type, icon: board.icon, visible: board.visible} })

    } else {
      createBoard.mutate(board)
    }
    toggle()
  }

  const handleEdit = (board) => {
    setSelectedBoard(board)
    setIsEditMode(true)
    toggle()
  }

  const handleDelete = (boardId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this board!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        removeBoard.mutate(boardId)
        Swal.fire('Deleted!', 'Your board has been deleted.', 'success')
      }
    })
  }

  const handleStepCreate = (step, index, setFieldValue) => {
    createStep.mutate(
      {
        boardId: selectedBoard._id,
        ...step,
      },
      {
        onSuccess: (data) => {
          setFieldValue(`steps.${index}._id`, data._id)
        },
      }
    )
  }

  const handleStepUpdate = (step) => {
    updateStep.mutate({
      boardId: selectedBoard._id,
      stepId: step._id,
      ...step,
    })
  }

  const handleStepDelete = (stepId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this step!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteStep.mutate({
          boardId: selectedBoard._id,
          stepId,
        })
        Swal.fire('Deleted!', 'Your step has been deleted.', 'success')
      }
    })
  }

  const columns = useMemo(
    () => [
      {
        Header: 'Nome',
        accessor: 'name',
        filterable: true,
        Cell: (cellProps) => (
          <Link className="text-dark">{cellProps.row.original.name}</Link>
        ),
      },
      {
        Header: 'Ações',
        accessor: 'actions',
        Cell: (cellProps) => (
          <div>
            <Button
              color="warning"
              size="sm"
              onClick={() => handleEdit(cellProps.row.original)}
            >
              Editar
            </Button>{' '}
            <Button
              color="danger"
              size="sm"
              onClick={() => handleDelete(cellProps.row.original._id)}
            >
              Excluir
            </Button>
          </div>
        ),
      },
    ],
    []
  )

  return (
    <React.Fragment>
      <Row>
        <Col lg="12">
          <Card>
            <CardBody>
              <div className="d-flex align-items-center mb-4">
                <Button
                  color="primary"
                  onClick={() => {
                    setIsEditMode(false)
                    setSelectedBoard(null)
                    toggle()
                  }}
                >
                  Criar novo Funil <i className="mdi mdi-plus-box"></i>
                </Button>
              </div>
              <TableContainer
                columns={columns}
                data={data ?? []}
                isLoading={isLoading}
                isPagination={true}
                isGlobalFilter={false}
                isAddUserList={false}
                isShowingPageLength={false}
                iscustomPageSizeOptions={false}
                handleUserClick={() => {}}
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
      <Modal
        id="modalForm"
        isOpen={modal}
        toggle={toggle}
        fade={false}
        size="lg"
        style={{
          position: 'fixed',
          margin: 'auto',
          right: '0px',
          minWidth: '70%',
          height: '100%',
          minHeight: '100%',
        }}
        contentClassName="modal-full-height"
      >
        <ModalHeader toggle={toggle}>
          {isEditMode ? 'Editar Funil' : 'Criar Funil'}
        </ModalHeader>
        <ModalBody style={{ overflow: 'auto' }}>
          <BoardForm
            onSubmit={handleCreate}
            initialValues={selectedBoard || { name: '', type: '', relatedTo: '', steps: [] }}
            onStepUpdate={handleStepUpdate}
            onStepDelete={handleStepDelete}
            onStepCreate={handleStepCreate}
            isEditMode={isEditMode}
          />
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default BoardsTab
