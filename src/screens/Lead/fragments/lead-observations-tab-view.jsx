import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from 'reactstrap'
import { toast } from 'sonner'
import * as Yup from 'yup'
import { dateToViewAndHour } from '../../../helpers/frontend_helper'
import {
  createObservationReq,
  getLeadObservationsReq,
} from '../../../store/lead/actions'
import { useLeadSelector } from '../../../store/lead/selectors'

const observationValidation = Yup.object({
  title: Yup.string().required('Título é obrigatório'),
  description: Yup.string().required('Descrição é obrigatória'),
})

export const LeadObservationsTabView = ({ id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({ description: '', files: [] })
  const dispatch = useDispatch()

  const { observations, isObservationsEmpty } = useLeadSelector()

  const toggleModal = () => setIsModalOpen(!isModalOpen)

  const onCreateObservation = async (e) => {
    try {
      const data = await observationValidation.validate(form)
      dispatch(createObservationReq({ id, ...data }, toggleModal))
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    dispatch(getLeadObservationsReq({ id }))
  }, [])

  return (
    <>
      <div className="padding-content">
        <div className="mb-4 mt-2">
          <Button color="primary" onClick={toggleModal}>
            <i className="fa fa-plus-circle" /> Nova observação
          </Button>
        </div>

        {observations.loading && <Spinner />}

        {!observations.loading && observations.error && (
          <div className="text-center mt-4">
            <i
              className="fa fa-exclamation-triangle text-danger mb-2"
              style={{ fontSize: 40 }}
            />
            <p>Ocorreu um erro ao buscar suas observações</p>
          </div>
        )}

        {isObservationsEmpty && (
          <div className="text-center">
            <h4>Nenhuma observação cadastrada</h4>
          </div>
        )}

        {!observations.loading && !observations.error && (
          <div className="mt-4">
            <ul className="verti-timeline list-unstyled">
              {/* Render Horizontal Timeline Events */}
              {observations.data.map((desc, key) => (
                <li key={key} className="event-list">
                  <div className="event-timeline-dot">
                    <i className={'bx bx-right-arrow-circle'} />
                  </div>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <div>
                        <h6 className="mb-2">
                          {dateToViewAndHour(desc.createdAt)}
                        </h6>
                        <h5>{desc.title}</h5>
                        <p className="text-muted">{desc.description}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Modal toggle={toggleModal} isOpen={isModalOpen} size="lg">
        <ModalHeader toggle={toggleModal}>Nova observação</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="title">Título</Label>
            <Input
              type="text"
              name="title"
              id="title"
              onChange={({ target }) =>
                setForm({ ...form, title: target.value })
              }
            />
          </FormGroup>
          <FormGroup>
            <Label for="description">Descrição</Label>
            <Input
              type="textarea"
              name="description"
              id="description"
              onChange={({ target }) =>
                setForm({ ...form, description: target.value })
              }
            />
          </FormGroup>
          {/* <FormGroup>
            <Label for="files">Arquivo</Label>
            <Input
              type="file"
              name="files"
              id="files"
              multiple={true}
              onChange={(e) =>
                setForm({
                  ...form,
                  files: e.target.files,
                })
              }
            />
          </FormGroup> */}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Cancelar
          </Button>
          <Button color="primary" onClick={onCreateObservation}>
            Salvar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
