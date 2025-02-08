import qs from 'qs'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap'
import { toast } from 'react-toastify'
import { getBoardByIdReq } from '../../store/board/actions'
import { getLoggedInUser } from '../../helpers/backend_helper'

import Breadcrumbs from '../../components/Common/Breadcrumb'

import {
  createLeads as onCreateLeads,
  createPeoples as onCreatePeople,
  getPeoples as onGetPeoples,
  getPersonsByAgency as onGetPersonsByAgency,
  getPersonsByCompany as onGetPersonsByCompany,
  getUsersByTenant as onGetUsersByTenant,
  getAgenciesByCompany as onGetgetAgenciesByCompany,
  loadingPeoples as onLoadingPeoples,
} from '../../store/peoples/actions'

//redux
import { useDispatch } from 'react-redux'
import { usePeopleSelector } from '../../store/peoples/selectors'

// FlatPickr
import 'flatpickr/dist/themes/material_blue.css'

import classnames from 'classnames'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useBoardSelector } from '../../store/board/selectors'
import ModalCreate from '../Peoples/modalCreate'
import ModalCreateContact from '../Peoples/modalCreateContact'

import InfoLead from './Components/InfoLead'
import InfoOp from './Components/InfoOp'
import Agency from './Components/Agency'
import Contacts from './Components/Contacts'

