import React from 'react'
import { Card, CardBody, CardTitle, Row, Col } from 'reactstrap'
import { useDashboard } from '../../store/dashboard/hooks'
import moment from 'moment/moment'
import verificationImg from '../../assets/images/verification-img.png'

const ActivityComp = () => {
  const { getDashboardInfo } = useDashboard()
  const { data, isLoading } = getDashboardInfo()

  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <CardTitle className="mb-4">Últimas atividades</CardTitle>
          <ul className="verti-timeline list-unstyled">
            {isLoading && <li className="event-list">Carregando...</li>}
            {(data?.histories || []).slice(0, 10).map((item, index) => (
              <li
                className={`event-list ${item.active && 'active'}`}
                key={index}
              >
                <div className="event-timeline-dot">
                  <i className={`bx bx-right-arrow-circle font-size-18`} />
                </div>
                <div className="flex-shrink-0 d-flex">
                  <div className="me-3">
                    <h5 className="font-size-14">
                      {moment(item.createdAt).format('DD/MM/YYYY HH:mm')}
                      <i className="bx bx-right-arrow-alt font-size-16 text-primary align-middle ms-2" />
                    </h5>
                  </div>
                  <div className="flex-grow-1">
                    <div>{item.description}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardBody>
        {(data?.histories ?? []).length == 0 && (
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
        )}
      </Card>
    </React.Fragment>
  )
}

export default ActivityComp
