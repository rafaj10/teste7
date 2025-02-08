import PropTypes from 'prop-types'
import React from "react"
import { Modal, Label, FormFeedback, Row, Form, Col, FormGroup, ModalBody, Button, Input } from "reactstrap"
import './agenda.css'
import * as Yup from "yup";
import { useFormik } from "formik";
import { useMeetings } from '../../store/meetings/hooks';
import InputMask from "react-input-mask"
import moment from 'moment/moment';

const CreateMeetingSchema = Yup.object({
  title: Yup.string().required('Campo obrigatório'),
  type: Yup.string().required('Campo obrigatório'),
  link: Yup.string(),
  from: Yup.string().required('Campo obrigatório')
    .test('is-date', 'Data/Hora inválida', (value) => {
      return moment(value, 'DD/MM/YYYY HH:mm', true).isValid()
    }),
  to: Yup.string().required('Campo obrigatório')
    .test('is-date', 'Data/Hora inválida', (value) => {
      return moment(value, 'DD/MM/YYYY HH:mm', true).isValid()
    })
    .test('is-greater', 'Data/Hora precisa ser maior que a data inicial', function(value) {
      const from = this.parent.from
      if (!from || !value) {
        return true
      }
      return moment(value, 'DD/MM/YYYY HH:mm').isAfter(moment(from, 'DD/MM/YYYY HH:mm'))
    }),
})

const MeetingCreateModal = ({ show, onCloseClick }) => {
  const createMeeting = useMeetings().createMeeting()
  const meetings = useMeetings().getMeetings()

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: '',
      type: '',
      link: '',
      from: '',
      to: '',
    },
    validationSchema: CreateMeetingSchema,
    onSubmit: (values, { resetForm }) => {
      const payload = {
        ...values,
        from: moment(values.from, 'DD/MM/YYYY HH:mm').toISOString(),
        to: moment(values.to, 'DD/MM/YYYY HH:mm').toISOString(),
      }
      createMeeting.mutate(payload, {
        onSuccess: () => {
          meetings.refetch()
          onCloseClick()
          resetForm()
        }
      })
    }
  })

  return (
    <Modal
      isOpen={show}
      toggle={() => {
        onCloseClick()
        validation.resetForm()
      }}
      centered={true}
    >
      <ModalBody className="py-3 px-5">
        <div className="agenda-modal-container">
          <Form onSubmit={(e) => {
            e.preventDefault()
            console.log(validation)
            validation.handleSubmit()
            return false
          }}>
            <FormGroup>
              <Label>Título</Label>
              <Input
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                invalid={validation.touched.title && !!validation.errors.title}
                name="title"
                value={validation.values.title || ''}
              />
              {validation.touched.title && validation.errors.title ? (
                <FormFeedback type="invalid">
                  {validation.errors.title}
                </FormFeedback>
              ) : null}
            </FormGroup>
            <FormGroup>
              <Label>Tipo</Label>
              <Input
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                invalid={validation.touched.type && !!validation.errors.type}
                name="type"
                value={validation.values.type || ''}
              />
              {validation.touched.type && validation.errors.type ? (
                <FormFeedback type="invalid">
                  {validation.errors.type}
                </FormFeedback>
              ) : null}
            </FormGroup>
            <FormGroup>
              <Label>Link</Label>
              <Input
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                invalid={validation.touched.link && !!validation.errors.link}
                name="link"
                value={validation.values.link || ''}
              />
              {validation.touched.link && validation.errors.link ? (
                <FormFeedback type="invalid">
                  {validation.errors.link}
                </FormFeedback>
              ) : null}
            </FormGroup>
            <Row>
              <Col>
                <FormGroup>
                  <Label>De</Label>
                  <InputMask
                    mask={"99/99/9999 99:99"}
                    maskChar={null}
                    placeholder="dd/mm/yyyy hh:mm"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    invalid={validation.touched.from && !!validation.errors.from}
                    name="from"
                    children={(inputProps) => <Input {...inputProps} />}
                  />
                  {validation.touched.from && validation.errors.from ? (
                    <FormFeedback type="invalid">
                      {validation.errors.from}
                    </FormFeedback>
                  ) : null}
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Até</Label>
                  <InputMask
                    mask={"99/99/9999 99:99"}
                    maskChar={null}
                    placeholder="dd/mm/yyyy hh:mm"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    invalid={validation.touched.to && !!validation.errors.to}
                    name="to"
                    value={validation.values.to || ''}
                    children={(inputProps) => <Input {...inputProps} />}
                  />
                  {validation.touched.to && validation.errors.to ? (
                    <FormFeedback type="invalid">
                      {validation.errors.to}
                    </FormFeedback>
                  ) : null}
                </FormGroup>
              </Col>
            </Row>
            <Button type="submit">
              Teste
            </Button>
          </Form>
        </div>
      </ModalBody>
    </Modal>
  )
}

MeetingCreateModal.propTypes = {
  onCloseClick: PropTypes.func,
  show: PropTypes.any
}

export default MeetingCreateModal