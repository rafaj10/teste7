import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import Tour from 'reactour';

// Pages Components
import WelcomeComp from './WelcomeComp';
import ActivityComp from './ActivityComp';

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

import { useDashboard } from '../../store/dashboard/hooks';

const Inicio = (props) => {
  document.title = '7stratos | Inicio';

  const [user, setUser] = useState({});
  const [tenant, setTenant] = useState({});
  const [tenants, setTenants] = useState({});
  const dashboard = useDashboard();
  const { data, isLoading } = dashboard.getDashboardInfo();
  const [isTourOpen, setIsTourOpen] = useState(false);

  const selectNewTenant = tenant => {
    localStorage.setItem(
      'userDefaultTenant',
      JSON.stringify(tenant)
    )
  }

  useEffect(() => {
    if (localStorage.getItem('user')) {
      const obj = JSON.parse(localStorage.getItem('user'));
      const objTenant = JSON.parse(localStorage.getItem('userDefaultTenant'));
      const objTenants = JSON.parse(localStorage.getItem('userTenants'));
      setUser(obj);
      setTenant(objTenant);
      setTenants(objTenants);
      console.log(JSON.stringify(objTenants))
    }
  }, [props.success]);

  const tourSteps = [
    {
      selector: '.welcome-comp',
      content: 'Bem-vindo ao painel de controle! Aqui você vê informações do teu usuario.',
    },
    {
      selector: '.mini-stats-wid:nth-child(1)',
      content: 'Esta seção mostra alguns dos principais números da tua jornada na 7stratos.',
    },
    {
      selector: '.activity-comp',
      content: 'Aqui estão listadas as últimas atividades realizadas.',
    },
  ];

  return (
    <React.Fragment>
      <Tour
        steps={tourSteps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
        startAt={0}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={'Bem vindo'} breadcrumbItem={tenant.name} />
          <Row>
            <Col xl="4">
              <WelcomeComp user={user} tenant={tenant} tenants={tenants} className="welcome-comp" />
            </Col>
            <Col xl="8">
              <Row>
                <Col md="4">
                  <Card className="mini-stats-wid">
                    <CardBody>
                      <div className="d-flex">
                        <div className="flex-grow-1">
                          <p className="text-muted fw-medium">Leads</p>
                          <h4 className="mb-0">{data?.counters?.leads}</h4>
                        </div>
                        <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-primary">
                              <i className={"bx bx-filter-alt font-size-24"}></i>
                            </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4">
                  <Card className="mini-stats-wid">
                    <CardBody>
                      <div className="d-flex">
                        <div className="flex-grow-1">
                          <p className="text-muted fw-medium">Atividades</p>
                          <h4 className="mb-0">{data?.counters?.leadTasks}</h4>
                        </div>
                        <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-primary">
                              <i className={"bx bx-copy-alt font-size-24"}></i>
                            </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="4">
                  <Card className="mini-stats-wid">
                    <CardBody>
                      <div className="d-flex">
                        <div className="flex-grow-1">
                          <p className="text-muted fw-medium">Ligações</p>
                          <h4 className="mb-0">
                            {data?.counters?.leadTasksByType?.call || 0}
                          </h4>
                        </div>
                        <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-primary">
                              <i className={"bx bx-phone-call font-size-24"}></i>
                            </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              <Card>
                <CardBody className="activity-comp">
                  <ActivityComp />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Inicio