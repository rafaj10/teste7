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
import { useTenant } from '../../store/admin/useTenant'
import TenantForm from './components/TenantForm'

const TenantsTab = ({ onSelectTenant, selectedTenant }) => {
  const { data, isLoading } = useTenant().list()
  const createTenant = useTenant().create()
  const [modal, setModal] = useState(false)

  const toggle = () => setModal(!modal)

  const handleCreate = (tenant) => {
    createTenant.mutate(tenant)
    toggle()
  }

  const columns = useMemo(
    () => [
      {
        Header: 'Nome da Empresa',
        accessor: 'name',
        filterable: true,
        Cell: (cellProps) => (
          <Link
            className={`text-dark ${
              cellProps.row.original._id === selectedTenant
                ? 'selected-tenant'
                : ''
            }`}
            onClick={() => onSelectTenant(cellProps.row.original._id)}
          >
            {cellProps.row.original.name}
          </Link>
        ),
      },
    ],
    [selectedTenant]
  )

  return (
    <React.Fragment>
      <Row>
        <Col lg="12">
          <Card>
            <CardBody>
              <div className="d-flex align-items-center mb-4">
                <Button color="primary" onClick={toggle}>
                  Criar novo Empresa <i className="mdi mdi-plus-box"></i>
                </Button>
              </div>
              <p>Selecione uma empresa, para ativar a edição nas outras tabs</p>
              {data && data.length === 0 ? (
                <Row className="justify-content-center mt-lg-5">
                  <Col xl="5" sm="8">
                    <Card>
                      <CardBody>
                        <div className="text-center">
                          <Row className="justify-content-center">
                            <Col lg="10">
                              <h4 className="mt-4 fw-semibold">
                                Não encontramos Empresas
                              </h4>
                              <p className="text-muted mt-3">
                                Não encontramos Empresas. Você pode adicionar um
                                novo no botão "Criar novo Empresa".
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
        <ModalHeader toggle={toggle}>Criar Tenant</ModalHeader>
        <ModalBody>
          <TenantForm onSubmit={handleCreate} initialValues={{ name: '' }} />
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default TenantsTab
