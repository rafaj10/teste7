import React from "react"
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md={6}>{new Date().getFullYear()} © 7stratos.</Col>
            <Col md={6}>
              <div className="text-sm-end d-none d-sm-block">
              v1.0.0 <i className="mdi mdi-heart text-danger" /> {" " + import.meta.env.VITE_APP_ENV}

              </div>
            </Col>  
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