const CriarLead = () => {
  const dispatch = useDispatch()
  const peopleSelector = usePeopleSelector()
  const navigate = useNavigate()
  const {
    createdPeople,
    agenciesByCompany,
    personsByCompany,
    personsByAgency,
    loading,
  } = peopleSelector
  const [activeTab, setactiveTab] = useState(1)
  const [passedSteps, setPassedSteps] = useState([1])
  const [modal, setModal] = useState(false)
  const [currentBoard, setCurrentBoard] = useState('')
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [selectedAgency, setSelectedAgency] = useState(null)
  const [currentRelation, setCurrentRelation] = useState(null)
  const [currentType, setCurrentType] = useState('')
  const [leadHasAgency, setLeadHasAgency] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState([])
  const [selectedEstrategic, setSelectedEstrategic] = useState(null)
  const [selectedValues, setSelectedValues] = useState({
    sector: '',
    category: '',
  })

  const handleSelectionChange = (values) => {
    setSelectedValues(values)
  }

  const toggleSelectedContact = (item, ref) => {
    setSelectedContacts((prevSelectedContacts) => {
      const isAlreadySelected = prevSelectedContacts.find(
        (contact) => contact.person === item._id
      )

      if (isAlreadySelected) {
        return prevSelectedContacts.filter(
          (contact) => contact.person !== item._id
        )
      } else {
        return [
          ...prevSelectedContacts,
          { person: item._id, ref: ref, strategic: false },
        ]
      }
    })
  }

  const handleEstrategicSelect = (item) => {
    setSelectedEstrategic(item._id)
    setSelectedContacts((prevSelectedContacts) => {
      return prevSelectedContacts.map((contact) => ({
        ...contact,
        strategic: contact.person === item._id,
      }))
    })
  }

  const toggle = () => (modal ? setModal(false) : setModal(true))

  function toggleTab(tab) {
    if (activeTab !== tab) {
      var modifiedSteps = [...passedSteps, tab]
      if (tab >= 1 && tab <= 3) {
        setactiveTab(tab)
        setPassedSteps(modifiedSteps)
      }
    }
  }

  useEffect(() => {
    const parsed = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    })
    const board = parsed.board
    setCurrentBoard(board)
    dispatch(getBoardByIdReq(board))
  }, [])

  const boardSelector = useBoardSelector()

  const steps = boardSelector?.steps

  useEffect(() => {
    dispatch(onGetPeoples('company'))
    console.log('Get users')
    dispatch(onGetUsersByTenant())
  }, [])

  useEffect(() => {
    if (createdPeople && currentType === 'company') {
      setSelectedCompany(createdPeople)
    }
  }, [createdPeople])

  useEffect(() => {
    if(selectedCompany){
      dispatch(onGetgetAgenciesByCompany(selectedCompany._id))
      dispatch(onGetPersonsByCompany(selectedCompany._id))
    }
  }, [selectedCompany])

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      origin: '',
      titulo: '',
      nome: '',
      cnpj: '',
      site: '',
      sector: '',
      category: '',
      cep: '',
      endereco: '',
      cidade: '',
      estado: '',
    },
    validationSchema: Yup.object({
      origin: Yup.string().required('Selecione uma Origem para este lead'),
      nome: Yup.string().required('Preencha o nome da empresa'),
      // cnpj: Yup.string()
      //   .matches(
      //     /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/,
      //     'CNPJ precisa ser valído ex: 00.000.000/0001-00'
      //   )
      //   .required('Preencha o CNPJ'),
    }),
    onSubmit: (values) => {},
  })

  const createPeople = (payload) => {
    toggle()
    dispatch(onLoadingPeoples())
    dispatch(onCreatePeople(currentType, payload, false, null))
    if (selectedCompany) {
      dispatch(onGetgetAgenciesByCompany(selectedCompany._id))
      dispatch(onGetPersonsByCompany(selectedCompany._id))
      if (selectedAgency) {
        dispatch(onGetPersonsByAgency(selectedAgency._id))
      }
    }
    dispatch(onGetPeoples('company'))
  }

  const createCompany = async () => {
    if (selectedCompany) {
      toggleTab(activeTab + 1)
    } else {
      const validated = await validation.validateForm(validation.values)
      validation.handleSubmit()

      if (Object.keys(validated).length === 0) {
        const values = validation.values

        const parts = selectedValues.category.split('|')
        const resultCategory =
          parts.length > 1 ? parts[1] : selectedValues.category

        const payload = {
          name: values.nome,
          alias: values.nome,
          sector: selectedValues.sector,
          category: resultCategory,
          documents: [{ type: 'cnpj', value: values.cnpj }],
          contacts: [{ type: 'site', value: values.site }],
          addresses: [
            {
              type: 'Principal',
              address: values.endereco,
              city: values.cidade,
              state: values.estado,
              zipcode: values.cep,
            },
          ],
        }
        console.log('---> ' + JSON.stringify(payload))
        setCurrentType('company')
        dispatch(onLoadingPeoples())
        dispatch(onCreatePeople('company', payload, false, null, (sucess, resp) => {
          if(sucess){
            if (selectedCompany) {
              dispatch(onGetgetAgenciesByCompany(selectedCompany._id))
              dispatch(onGetPersonsByCompany(selectedCompany._id))
              if (selectedAgency) {
                dispatch(onGetPersonsByAgency(selectedAgency._id))
              }
            }
            dispatch(onGetPeoples('company'))

            toggleTab(activeTab + 1)
          }else{
            toast.error(`Essa empresa já existe para este funil`)
          }
        }))
      }
    }
  }

  const createLead = () => {
    if (activeTab === 3) {
      const values = validation.values
      const stetpStarter = steps.filter((e) => e.flags.starter)
      const userMeId = getLoggedInUser()?._id
      const payload = {
        step: stetpStarter[0]._id,
        owner: userMeId,
        origin: values.origin,
        title: boardSelector?.boardById?.type === "crm" ? values.titulo : '',
        type: 'engagement',
        company: selectedCompany ? selectedCompany._id : '',
        agency: selectedAgency ? selectedAgency._id : '',
        contacts: selectedContacts,
      }
      dispatch(onLoadingPeoples())
      dispatch(
        onCreateLeads(currentBoard, payload, () => {
          navigate('/funil/'+currentBoard)
        })
      )
    }
  }

  document.title = '7startos | Criar leads'

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={boardSelector?.boardById?.name} breadcrumbItem={boardSelector?.boardById?.type === "crm" ? 'Criar oportunidade' : 'Criar Lead' } />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="wizard clearfix">
                    {/* Tabs de controle */}
                    <div className="steps clearfix">
                      <ul>
                        <NavItem
                          className={classnames({ current: activeTab === 1 })}
                        >
                          <NavLink
                            className={classnames({ current: activeTab === 1 })}
                            onClick={() => {
                              setactiveTab(1)
                            }}
                            disabled={!(passedSteps || []).includes(1)}
                          >
                            <span className="number">1.</span> {boardSelector?.boardById?.type === "crm" ? (<>Informações da
                              oportunidade</>) : (<>Informações do Lead</>)}
                          </NavLink>
                        </NavItem>
                        <NavItem
                          className={classnames({ current: activeTab === 2 })}
                        >
                          <NavLink
                            className={classnames({ active: activeTab === 2 })}
                            onClick={() => {
                              setactiveTab(2)
                            }}
                            disabled={!(passedSteps || []).includes(2)}
                          >
                            <span className="number">2.</span> Agencia
                          </NavLink>
                        </NavItem>
                        <NavItem
                          className={classnames({ current: activeTab === 3 })}
                        >
                          <NavLink
                            className={classnames({ active: activeTab === 3 })}
                            onClick={() => {
                              setactiveTab(3)
                            }}
                            disabled={!(passedSteps || []).includes(3)}
                          >
                            <span className="number">3.</span> Contatos
                          </NavLink>
                        </NavItem>
                      </ul>
                    </div>

                    {/* Conteudos e Formularios */}
                    <div className="content clearfix">

                      <Form
                        onSubmit={(e) => {
                          e.preventDefault()
                          validation.handleSubmit()
                          return false
                        }}
                      >
                        <TabContent activeTab={activeTab} className="body">

                          {/* Tab Empresa */}
                          <TabPane tabId={1}>
                            {boardSelector?.boardById?.type === "crm" ? (
                              <InfoOp
                                validation={validation}
                                selectedCompany={selectedCompany}
                                handleSelectionChange={handleSelectionChange}
                                setSelectedCompany={setSelectedCompany}
                                setSelectedAgency ={setSelectedAgency}
                              />
                            ) : (
                              <InfoLead
                                validation={validation}
                                selectedCompany={selectedCompany}
                                handleSelectionChange={handleSelectionChange}
                              />
                            ) }
                          </TabPane>

                          {/* Tab Agencia */}
                          <TabPane tabId={2}>
                            <Agency
                              selectedCompany = {selectedCompany}
                              leadHasAgency = {leadHasAgency}
                              setLeadHasAgency = {setLeadHasAgency}
                              selectedAgency = {selectedAgency}
                              setCurrentType = {setCurrentType}
                              setCurrentRelation = {setCurrentRelation}
                              toggle = {toggle}
                              agenciesByCompany = {agenciesByCompany}
                              setSelectedAgency = {setSelectedAgency}
                              dispatch = {dispatch}
                              typeBoard={boardSelector?.boardById?.type}
                            />
                          </TabPane>

                          {/* Tab Contatos */}
                          <TabPane tabId={3}>
                            <Contacts
                              selectedCompany = {selectedCompany}
                              personsByCompany = {personsByCompany}
                              toggleSelectedContact = {toggleSelectedContact}
                              handleEstrategicSelect = {handleEstrategicSelect}
                              setCurrentType = {setCurrentType}
                              setCurrentRelation = {setCurrentRelation}
                              toggle = {toggle}
                              selectedAgency = {selectedAgency}
                              personsByAgency = {personsByAgency}
                              typeBoard={boardSelector?.boardById?.type}
                            />
                          </TabPane>

                        </TabContent>

                      </Form>

                    </div>

                    {/* Botões de controle */}
                    {boardSelector?.boardById?.type === "crm" ? (
                      <div className="actions clearfix">
                        <ul>
                        <li
                          className={
                            activeTab === 1 ? 'previous disabled' : 'previous'
                          }
                        >
                          <Link
                            to={'?board=' + currentBoard + '#'}
                            onClick={() => {
                              toggleTab(activeTab - 1)
                            }}
                          >
                            Anterior
                          </Link>
                        </li>
                        {(activeTab === 1 && selectedCompany) && (
                          <Link
                            to={'?board=' + currentBoard + '#'}
                            onClick={() => {
                              createCompany()
                            }}
                          >
                            Próximo
                          </Link>
                        )}
                        {activeTab === 2 && (
                          <li
                            className={
                              activeTab === 2 && !selectedCompany
                                ? 'next disabled'
                                : 'next'
                            }
                          >
                            <Link
                              to={'?board=' + currentBoard + '#'}
                              onClick={() => {
                                activeTab === 2 && !selectedCompany
                                  ? null
                                  : toggleTab(activeTab + 1)
                              }}
                            >
                              Próximo
                            </Link>
                          </li>
                        )}
                        {activeTab === 3 && (
                          <>
                            <Link
                              to={'?board=' + currentBoard + '#'}
                              onClick={() => createLead()}
                            >
                              Salvar lead
                            </Link>
                          </>
                        )}
                        </ul>
                      </div>
                    ) :(
                      <div className="actions clearfix">
                        <ul>
                          <li
                            className={
                              activeTab === 1 ? 'previous disabled' : 'previous'
                            }
                          >
                            <Link
                              to={'?board=' + currentBoard + '#'}
                              onClick={() => {
                                toggleTab(activeTab - 1)
                              }}
                            >
                              Anterior
                            </Link>
                          </li>
                          {activeTab === 1 && (
                            <Link
                              to={'?board=' + currentBoard + '#'}
                              onClick={() => {
                                createCompany()
                              }}
                            >
                              Próximo
                            </Link>
                          )}
                          {activeTab === 2 && (
                            <li
                              className={
                                activeTab === 2 && !selectedCompany
                                  ? 'next disabled'
                                  : 'next'
                              }
                            >
                              <Link
                                to={'?board=' + currentBoard + '#'}
                                onClick={() => {
                                  activeTab === 2 && !selectedCompany
                                    ? null
                                    : toggleTab(activeTab + 1)
                                }}
                              >
                                Próximo
                              </Link>
                            </li>
                          )}
                          {activeTab === 3 && (
                            <>
                              <Link
                                to={'?board=' + currentBoard + '#'}
                                onClick={() => createLead()}
                              >
                                Salvar lead
                              </Link>
                            </>
                          )}
                        </ul>
                     </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {currentType === 'person' ? (
        <ModalCreateContact
          createPeople={createPeople}
          modal={modal}
          toggle={toggle}
          typeName={'Contato'}
          isCreateLoading={loading}
          editing={false}
          relation={currentRelation}
        />
      ) : (
        <ModalCreate
          createPeople={createPeople}
          modal={modal}
          toggle={toggle}
          typeName={currentType === 'company' ? 'Empresa' : 'Agencia'}
          isCreateLoading={loading}
          editing={false}
          relation={currentRelation}
        />
      )}
    </React.Fragment>
  )
}

export default CriarLead
