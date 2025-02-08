import React from 'react'
import { Modal, ModalBody, ModalHeader, Button } from 'reactstrap'

const ModalConfirmation = ({ modal, toggle, onConfirm }) => {
  return (
    <Modal isOpen={modal} toggle={toggle} fade={false}>
      <ModalHeader toggle={toggle}>Confirmar Ação</ModalHeader>
      <ModalBody>
        <p>Tem certeza que deseja excluir este workflow?</p>
        <div className="d-flex justify-content-end">
          <Button color="danger" onClick={onConfirm}>
            Confirmar
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancelar
          </Button>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ModalConfirmation
