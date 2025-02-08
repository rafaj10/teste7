import React, { useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import withRouter from '../../../components/Common/withRouter'
import { map } from 'lodash'
import classnames from 'classnames'
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Table,
  Nav,
  NavItem,
  NavLink,
  Button,
  Label,
} from 'reactstrap'
import Select from 'react-select'
import WalletActivities from '../../Crypto/CryptoWallet/walletActivities'

// TableContainer

import { Pdate, Ddate, Name, Idno, Budget } from './CryptoCol'

import TableContainer from '/src/components/Common/TableContainer'

//Import Breadcrumb
import Breadcrumbs from '/src/components/Common/Breadcrumb'

//Import mini card widgets
import MiniCards from './mini-card'

//Import Images
import profile1 from '/src/assets/images/profile-img.png'

// import charts
import ApexRevenue from '../ApexRevenue'
import { getUserProfile } from '/src/store/actions'

const ContactsProfile = (props) => {
  //meta title
  document.title = 'Leads | 7stratos'

  const { userProfile, onGetUserProfile } = props
  // eslint-disable-next-line no-unused-vars
  const [miniCards, setMiniCards] = useState([
    {
      title: 'Completed Projects',
      iconClass: 'bx-check-circle',
      text: '125',
    },
    { title: 'Pending Projects', iconClass: 'bx-hourglass', text: '12' },
    { title: 'Total Revenue', iconClass: 'bx-package', text: '$36,524' },
  ])

  const [activeTab1, setActiveTab1] = useState('2')

  useEffect(() => {
    onGetUserProfile()
  }, [onGetUserProfile])

  const toggleTab1 = (tab) => {
    if (activeTab1 !== tab) {
      setActiveTab1(tab)
    }
  }

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableFilters: true,
        filterable: true,
        Cell: (cellProps) => {
          return <Idno {...cellProps} />
        },
      },
      {
        Header: 'Project',
        accessor: 'name',
        disableFilters: true,
        filterable: true,
        Cell: (cellProps) => {
          return <Name {...cellProps} />
        },
      },
      {
        Header: 'Start Date',
        accessor: 'startDate',
        disableFilters: true,
        filterable: true,
        Cell: (cellProps) => {
          return <Pdate {...cellProps} />
        },
      },
      {
        Header: 'Deadline',
        accessor: 'deadline',
        disableFilters: true,
        filterable: true,
        Cell: (cellProps) => {
          return <Ddate {...cellProps} />
        },
      },
      {
        Header: 'Budget',
        accessor: 'budget',
        disableFilters: true,
        filterable: true,
        Cell: (cellProps) => {
          return <Budget {...cellProps} />
        },
      },
    ],
    []
  )

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Leads" breadcrumbItem="Detalhes - 7stratos" />

          <Row>
            <Col xl="3">
              <Card>
                <div className="bg-primary-subtle" style={{ height: '50px' }}>
                  <Row>
                    <Col xs="9">
                      <div className="text-primary p-3">
                        <h5 className="text-primary">Informações do lead</h5>
                      </div>
                    </Col>
                  </Row>
                </div>
                <CardBody>
                  <CardTitle
                    className="mb-2"
                    style={{ fontSize: '12px', color: '#54398b' }}
                  >
                    Proprietario do lead
                  </CardTitle>
                  <CardTitle className="mb-4">Rafael Assis</CardTitle>

                  <CardTitle
                    className="mb-2"
                    style={{ fontSize: '12px', color: '#54398b' }}
                  >
                    Origem do lead
                  </CardTitle>
                  <CardTitle className="mb-4">E-mail</CardTitle>

                  <CardTitle
                    className="mb-2"
                    style={{ fontSize: '12px', color: '#54398b' }}
                  >
                    Contato estrategico
                  </CardTitle>
                  <div className="table-responsive">
                    <Table className="table-nowrap mb-0">
                      <tbody>
                        <tr>
                          <th scope="row">
                            <i className="fas fa-pen-square"></i>
                          </th>
                          <td style={{ fontWeight: '800', fontSize: '13px' }}>
                            {userProfile.name}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">
                            <i className="fas fa-mail-bulk"></i>{' '}
                          </th>
                          <td>{userProfile.phone}</td>
                        </tr>
                        <tr>
                          <th scope="row">
                            <i className="fas fa-pen-square"></i>
                          </th>
                          <td>{userProfile.email}</td>
                        </tr>
                        <tr>
                          <th scope="row">
                            <i className="fas fa-pen-square"></i>
                          </th>
                          <td>{userProfile.location}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                  <hr></hr>

                  <CardTitle
                    className="mb-2"
                    style={{ fontSize: '12px', color: '#54398b' }}
                  >
                    Outros contatos
                  </CardTitle>
                  <div className="table-responsive">
                    <Table className="table-nowrap mb-0">
                      <tbody>
                        <tr>
                          <th scope="row">
                            <i className="fas fa-pen-square"></i>
                          </th>
                          <td style={{ fontWeight: '800', fontSize: '13px' }}>
                            {userProfile.name}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">
                            <i className="fas fa-mail-bulk"></i>{' '}
                          </th>
                          <td>{userProfile.phone}</td>
                        </tr>
                        <tr>
                          <th scope="row">
                            <i className="fas fa-pen-square"></i>
                          </th>
                          <td>{userProfile.email}</td>
                        </tr>
                        <tr>
                          <th scope="row">
                            <i className="fas fa-pen-square"></i>
                          </th>
                          <td>{userProfile.location}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                  <div
                    className="table-responsive"
                    style={{ marginTop: '15px' }}
                  >
                    <Table className="table-nowrap mb-0">
                      <tbody>
                        <tr>
                          <th scope="row">
                            <i className="fas fa-pen-square"></i>
                          </th>
                          <td style={{ fontWeight: '800', fontSize: '13px' }}>
                            Renata Andrade
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">
                            <i className="fas fa-mail-bulk"></i>{' '}
                          </th>
                          <td>{userProfile.phone}</td>
                        </tr>
                        <tr>
                          <th scope="row">
                            <i className="fas fa-pen-square"></i>
                          </th>
                          <td>{userProfile.email}</td>
                        </tr>
                        <tr>
                          <th scope="row">
                            <i className="fas fa-pen-square"></i>
                          </th>
                          <td>{userProfile.location}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>

                  <CardTitle
                    className="mb-2"
                    style={{
                      fontSize: '12px',
                      color: '#54398b',
                      marginTop: '15px',
                    }}
                  >
                    Empresa
                  </CardTitle>
                  <div className="table-responsive">
                    <Table className="table-nowrap mb-0">
                      <tbody>
                        <tr>
                          <th scope="row">
                            <i className="fas fa-pen-square"></i>
                          </th>
                          <td style={{ fontWeight: '800', fontSize: '13px' }}>
                            {userProfile.name}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">
                            <i className="fas fa-mail-bulk"></i>{' '}
                          </th>
                          <td>{userProfile.phone}</td>
                        </tr>
                        <tr>
                          <th scope="row">
                            <i className="fas fa-pen-square"></i>
                          </th>
                          <td>{userProfile.email}</td>
                        </tr>
                        <tr>
                          <th scope="row">
                            <i className="fas fa-pen-square"></i>
                          </th>
                          <td>{userProfile.location}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>

                  <CardTitle
                    className="mb-2"
                    style={{
                      fontSize: '12px',
                      color: '#54398b',
                      marginTop: '15px',
                    }}
                  >
                    Agencia
                  </CardTitle>
                  <div className="table-responsive">
                    <Table className="table-nowrap mb-0">
                      <tbody>
                        <tr>
                          <th scope="row">
                            <i className="fas fa-pen-square"></i>
                          </th>
                          <td style={{ fontWeight: '800', fontSize: '13px' }}>
                            {userProfile.name}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">
                            <i className="fas fa-mail-bulk"></i>{' '}
                          </th>
                          <td>{userProfile.phone}</td>
                        </tr>
                        <tr>
                          <th scope="row">
                            <i className="fas fa-pen-square"></i>
                          </th>
                          <td>{userProfile.email}</td>
                        </tr>
                        <tr>
                          <th scope="row">
                            <i className="fas fa-pen-square"></i>
                          </th>
                          <td>{userProfile.location}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl="9">
              <Row>
                <Card>
                  <Nav
                    pills
                    className="bg-light rounded"
                    style={{ marginTop: '10px' }}
                  >
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab1 === '1' })}
                        onClick={() => {
                          toggleTab1('1')
                        }}
                      >
                        Lead
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab1 === '2' })}
                        onClick={() => {
                          toggleTab1('2')
                        }}
                      >
                        Qualificação
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab1 === '3' })}
                        onClick={() => {
                          toggleTab1('3')
                        }}
                      >
                        Potenciais
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab1 === '4' })}
                        onClick={() => {
                          toggleTab1('4')
                        }}
                      >
                        Agendados
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab1 === '5' })}
                        onClick={() => {
                          toggleTab1('5')
                        }}
                      >
                        Reuniões
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab1 === '6' })}
                        onClick={() => {
                          toggleTab1('6')
                        }}
                      >
                        Propostas
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab1 === '7' })}
                        onClick={() => {
                          toggleTab1('7')
                        }}
                      >
                        Negociação
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab1 === '8' })}
                        onClick={() => {
                          toggleTab1('8')
                        }}
                      >
                        Convertidos
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab1 === '9' })}
                        onClick={() => {
                          toggleTab1('9')
                        }}
                      >
                        Perdidos
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <CardBody style={{ height: '65px' }}>
                    <Row>
                      <Col lg="8">
                        <div
                          className="d-flex"
                          style={{ marginLeft: '-15px', marginTop: '5px' }}
                        >
                          <div className="flex-grow-1 align-self-center">
                            <div className="text-muted">
                              <p className="mb-2">
                                <i className="fas fa-pen-square"></i> Há 8 dias
                                na etapa Última interação 22 de novembro as
                                22h40
                              </p>
                            </div>
                          </div>
                        </div>
                      </Col>

                      <Col lg="4" className="d-none d-lg-block">
                        <div
                          className="mb-3"
                          style={{ marginTop: '-8px', marginRight: '-20px' }}
                        >
                          <Select
                            classNamePrefix="select2-selection"
                            placeholder="Mover lead para etapa..."
                            title="Country"
                            isMulti
                          />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <Row>
                      <Col lg="12">
                        <div
                          className="d-flex"
                          style={{ marginLeft: '-15px', marginTop: '5px' }}
                        >
                          <div className="flex-grow-1 align-self-center">
                            <div className="text-muted">
                              <p className="mb-2">
                                <i className="fas fa-pen-square"></i> Há 8 dias
                                na etapa Última interação 22 de novembro as
                                22h40
                              </p>
                            </div>
                            <Select
                              classNamePrefix="select2-selection"
                              placeholder="Nome da mãe."
                              title="Country"
                              // options={options}
                              isMulti
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                {/* <Card style={{ backgroundColor: '#f5f5f9' }}>
                  <CardBody>
                      <Row>
                        <Col lg="10">
                          <div className="d-flex">
                            <div className="flex-grow-1 align-self-center">
                              <div className="text-muted">
                                <p className="mb-2">Cadência</p>
                              </div>
                            </div>
                          </div>
                        </Col>

                        <Col lg="2" className="d-none d-lg-block">
                          <div className="clearfix mt-4 mt-lg-0">
                              <Button type="submit" color="primary">
                                Criar Proposta
                              </Button>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                </Card> */}
              </Row>

              <Row>
                <WalletActivities isLoading={false} setLoading={true} />
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

ContactsProfile.propTypes = {
  userProfile: PropTypes.any,
  onGetUserProfile: PropTypes.func,
}

const mapStateToProps = ({ contacts }) => ({
  userProfile: contacts.userProfile,
})

const mapDispatchToProps = (dispatch) => ({
  onGetUserProfile: () => dispatch(getUserProfile()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ContactsProfile))
