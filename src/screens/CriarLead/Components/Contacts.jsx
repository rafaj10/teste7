import React, { useState } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
  Table,
} from 'reactstrap';
import Tour from 'reactour';

const Contacts = ({
  selectedCompany,
  personsByCompany,
  toggleSelectedContact,
  handleEstrategicSelect,
  setCurrentType,
  setCurrentRelation,
  toggle,
  selectedAgency,
  personsByAgency,
  typeBoard
}) => {
  const [isTourOpen, setIsTourOpen] = useState(false);

  const tourSteps = [
    {
      selector: '.create-contact-btn',
      content: 'Clique aqui para criar um novo contato para a empresa selecionada.',
    },
    {
      selector: '.contact-table',
      content: 'Esta tabela mostra os contatos da empresa selecionada. Selecione os contatos que você deseja adicionar à oportunidade.',
    },
    {
      selector: '.estrategic-contact-radio',
      content: 'Selecione um contato estratégico para a oportunidade.',
    },
  ];

  return (
    <React.Fragment>
      <Tour
        steps={tourSteps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
      />
      {typeBoard === 'crm' ? (
        <p style={{ marginTop:'29px'}} className="card-title-desc mb-4">
          Selecione os contatos que você gostaria que fizesse parte desta oportunidade e escolha
          apenas um contato para ser o seu contato Estrátegico, para entender melhor <a
                        onClick={(e) => {
                          e.preventDefault();
                          setIsTourOpen(true)
                        }}
                        style={{
                          fontWeight: '800',
                        }}
                      >
                        clicar aqui
                      </a>
        </p>
      ) : (
        <p className="card-title-desc mb-4">
          Selecione os contatos que você gostaria que fizesse parte deste lead e escolha
          apenas um contato para ser o seu contato Estrátegico, para entender melhor <a
                        onClick={(e) => {
                          e.preventDefault();
                          setIsTourOpen(true)
                        }}
                        style={{
                          fontWeight: '800',
                        }}
                      >
                        clicar aqui
                      </a>
        </p>
      )}
      <Row>
        <Col>
          {selectedCompany && (
            <Row>
              <Col sm="12">
                <p><i className="mdi mdi-account-multiple-outline"></i> Contatos da {selectedCompany.name}</p>
                {personsByCompany.length <= 0 ? (
                  <>
                    <p className="text-muted">
                      <i className="mdi mdi-alert-box-outline"></i> Nenhum contato para essa empresa encontrado, você pode{' '}
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentType('person');
                          setCurrentRelation(selectedCompany);
                          toggle();
                        }}
                        style={{
                          fontWeight: '800',
                        }}
                      >
                        clicar aqui para criar um novo
                      </a>
                    </p>
                  </>
                ) : (
                  <div className="table-responsive contact-table">
                    <Table className="table mb-0">
                      <tbody>
                        <tr>
                          <td>Seleção</td>
                          <td>Nome</td>
                          <td>Cargo</td>
                          <td>Contato Estrategico</td>
                        </tr>
                        {personsByCompany.map(
                          (item, index) => (
                            <tr key={item._id}>
                              <th scope="row">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`defaultCheck1-${item._id}`}
                                  value={item._id}
                                  onChange={() =>
                                    toggleSelectedContact(item, selectedCompany._id)
                                  } // Adiciona a função de toggle aqui
                                />
                              </th>
                              <td>{item.name}</td>
                              <td>Cargo</td>
                              <td>
                                <input
                                  className="form-check-input estrategic-contact-radio"
                                  type="radio"
                                  name="estrategicContact"
                                  id={`estrategic-${item._id}`}
                                  value={item._id}
                                  onChange={() =>
                                    handleEstrategicSelect(item)
                                  }
                                />
                              </td>
                            </tr>
                          )
                        )}
                        <tr>
                          <th
                            scope="row"
                            style={{
                              backgroundColor: '#fff',
                            }}
                          ></th>
                          <td
                            style={{
                              backgroundColor: '#fff',
                            }}
                          ></td>
                          <td
                            style={{
                              backgroundColor: '#fff',
                            }}
                          ></td>
                          <td
                            style={{
                              backgroundColor: '#fff',
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentType('person');
                                setCurrentRelation(selectedCompany);
                                toggle();
                              }}
                              className="btn btn-outline-primary create-contact-btn"
                            >
                              <i className="mdi mdi-account-multiple-plus"></i> Criar Contato
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                )}
              </Col>
            </Row>
          )}
        </Col>
      </Row>
      <Row style={{ marginTop: '40px' }}>
        <Col>
          {selectedAgency && (
            <Row>
              <Col sm="12">
                <p><i className="mdi mdi-account-multiple-outline"></i> Contatos da {selectedAgency.name}</p>
                {personsByAgency.length <= 0 ? (
                  <>
                    <p className="text-muted">
                      <i className="mdi mdi-alert-box-outline"></i> Nenhum contato para essa agencia encontrado, você pode{' '}
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentType('person');
                          setCurrentRelation(selectedAgency);
                          toggle();
                        }}
                        style={{
                          fontWeight: '800',
                        }}
                      >
                        clicar aqui para criar um novo
                      </a>
                    </p>
                  </>
                ) : (
                  <div className="table-responsive">
                    <Table className="table mb-0">
                      <tbody>
                        <tr>
                          <td>Seleção</td>
                          <td>Nome</td>
                          <td>Cargo</td>
                          <td>Contato Estrategico</td>
                        </tr>
                        {personsByAgency.map(
                          (item, index) => (
                            <tr key={item._id}>
                              <th scope="row">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`defaultCheck1-${item._id}`}
                                  value={item._id}
                                  onChange={() =>
                                    toggleSelectedContact(item, selectedAgency._id)
                                  } // Adiciona a função de toggle aqui
                                />
                              </th>
                              <td>{item.name}</td>
                              <td>Cargo</td>
                              <td>
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="estrategicContact"
                                  id={`estrategic-${item._id}`}
                                  value={item._id}
                                  onChange={() =>
                                    handleEstrategicSelect(item)
                                  }
                                />
                              </td>
                            </tr>
                          )
                        )}
                        <tr>
                          <th
                            scope="row"
                            style={{
                              backgroundColor: '#f0f0f0',
                            }}
                          ></th>
                          <td
                            style={{
                              backgroundColor: '#f0f0f0',
                            }}
                          >
                            Não achou o contato que procura?
                          </td>
                          <td
                            style={{
                              backgroundColor: '#f0f0f0',
                            }}
                          ></td>
                          <td
                            style={{
                              backgroundColor: '#f0f0f0',
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentType('person');
                                setCurrentRelation(selectedAgency);
                                toggle();
                              }}
                              className="btn btn-outline-primary"
                            >
                              Criar Contato
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                )}
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Contacts
