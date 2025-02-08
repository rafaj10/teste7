import React from 'react';
import { Row, Col, Card, CardBody, Label, Input } from 'reactstrap';
import { Link } from 'react-router-dom';

import avatar1 from '../../assets/images/users/avatar-2.jpg';
import profileImg from '../../assets/images/profile-img.png';
import PropTypes from 'prop-types'; // Importando PropTypes

const WelcomeComp = (props) => {
  const { tenant, tenants, user } = props;

  const selectNewTenant = (tenant) => {
    localStorage.setItem('userDefaultTenant', JSON.stringify(tenant));
    window.location.reload();
  };

  return (
    <React.Fragment>
      <Card className="overflow-hidden">
        <div className="bg-primary-subtle">
          <Row>
            <Col xs="7">
              <div className="text-primary p-3">
                <h5 className="text-primary">Seja bem vindo</h5>
                <p>{tenant.name}</p>
              </div>
              {Array.isArray(tenants) && tenants.length > 1 ? (
                <div className="p-3" style={{ marginTop:'-35px'}}>
                  <Label for="tenantSelect" className="form-label">
                    Trocar a empresa:
                  </Label>
                  <Input
                    type="select"
                    id="tenantSelect"
                    value={tenant._id}
                    onChange={(e) => {
                      const selectedTenantId = e.target.value;
                      const selectedTenant = tenants.find(
                        (t) => t._id === selectedTenantId
                      );
                      if (selectedTenant) {
                        selectNewTenant(selectedTenant);
                      }
                    }}
                    className="form-select"
                  >
                    {tenants.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </Input>
                </div>
              ) : (
                <div className="text-primary p-3"></div>
              )}
            </Col>
            <Col xs="5" className="align-self-end">
              <img src={profileImg} alt="Profile" className="img-fluid" />
            </Col>
          </Row>
        </div>
        <CardBody className="pt-0">
          <Row>
            <Col sm="8">
              <div className="avatar-md profile-user-wid mb-4">
                <img
                  src={avatar1}
                  alt="User Avatar"
                  className="img-thumbnail rounded-circle"
                />
              </div>
              <h5 className="font-size-15 text-truncate">{user.name}</h5>
              <p className="text-muted mb-0 text-truncate">{user.email}</p>
              {/* <p className="text-muted mb-0 text-truncate">Perfil SDR</p> */}
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

// Definindo PropTypes para o componente
WelcomeComp.propTypes = {
  tenant: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  tenants: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};

// Definindo valores padrão para props (opcional)
WelcomeComp.defaultProps = {
  tenants: [],
};

export default WelcomeComp;
