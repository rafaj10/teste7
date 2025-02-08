import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import {
  Button,
  Col,
  Container,
  Form,
  ModalBody,
  ModalFooter,
  Row,
} from 'reactstrap'
import * as Yup from 'yup'
import { getLoggedInUser } from '../../../helpers/backend_helper'
import { createMeetingReq } from '../../../store/lead/actions'
import { FormInput } from './form-group-input'
import useLead from '../../../store/lead/hooks'
import { useMeetings } from '../../../store/meetings/hooks'

const MEETINGTYPE = [
  { value: 'presential', label: 'Presencial' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'google_meet', label: 'Google Meet' },
  { value: 'teams', label: 'Microsoft Teams' },
  { value: 'other', label: 'Outros' },
]

export const LeadMeetingCreateView = ({ leadId, toggleModal }) => {
  const dispatch = useDispatch()
  const leadHooks = useLead().getLead()
  const contacts = leadHooks?.data?.contacts
  const meetings = useMeetings().getMeetings()

  const onCreateMeeting = async (value) => {
    const data = {
      ...value,
      from: `${value.fromDate}T${value.fromTime}:00.000Z`,
      to: `${value.toDate}T${value.toTime}:00.000Z`,
      responsible: getLoggedInUser()?._id,
      leadId,
    }

    dispatch(createMeetingReq(data, () => {
      toggleModal()
      meetings.refetch()
    }))
  }

  const validation = useFormik({
    enableReinitialize: true,
    validationSchema: Yup.object({
      type: Yup.string().required('Campo obrigatório'),
      title: Yup.string().required('Campo obrigatório'),
      // link: Yup.string().required('Campo obrigatório'),
      contact: Yup.string().required('Campo obrigatório'),
      fromDate: Yup.date('Data inválida').required('Campo obrigatório'),
      fromTime: Yup.string().required('Campo obrigatório'),
      toDate: Yup.date('Data inválida').required('Campo obrigatório'),
      toTime: Yup.string().required('Campo obrigatório'),
    }),
    initialValues: {
      type: '',
      title: '',
      link: '',
      contact: '',
      fromDate: '',
      fromTime: '',
      toDate: '',
      toTime: '',
    },
    onSubmit: (value) => onCreateMeeting(value),
  })

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        validation.handleSubmit()
        return false
      }}
    >
      <ModalBody>
        <Container>
          <Row>
            <Col>
              <FormInput
                name="type"
                label="Tipo de Reunião"
                type="select"
                validation={validation}
              >
                <option value="">Selecione</option>
                {MEETINGTYPE.map((e, i) => (
                  <option key={i} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </FormInput>
            </Col>
            <Col>
              <FormInput
                name="contact"
                label="Contato"
                type="select"
                validation={validation}
              >
                <option value="">Selecione</option>
                {contacts.map((e, i) => (
                  <option key={i} value={e?.person?._id}>
                    {e?.person?.name} {e?.strategic ? '(Estratégico)' : ''}
                  </option>
                ))}
              </FormInput>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormInput
                name="fromDate"
                label="Data Inicial"
                type="date"
                validation={validation}
              />
            </Col>
            <Col>
              <FormInput
                name="fromTime"
                label="Hora Inicial"
                type="time"
                validation={validation}
              />
            </Col>
            <Col>
              <FormInput
                name="toDate"
                label="Data Final"
                type="date"
                validation={validation}
              />
            </Col>
            <Col>
              <FormInput
                name="toTime"
                label="Hora Final"
                type="time"
                validation={validation}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <FormInput
                name="title"
                label="Assunto"
                type="text"
                validation={validation}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <FormInput
                name="link"
                label="Link"
                type="text"
                validation={validation}
              />
            </Col>
          </Row>
        </Container>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" type="submit">
          Salvar
        </Button>
      </ModalFooter>
    </Form>
  )
}