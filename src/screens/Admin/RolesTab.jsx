import React, { useState, useMemo } from 'react'
import {
  Button,
  Row,
  Col,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap'
import TableContainer from '../../components/Common/TableContainer'
import RoleForm from './components/RoleForm'
import { useRole } from '../../store/admin/useRole'
import Swal from 'sweetalert2'

const RolesTab = ({ tenantId }) => {
  const { data: roles, isLoading } = useRole(tenantId).list()
  const createRole = useRole(tenantId).create()
  const updateRole = useRole(tenantId).update()
  const removeRole = useRole(tenantId).remove()

  const [modal, setModal] = useState(false)
  const [currentRole, setCurrentRole] = useState(null)

  const toggle = () => setModal(!modal)

  const handleCreate = (role) => {
    createRole.mutate(role)
    toggle()
  }

  const handleUpdate = (role) => {
    updateRole.mutate(role)
    toggle()
  }

  const handleDelete = (roleId) => {
    Swal.fire({
      title: 'Você tem certeza?',
      text: 'Esta ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, delete!',
    }).then((result) => {
      if (result.isConfirmed) {
        removeRole.mutate(roleId)
        Swal.fire('Deletado!', 'O perfil foi deletado.', 'success')
      }
    })
  }

  const handleToggleModal = () => {
    setCurrentRole(null)
    toggle()
  }

  const columns = useMemo(
    () => [
      {
        Header: 'Nome',
        accessor: 'name',
        filterable: true,
      },
      {
        Header: 'Ações',
        Cell: ({ row }) => (
          <div>
            <Button
              color="primary"
              onClick={() => {
                setCurrentRole(row.original)
                toggle()
              }}
            >
              Editar
            </Button>
            <Button
              color="danger"
              onClick={() => handleDelete(row.original._id)}
              style={{ marginLeft:'20px' }}
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
    <div>
      <Row>
        <Col lg="12">
          <Card>
            <CardBody>
              <div className="d-flex align-items-center mb-4">
                <Button color="primary" onClick={handleToggleModal}>
                  Criar Perfil <i className="mdi mdi-plus-box"></i>
                </Button>
              </div>
              {roles && roles.length === 0 ? (
                <Row className="justify-content-center mt-lg-5">
                  <Col xl="5" sm="8">
                    <Card>
                      <CardBody>
                        <div className="text-center">
                          <Row className="justify-content-center">
                            <Col lg="10">
                              <h4 className="mt-4 fw-semibold">
                                Não encontramos nenhum perfil por aqui.
                              </h4>
                              <p className="text-muted mt-3">
                                Você pode criar um novo perfil usando o botão
                                acima.
                              </p>
                            </Col>
                          </Row>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              ) : (
                <TableContainer
                  columns={columns}
                  data={roles ?? []}
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
              )}
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
          minWidth: '50%',
          height: '100%',
          minHeight: '100%',
        }}
        contentClassName="modal-full-height"
      >
        <ModalHeader toggle={toggle}>
          {currentRole ? 'Editar perfil' : 'Criar perfil'}
        </ModalHeader>
        <ModalBody>
          <RoleForm
            initialValues={currentRole || { name: '', permissions: [] }}
            onSubmit={currentRole ? handleUpdate : handleCreate}
          />
        </ModalBody>
      </Modal>
    </div>
  )
}

export default RolesTab
