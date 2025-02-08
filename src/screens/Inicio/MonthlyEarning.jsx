import React from 'react'

import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap'
import { Link } from 'react-router-dom'

import ApexRadial from './ApexRadial'

const MonthlyEarning = () => {
  return (
    <React.Fragment>
      {' '}
      <Card>
        <CardBody>
          <CardTitle className="mb-4">Performance</CardTitle>
          <Row>
            <Col sm="6">
              <p className="text-muted">Este mês</p>
              <h3>---</h3>
              <p className="text-muted">
                <span className="text-success me-2">
                  {' '}
                  --% <i className="mdi mdi-arrow-up"></i>{' '}
                </span>{' '}
                Aumento no último periodo
              </p>
            </Col>
            <Col sm="6">
              <div className="mt-4 mt-sm-0">
                <ApexRadial dataColors='["--bs-primary"]' />
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}

export default MonthlyEarning
