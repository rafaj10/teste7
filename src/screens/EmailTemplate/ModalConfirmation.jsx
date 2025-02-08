import React from 'react'
import { Modal, ModalBody, Button, ModalHeader } from 'reactstrap'
import { useEmailTemplate } from '../../store/emailtemplate/hooks'

const ModalConfirmation = (props) => {
  const emailTemplate = useEmailTemplate()
  const { mutateAsync: remove } = emailTemplate.remove()

  const handleDelete = async () => {
    await remove(props.templateId)
    props.toggle()
  }

  return (
    <Modal
      id="modalConfirmation"
      isOpen={props.modal}
      toggle={props.toggle}
      centered={true}
    >
      <ModalHeader toggle={props.toggle}>Confirmar Exclusão</ModalHeader>
      <ModalBody>
        <p>Tem certeza que deseja excluir este template?</p>
        <div className="d-flex justify-content-end">
          <Button color="secondary" onClick={props.toggle}>
            Cancelar
          </Button>
          <Button color="danger" className="ms-2" onClick={handleDelete}>
            Excluir
          </Button>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ModalConfirmation
