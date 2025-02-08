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
import { useUser } from '../../store/admin/useUsers'
import { useRole } from '../../store/admin/useRole'
import UserForm from './components/UserForm'
import EditUserForm from './components/EditUserForm'

const UsersTab = ({ tenantId }) => {
  const { data, isLoading } = useUser(tenantId).list()
  const createUser = useUser(tenantId).create()
  const updateUserRoles = useUser(tenantId).updateRoles()
  const { data: roles, isLoading: isRolesLoading } = useRole(tenantId).list()

  const [modal, setModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const toggle = () => setModal(!modal)
  const toggleEdit = () => setEditModal(!editModal)

  const handleCreate = (user) => {
    createUser.mutate(user)
    toggle()
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    toggleEdit()
  }

  const handleUpdateRoles = (updatedUser) => {
    updateUserRoles.mutate({
      userId: selectedUser._id,
      roles: updatedUser.roles,
    })
    toggleEdit()
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
        Header: 'Email',
        accessor: 'email',
        filterable: true,
      },
      {
        Header: 'Ações',
        Cell: (cellProps) => (
          <Button
            color="primary"
            onClick={() => handleEdit(cellProps.row.original)}
          >
            Atribuir Perfis
          </Button>
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
                <Button color="primary" onClick={toggle}>
                  Criar Usuario <i className="mdi mdi-plus-box"></i>
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
          minWidth: '50%',
          height: '100%',
          minHeight: '100%',
        }}
        contentClassName="modal-full-height"
      >
        <ModalHeader toggle={toggle}>Criar Usuario</ModalHeader>
        <ModalBody>
          <UserForm
            onSubmit={handleCreate}
            initialValues={{ name: '', email: '', password: '' }}
          />
        </ModalBody>
      </Modal>
      <Modal
        id="editModalForm"
        isOpen={editModal}
        toggle={toggleEdit}
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
        <ModalHeader toggle={toggleEdit}>Editar Perfis</ModalHeader>
        <ModalBody>
          <EditUserForm
            onSubmit={handleUpdateRoles}
            initialValues={{
              roles: selectedUser
                ? selectedUser.roles.map((role) => role._id)
                : [],
            }}
            roles={roles}
            isLoading={isRolesLoading}
          />
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default UsersTab
