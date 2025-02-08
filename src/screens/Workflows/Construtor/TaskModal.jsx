import React, { useState } from 'react'
import {
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  Row,
  Col,
  Button,
  Input,
  Label,
  FormFeedback,
} from 'reactstrap'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const TaskModal = ({ isOpen, toggle, onSubmit }) => {
  const validationSchema = Yup.object({
    title: Yup.string().required('Preencha o título'),
    trigger: Yup.string().required('Selecione o gatilho'),
    whenType: Yup.string().required('Selecione o tipo de quando'),
    whenValue: Yup.number().required('Preencha o valor de quando'),
  })

  const formik = useFormik({
    initialValues: {
      title: '',
      trigger: 'now',
      whenType: 'hours',
      whenValue: 1,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values)
      toggle()
    },
  })

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Adicionar Tarefa</ModalHeader>
      <ModalBody>
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col xs="12">
              <div className="mb-3">
                <Label className="form-label">Título</Label>
                <Input
                  name="title"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.title}
                  invalid={formik.touched.title && formik.errors.title}
                />
                {formik.touched.title && formik.errors.title && (
                  <FormFeedback>{formik.errors.title}</FormFeedback>
                )}
              </div>
              <div className="mb-3">
                <Label className="form-label">Gatilho</Label>
                <Input
                  type="select"
                  name="trigger"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.trigger}
                  invalid={formik.touched.trigger && formik.errors.trigger}
                >
                  <option value="now">Agora</option>
                  <option value="after_previous">Depois do último</option>
                </Input>
                {formik.touched.trigger && formik.errors.trigger && (
                  <FormFeedback>{formik.errors.trigger}</FormFeedback>
                )}
              </div>
              <div className="mb-3">
                <Label className="form-label">Quando</Label>
                <Input
                  type="select"
                  name="whenType"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.whenType}
                  invalid={formik.touched.whenType && formik.errors.whenType}
                >
                  <option value="hours">Horas</option>
                  <option value="days">Dias</option>
                </Input>
                <Input
                  type="number"
                  name="whenValue"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.whenValue}
                  invalid={formik.touched.whenValue && formik.errors.whenValue}
                  className="mt-2"
                />
                {formik.touched.whenValue && formik.errors.whenValue && (
                  <FormFeedback>{formik.errors.whenValue}</FormFeedback>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col className="text-end">
              <Button type="submit" color="primary">
                Adicionar
              </Button>
              <Button type="button" color="secondary" onClick={toggle}>
                Cancelar
              </Button>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default TaskModal
