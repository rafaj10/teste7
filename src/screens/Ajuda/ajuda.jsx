import React, { useState } from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap'
import classnames from 'classnames'

// Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb'

const Ajuda = () => {
  // meta title
  document.title = 'Ajuda | 7stratos - Plataforma de CRM'

  const [activeTab, setactiveTab] = useState('1')

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Ajuda" breadcrumbItem="FAQs" />

          <div className="checkout-tabs">
            <Row>
              <Col lg="2">
                <Nav className="flex-column" pills>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '1' })}
                      onClick={() => {
                        setactiveTab('1')
                      }}
                    >
                      <i className="bx bx-question-mark d-block check-nav-icon mt-4 mb-2" />
                      <p className="font-weight-bold mb-4">Perguntas Gerais</p>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '2' })}
                      onClick={() => {
                        setactiveTab('2')
                      }}
                    >
                      <i className="bx bx-lock d-block check-nav-icon mt-4 mb-2" />
                      <p className="font-weight-bold mb-4">
                        Política de Privacidade
                      </p>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '3' })}
                      onClick={() => {
                        setactiveTab('3')
                      }}
                    >
                      <i className="bx bx-support d-block check-nav-icon mt-4 mb-2" />
                      <p className="font-weight-bold mb-4">Suporte</p>
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <Col lg="10">
                <Card>
                  <CardBody>
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="1">
                        <CardTitle className="mb-5">Perguntas Gerais</CardTitle>
                        <div className="faq-box d-flex mb-4">
                          <div className="flex-shrink-0 me-3 faq-icon">
                            <i className="bx bx-help-circle font-size-20 text-success" />
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="font-size-15">
                              O que é a 7stratos?
                            </h5>
                            <p className="text-muted">
                              A 7stratos é uma plataforma de CRM que oferece
                              ferramentas completas para gestão de clientes,
                              automação de marketing e vendas, e análise de
                              desempenho.
                            </p>
                          </div>
                        </div>
                        <div className="faq-box d-flex mb-4">
                          <div className="flex-shrink-0 me-3 faq-icon">
                            <i className="bx bx-help-circle font-size-20 text-success" />
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="font-size-15">
                              Como criar um novo cliente?
                            </h5>
                            <p className="text-muted">
                              Para criar um novo cliente, vá até a aba de
                              clientes no menu principal, clique em "Adicionar
                              Cliente" e preencha os dados necessários.
                            </p>
                          </div>
                        </div>
                        <div className="faq-box d-flex mb-4">
                          <div className="flex-shrink-0 me-3 faq-icon">
                            <i className="bx bx-help-circle font-size-20 text-success" />
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="font-size-15">
                              Como criar e gerenciar workflows?
                            </h5>
                            <p className="text-muted">
                              Você pode criar e gerenciar workflows acessando a
                              seção de Workflows no menu principal. Clique em
                              "Adicionar Workflow" e siga as instruções para
                              configurar suas automações.
                            </p>
                          </div>
                        </div>
                        <div className="faq-box d-flex mb-4">
                          <div className="flex-shrink-0 me-3 faq-icon">
                            <i className="bx bx-help-circle font-size-20 text-success" />
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="font-size-15">
                              Como posso visualizar relatórios de desempenho?
                            </h5>
                            <p className="text-muted">
                              Na aba de Relatórios, você pode visualizar
                              diversos gráficos e tabelas que mostram o
                              desempenho das suas campanhas de marketing e
                              vendas.
                            </p>
                          </div>
                        </div>
                      </TabPane>
                      <TabPane tabId="2">
                        <CardTitle className="mb-5">
                          Política de Privacidade
                        </CardTitle>
                        <div className="faq-box d-flex mb-4">
                          <div className="flex-shrink-0 me-3 faq-icon">
                            <i className="bx bx-lock font-size-20 text-success" />
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="font-size-15">
                              Como meus dados são protegidos?
                            </h5>
                            <p className="text-muted">
                              Utilizamos as mais avançadas tecnologias de
                              criptografia para garantir a segurança e a
                              privacidade dos seus dados.
                            </p>
                          </div>
                        </div>
                        <div className="faq-box d-flex mb-4">
                          <div className="flex-shrink-0 me-3 faq-icon">
                            <i className="bx bx-lock font-size-20 text-success" />
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="font-size-15">
                              Quais informações são coletadas?
                            </h5>
                            <p className="text-muted">
                              Coletamos informações essenciais para o
                              funcionamento do serviço, incluindo dados de
                              contato, histórico de interações e preferências de
                              marketing.
                            </p>
                          </div>
                        </div>
                        <div className="faq-box d-flex mb-4">
                          <div className="flex-shrink-0 me-3 faq-icon">
                            <i className="bx bx-lock font-size-20 text-success" />
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="font-size-15">
                              Como posso gerenciar minhas preferências de
                              privacidade?
                            </h5>
                            <p className="text-muted">
                              Você pode gerenciar suas preferências de
                              privacidade acessando a seção de configurações da
                              conta e ajustando suas preferências de
                              compartilhamento de dados e comunicação.
                            </p>
                          </div>
                        </div>
                      </TabPane>
                      <TabPane tabId="3">
                        <CardTitle className="mb-5">Suporte</CardTitle>
                        <div className="faq-box d-flex mb-4">
                          <div className="flex-shrink-0 me-3 faq-icon">
                            <i className="bx bx-support font-size-20 text-success" />
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="font-size-15">
                              Como entrar em contato com o suporte?
                            </h5>
                            <p className="text-muted">
                              Você pode entrar em contato com o suporte através
                              do nosso chat online disponível no site, ou
                              enviando um e-mail para suporte@7stratos.com.
                            </p>
                          </div>
                        </div>
                        <div className="faq-box d-flex mb-4">
                          <div className="flex-shrink-0 me-3 faq-icon">
                            <i className="bx bx-support font-size-20 text-success" />
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="font-size-15">
                              Quais são os horários de atendimento?
                            </h5>
                            <p className="text-muted">
                              Nosso suporte está disponível de segunda a sexta,
                              das 9h às 18h (horário de Brasília).
                            </p>
                          </div>
                        </div>
                        <div className="faq-box d-flex mb-4">
                          <div className="flex-shrink-0 me-3 faq-icon">
                            <i className="bx bx-support font-size-20 text-success" />
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="font-size-15">
                              Como posso acessar a base de conhecimento?
                            </h5>
                            <p className="text-muted">
                              Você pode acessar nossa base de conhecimento
                              através do menu de ajuda no painel principal, onde
                              encontrará artigos detalhados e tutoriais sobre
                              todas as funcionalidades da 7stratos.
                            </p>
                          </div>
                        </div>
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Ajuda
