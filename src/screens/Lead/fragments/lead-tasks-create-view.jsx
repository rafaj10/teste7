import { useFormik } from 'formik'
import {
  Button,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  ModalBody,
  ModalFooter,
  Row,
} from 'reactstrap'
import * as Yup from 'yup'
import { getLoggedInUser } from '../../../helpers/backend_helper'
import useLead from '../../../store/lead/hooks'
import { useMeetings } from '../../../store/meetings/hooks'
import moment from 'moment'

const TASKTYPES = [
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'email', label: 'E-mail' },
  { value: 'other', label: 'Outros' },
]

const CHANNELS = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'E-mail' },
  { value: 'phone', label: 'Telefone' },
]

export const LeadTasksCreateView = ({ leadId, toggleModal, task }) => {
  const meetings = useMeetings().getMeetings()
  const leadHooks = useLead().getLead()
  const tasks = useLead().getLeadTasks(leadId)
  const createTask = useLead().createOrUpdateTask()
  const lead = leadHooks?.data

  const onCreateTask = async (value) => {
    const data = {
      ...value,
      dueDate: `${value.date}T${value.time}:00.000Z`,
      responsible: getLoggedInUser()?._id,
      leadId,
      _id: task?._id,
    }

    await createTask.mutateAsync(data, {
      onSuccess: () => {
        toggleModal({ open: false, task: undefined })
        meetings.refetch()
        leadHooks.refetch()
        tasks.refetch()
      },
    })
  }

  const getDueDateTime = (date) => {
    if (!date) return ''
    const dateObj = new Date(date)
    const timeFormat = moment(dateObj).format('HH:mm')
    return timeFormat
  }

  const getDueDate = (date) => {
    if (!date) return ''
    const dateObj = new Date(date)
    const day = dateObj.getDate()
    const month = dateObj.getMonth() + 1
    const year = dateObj.getFullYear()
    return `${year}-${month < 10 ? `0${month}` : month}-${
      day < 10 ? `0${day}` : day
    }`
  }

  const validation = useFormik({
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required('Campo obrigatório'),
      channel: Yup.string().required('Campo obrigatório'),
      type: Yup.string().required('Campo obrigatório'),
      date: Yup.date('Data inválida').required('Campo obrigatório'),
      time: Yup.string().required('Campo obrigatório'),
      contact: Yup.string().required('Campo obrigatório'),
    }),
    initialValues: {
      date: getDueDate(task?.dueDate),
      time: getDueDateTime(task?.dueDate),
      type: task?.type || '',
      channel: task?.channel || '',
      title: task?.title || '',
      contact: task?.contact?._id || '',
    },
    onSubmit: (value) => onCreateTask(value),
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
              <FormGroup>
                <Label className="form-label">Data da tarefa</Label>
                <Input
                  type="date"
                  name="date"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.date || ''}
                  invalid={
                    validation.touched.date && validation.errors.date
                      ? true
                      : false
                  }
                />
                {validation.touched.date && validation.errors.date ? (
                  <FormFeedback type="invalid">
                    {validation.errors.date}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label className="form-label">Hora</Label>
                <Input
                  type="time"
                  name="time"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.time || ''}
                  invalid={
                    validation.touched.time && validation.errors.time
                      ? true
                      : false
                  }
                />
                {validation.touched.time && validation.errors.time ? (
                  <FormFeedback type="invalid">
                    {validation.errors.time}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label className="form-label">Tipo da tarefa</Label>
                <Input
                  type="select"
                  name="type"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.type || ''}
                  invalid={
                    validation.touched.type && validation.errors.type
                      ? true
                      : false
                  }
                >
                  <option value="">Selecione</option>
                  {TASKTYPES.map((e, i) => (
                    <option key={i} value={e.value}>
                      {e.label}
                    </option>
                  ))}
                </Input>
                {validation.touched.type && validation.errors.type ? (
                  <FormFeedback type="invalid">
                    {validation.errors.type}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <Label className="form-label">Contato do Lead</Label>
                <Input
                  type="select"
                  name="contact"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.contact || ''}
                  invalid={
                    validation.touched.contact && validation.errors.contact
                      ? true
                      : false
                  }
                >
                  <option value="">Selecione</option>
                  {lead.contacts.map((e, i) => (
                    <option key={i} value={e.person?._id}>
                      {e.person?.name} {e.strategic ? '(Estratégico)' : ''}
                    </option>
                  ))}
                </Input>
                {validation.touched.channel && validation.errors.channel ? (
                  <FormFeedback type="invalid">
                    {validation.errors.channel}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label className="form-label">Canal de comunicação</Label>
                <Input
                  type="select"
                  name="channel"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.channel || ''}
                  invalid={
                    validation.touched.channel && validation.errors.channel
                      ? true
                      : false
                  }
                >
                  <option value="">Selecione</option>
                  {CHANNELS.map((e, i) => (
                    <option key={i} value={e.value}>
                      {e.label}
                    </option>
                  ))}
                </Input>
                {validation.touched.channel && validation.errors.channel ? (
                  <FormFeedback type="invalid">
                    {validation.errors.channel}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <Label className="form-label">Assunto</Label>
                <Input
                  type="text"
                  name="title"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.title || ''}
                  invalid={
                    validation.touched.title && validation.errors.title
                      ? true
                      : false
                  }
                />
                {validation.touched.title && validation.errors.title ? (
                  <FormFeedback type="invalid">
                    {validation.errors.title}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
        </Container>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" type="submit">
          {tasks !== undefined ? 'Atualizar' : 'Criar'}
        </Button>
      </ModalFooter>
    </Form>
  )
}
