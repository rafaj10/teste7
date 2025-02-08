import React, { useState, useEffect } from "react"
import {
  Card,
  CardBody,
  Col,
  Row,
  Modal,
  ModalBody,
  ModalHeader,
  Button,
} from "reactstrap"

const ModalConfirmation = (props) => {
  return (
    <React.Fragment>
      <Modal id="modalForm" isOpen={props.modal} toggle={() => props.toggle(false)} centered={true} size="md">
        <ModalHeader toggle={() => props.toggle(false)}>
          Atenção
        </ModalHeader>
        <ModalBody style={{ backgroundColor: '#f0f0f0' }}>
            <Row>
                <Col xs="12">
                  <Card>
                      <CardBody>
                        Deseja mesmo deletar? Essa ação pode ter consequencias perigosas!
                      </CardBody>
                  </Card>
                </Col>
            </Row>
            <Row>
              <Col lg={20}>
                <div className="d-flex flex-wrap gap-2">
                      <Button type="button" color="danger" onClick={() => props.toggle(true)}>
                        Desejo deletar
                      </Button>
                      <Button type="button" color="secondary" onClick={() => props.toggle(false)}>
                        Cancelar
                      </Button>
                </div>
              </Col>
            </Row>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default ModalConfirmation
