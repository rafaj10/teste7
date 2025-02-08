import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import TableContainer from '../../components/Common/TableContainer'
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  UncontrolledTooltip,
} from 'reactstrap'
import ModalConfirmation from './modalConfirmation'
import { useProduct } from '../../store/product/hooks'
import verificationImg from '../../assets/images/verification-img.png'

import Breadcrumbs from '/src/components/Common/Breadcrumb'
import moment from 'moment/moment'
import { ToastContainer } from 'react-toastify'
import ModalCreateProduct from './modalCreateProduct'

const Products = () => {
  document.title = '7stratos | Produtos'

  const product = useProduct()
  const { data } = product.list()

  const [modal, setModal] = useState(false)
  const [modalConfirmation, setModalConfirmation] = useState(false)
  const [editing, setEditing] = useState(null)
  const [productIdToDelete, setProductIdToDelete] = useState(null)

  const onClickEdit = (p) => {
    setEditing(p)
    toggle()
  }

  const onClickDelete = (id) => {
    setProductIdToDelete(id)
    setModalConfirmation(true)
  }

  const columns = useMemo(
    () => [
      {
        Header: 'Nome do Produto',
        accessor: 'name',
        filterable: true,
        Cell: (cellProps) => {
          return (
            <Link
              className="text-dark"
              onClick={() => {
                onClickEdit(cellProps.row.original)
              }}
            >
              {cellProps.row.original.description}
            </Link>
          )
        },
      },
      {
        Header: 'Preço',
        accessor: 'price',
        filterable: false,
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
        Cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              <i
                className="mdi mdi-pencil font-size-18"
                id="edittooltip"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  onClickEdit(cellProps.row.original)
                }}
              />
              <UncontrolledTooltip placement="top" target="edittooltip">
                Editar
              </UncontrolledTooltip>
              <i
                className="mdi mdi-delete font-size-18"
                id="deletetooltip"
                style={{ color: 'red', cursor: 'pointer' }}
                onClick={() => {
                  onClickDelete(cellProps.row.original._id)
                }}
              />
              <UncontrolledTooltip placement="top" target="deletetooltip">
                Excluir
              </UncontrolledTooltip>
            </div>
          )
        },
      },
    ],
    []
  )

  const toggle = () => setModal(!modal)

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Lista" breadcrumbItem="Produtos" />

          <Row>
            <Col lg="12">
              <div
                className="d-flex align-items-center"
                style={{ marginBottom: '20px' }}
              >
                <div className="flex-shrink-0">
                  <Link
                    to={''}
                    onClick={() => {
                      setEditing(null)
                      setModal(true)
                    }}
                    className="btn btn-primary me-1"
                  >
                    Criar novo produto <i className="mdi mdi-plus-box"></i>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>

          {(data ?? []).length == 0 && (
            <Row className="justify-content-center mt-lg-5">
              <Col xl="5" sm="8">
                <Card>
                  <CardBody>
                    <div className="text-center">
                      <Row className="justify-content-center">
                        <Col lg="10">
                          <h4 className="mt-4 fw-semibold">
                            Opa nada aqui ...
                          </h4>
                          <p className="text-muted mt-3">
                            Ainda não temos nenhum registro de por aqui, você
                            pode adicionar clicando no botão de "+" acima.
                          </p>
                        </Col>
                      </Row>

                      <Row className="justify-content-center mt-5 mb-2">
                        <Col sm="6" xs="8">
                          <div>
                            <img src={verificationImg} className="img-fluid" />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}

          <Row>
            <Col lg="12">
              <TableContainer
                isPagination={true}
                columns={columns}
                data={data ?? []}
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
            </Col>
          </Row>
        </Container>
      </div>

      <ModalCreateProduct
        edit={editing}
        modal={modal}
        toggle={() => setModal(false)}
      />

      <ModalConfirmation
        modal={modalConfirmation}
        productId={productIdToDelete}
        toggle={() => {
          setProductIdToDelete(null)
          setModalConfirmation(false)
        }}
      />

      <ToastContainer />
    </React.Fragment>
  )
}

export default Products
