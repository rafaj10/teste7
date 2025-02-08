import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Table,
} from 'reactstrap';
import Tour from 'reactour';
import {
  getPersonsByAgency as onGetPersonsByAgency,
} from '../../../store/peoples/actions';
import moment from 'moment/moment';
import verificationImg from '../../../assets/images/verification-img.png';

const Agency = ({
  selectedCompany,
  leadHasAgency,
  setLeadHasAgency,
  selectedAgency,
  setCurrentType,
  setCurrentRelation,
  toggle,
  agenciesByCompany,
  setSelectedAgency,
  dispatch,
  typeBoard,
}) => {
  const [isTourOpen, setIsTourOpen] = useState(false);

  const initialTourSteps = [
    {
      selector: '.form-switch-lg',
      content: 'Aqui você pode definir se a oportunidade ou lead terá uma agência associada.',
    },
  ];

  const additionalTourSteps = [
    {
      selector: '.agency-list',
      content: 'Esta é a lista de agências associadas à empresa selecionada.',
    },
    {
      selector: '.use-agency-btn',
      content: 'Clique aqui para usar esta agência na oportunidade ou lead.',
    },
    {
      selector: '.create-agency-link',
      content: 'Se não encontrar a agência, clique aqui para criar uma nova.',
    },
  ];

  const tourSteps = leadHasAgency
    ? [...initialTourSteps, ...additionalTourSteps]
    : initialTourSteps;

  const findValue = (arr, type) => {
    if (!arr) return '';
    let myValue = '';
    arr.map((item) => {
      if (item.type.toLowerCase() === type) myValue = item.value;
    });
    return myValue;
  };

  return (
    <React.Fragment>
      <Tour
        steps={tourSteps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
      />
            {typeBoard === 'crm' ? (
        <p style={{ marginTop:'29px'}} className="card-title-desc mb-4">
          Você pode ou não já vincular uma agencia para essa oportunidade, para entender melhor <a
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
          Você pode ou não já vincular uma agencia para esse lead, para entender melhor <a
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
      {!selectedCompany ? (
        <div>
          <Row>
            <Col>
              <div
                className="text-center form-switch form-switch-lg mb-3"
                style={{ marginTop: '20px' }}
              >
                <label>
                  Atenção para seguir você precisa
                  cadastrar os dados do lead corretamente
                </label>
              </div>
            </Col>
          </Row>
        </div>
      ) : (
        <div>
          <Row>
            <Col>
              <div
                className="text-center form-switch form-switch-lg mb-3"
                style={{ marginTop: '20px' }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="customSwitchsizelg"
                  defaultChecked={leadHasAgency}
                  onClick={() => {
                    setLeadHasAgency(!leadHasAgency);
                    setSelectedAgency(null);
                    if (!leadHasAgency) {
                      setIsTourOpen(true);
                    }
                  }}
                />
                {typeBoard === 'crm' ? (
                  <label
                    className="form-check-label"
                    htmlFor="customSwitchsizelg"
                  >
                    Esta oportunidade terá agencia
                  </label>
                ) : (
                  <label
                    className="form-check-label"
                    htmlFor="customSwitchsizelg"
                  >
                    Este lead terá agencia
                  </label>
                )}
              </div>
            </Col>
          </Row>
          {leadHasAgency && (
            <React.Fragment>
              <Row>
                <Col sm="12">
                  {agenciesByCompany.length <= 0 ? (
                    <Row className="justify-content-center mt-lg-5">
                      <Col xl="5" sm="8">
                        <Card>
                          <CardBody>
                            <div className="text-center">
                              <Row className="justify-content-center">
                                <Col lg="10">
                                  <p className="text-muted mt-3">
                                    Oops, nenhuma Agencia encontrada ...
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
                  ) : (
                    <div className="table-responsive agency-list">
                      <p className="card-title-desc mb-4" style={{ marginLeft: '10px' }}>
                        Lista de agencias
                      </p>
                      <Table className="table mb-0">
                        <tbody>
                          {agenciesByCompany.map(
                            (item, index) => (
                              <tr key={index}>
                                <th scope="row">
                                  {item._id === selectedAgency?._id && (
                                    <i className="mdi mdi-check-circle-outline text-success"></i>
                                  )} {item.name}
                                </th>
                                <td>{findValue(item.documents, 'cnpj')}</td>
                                <td>{moment(item.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                                <td>
                                  {item._id === selectedAgency?._id ? (
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedAgency(null);
                                      }}
                                      className="btn btn-outline-primary use-agency-btn"
                                    >
                                      {item._id === selectedAgency?._id && (
                                        <i className="mdi mdi-check-circle-outline text-success"></i>
                                      )} Deixar de usar
                                    </button>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedAgency(item);
                                        dispatch(onGetPersonsByAgency(item._id));
                                      }}
                                      className="btn btn-outline-primary use-agency-btn"
                                    >
                                      Usar essa
                                    </button>
                                  )}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card>
                    <CardBody>
                      <div className="text-center">
                        <div>
                          <p className="text-muted">
                            Caso não encontre você pode{' '}
                            <a
                              onClick={() => {
                                setCurrentType('agency');
                                setCurrentRelation(selectedCompany);
                                toggle();
                              }}
                              className="create-agency-link"
                              style={{
                                fontWeight: '800',
                              }}
                            >
                              clicar aqui para criar uma nova
                            </a>
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </React.Fragment>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default Agency