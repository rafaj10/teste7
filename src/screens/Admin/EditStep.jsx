import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Formik, Field, FieldArray, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
  Row,
  Col,
  Card,
  CardBody,
  Container,
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap'
import { useBoard } from '../../store/admin/useBoard'
import Swal from 'sweetalert2'

const EditStep = () => {
  const { tenantId, boardId, stepId } = useParams()
  const { data: step, isLoading } = useBoard(tenantId).getStep(boardId, stepId)
  const updateStep = useBoard(tenantId).updateStep()
  const [initialValues, setInitialValues] = useState(null)

  useEffect(() => {
    if (step) {
      setInitialValues({
        name: step.name || '',
        type: step.type || '',
        color: step.color || '',
        sla: { type: step.sla?.type || '', value: step.sla?.value || '' },
        flags: step.flags || {},
        fields: step.fields || [],
      })
    }
  }, [step])

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    type: Yup.string().required('Required'),
    color: Yup.string().required('Required'),
    sla: Yup.object({
      type: Yup.string().required('Required'),
      value: Yup.number().required('Required'),
    }),
  })

  const handleSubmit = (values, actions) => {
    const allFlags = {
      starter: values.flags.starter || false,
      allowProposal: values.flags.allowProposal || false,
      isWon: values.flags.isWon || false,
      isLost: values.flags.isLost || false,
      allowClose: values.flags.allowClose || false,
    }

    const payload = {
      ...values,
      flags: allFlags,
    }

    updateStep.mutate(
      { boardId: boardId, stepId: stepId, ...payload },
      {
        onSuccess: () => {
          Swal.fire('Success', 'Step updated successfully', 'success')
        },
        onError: (error) => {
          Swal.fire('Error', `Failed to update step: ${error.message}`, 'error')
        },
      }
    )
    actions.setSubmitting(false)
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/admin">Admin</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>Editar Etapa</BreadcrumbItem>
          </Breadcrumb>

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  {initialValues && (
                    <Formik
                      initialValues={initialValues}
                      enableReinitialize
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({
                        handleSubmit,
                        isSubmitting,
                        setFieldValue,
                        values,
                        errors,
                        touched,
                      }) => (
                        <Form onSubmit={handleSubmit}>
                          <Row>
                            <Col md={6}>
                              <FormGroup>
                                <Label for="name">Nome</Label>
                                <Field
                                  name="name"
                                  as={Input}
                                  invalid={touched.name && !!errors.name}
                                />
                                <ErrorMessage
                                  name="name"
                                  component={FormFeedback}
                                />
                              </FormGroup>
                            </Col>
                            {/* <Col md={6}>
                              <FormGroup>
                                <Label for="type">Tipo</Label>
                                <Field
                                  name="type"
                                  as={Input}
                                  type="select"
                                  onChange={(e) => {
                                    setFieldValue('type', e.target.value)
                                    setFieldValue('flags', {
                                      starter: false,
                                      isWon: false,
                                      isLost: false,
                                      allowProposal: false,
                                      allowClose: false,
                                    })
                                  }}
                                  invalid={touched.type && !!errors.type}
                                >
                                  <option value="engagement">Engagement</option>
                                  <option value="crm">CRM</option>
                                </Field>
                                <ErrorMessage
                                  name="type"
                                  component={FormFeedback}
                                />
                              </FormGroup>
                            </Col> */}
                            <Col md={6}>
                              <FormGroup>
                                <Label for="slaType">Tipo de SLA</Label>
                                <Field
                                  name="sla.type"
                                  as={Input}
                                  type="select"
                                  invalid={
                                    touched.sla?.type && !!errors.sla?.type
                                  }
                                >
                                  <option value="">Selecione um tipo de SLA</option>
                                  <option value="minutes">Minutos</option>
                                  <option value="days">Dias</option>
                                  <option value="hours">Horas</option>
                                </Field>
                                <ErrorMessage
                                  name="sla.type"
                                  component={FormFeedback}
                                />
                              </FormGroup>
                            </Col>
                          </Row>

                          <Row>
                            <Col md={6}>
                              <FormGroup>
                                <Label for="color">Cor</Label>
                                <Field
                                  name="color"
                                  as={Input}
                                  type="color"
                                  invalid={touched.color && !!errors.color}
                                />
                                <ErrorMessage
                                  name="color"
                                  component={FormFeedback}
                                />
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup>
                                <Label for="slaValue">Tempo de SLA</Label>
                                <Field
                                  name="sla.value"
                                  as={Input}
                                  type="number"
                                  invalid={
                                    touched.sla?.value && !!errors.sla?.value
                                  }
                                />
                                <ErrorMessage
                                  name="sla.value"
                                  component={FormFeedback}
                                />
                              </FormGroup>
                            </Col>
                          </Row>

                          <h5>Características da etapa</h5>
                          <Row>
                            <Col md={6}>
                              <FormGroup>
                                <Label for="flags">Características</Label>
                                <Field
                                  name="flags"
                                  as="select"
                                  multiple
                                  className="form-control"
                                  onChange={(event) => {
                                    const options = event.target.options
                                    let value = []
                                    for (
                                      let i = 0, l = options.length;
                                      i < l;
                                      i++
                                    ) {
                                      if (options[i].selected) {
                                        value.push(options[i].value)
                                      }
                                    }
                                    const updatedFlags = {
                                      starter: value.includes('starter'),
                                      allowProposal:
                                      value.includes('allowProposal'),
                                      isWon: value.includes('isWon'),
                                      isLost: value.includes('isLost'),
                                      allowClose: value.includes('allowClose'),
                                    }
                                    setFieldValue('flags', updatedFlags)
                                  }}
                                  value={Object.keys(values.flags).filter(
                                    (key) => values.flags[key]
                                  )}
                                >
                                    <>
                                      <option value="starter">Etapa Inicio</option>
                                      <option value="isWon">É etapa de Ganho</option>
                                      <option value="isLost">É etapa de Perdido</option>
                                      <option value="allowProposal">
                                        Aceita proposta nesta etapa
                                      </option>
                                      <option value="allowClose">
                                        Aceita ganhar ou perder nesta etapa
                                      </option>
                                    </>
                                </Field>
                                <ErrorMessage
                                  name="flags"
                                  component={FormFeedback}
                                />
                              </FormGroup>
                            </Col>
                          </Row>

                          <Row>
                            <Col md={12}>
                              <FormGroup>
                                <h5>Campos dinâmicos</h5>
                                <FieldArray name="fields">
                                  {({ insert, remove, push }) => (
                                    <>
                                      {values.fields.length > 0 &&
                                        values.fields.map((field, index) => (
                                          <div key={index}>
                                            <Row>
                                              <Col>
                                                <hr></hr>
                                              </Col>
                                            </Row>
                                            <Row>
                                              <Col md={3}>
                                                <FormGroup>
                                                  <Label
                                                    for={`fields.${index}.name`}
                                                  >
                                                    Nome
                                                  </Label>
                                                  <Field
                                                    name={`fields.${index}.name`}
                                                    as={Input}
                                                    invalid={
                                                      touched.fields?.[index]
                                                        ?.name &&
                                                      !!errors.fields?.[index]
                                                        ?.name
                                                    }
                                                  />
                                                  <ErrorMessage
                                                    name={`fields.${index}.name`}
                                                    component={FormFeedback}
                                                  />
                                                </FormGroup>
                                              </Col>
                                              <Col md={3}>
                                                <FormGroup>
                                                  <Label
                                                    for={`fields.${index}.label`}
                                                  >
                                                    Titulo do campo
                                                  </Label>
                                                  <Field
                                                    name={`fields.${index}.label`}
                                                    as={Input}
                                                    invalid={
                                                      touched.fields?.[index]
                                                        ?.label &&
                                                      !!errors.fields?.[index]
                                                        ?.label
                                                    }
                                                  />
                                                  <ErrorMessage
                                                    name={`fields.${index}.label`}
                                                    component={FormFeedback}
                                                  />
                                                </FormGroup>
                                              </Col>
                                              <Col md={3}>
                                                <FormGroup>
                                                  <Label
                                                    for={`fields.${index}.type`}
                                                  >
                                                    Tipo
                                                  </Label>
                                                  <Field
                                                    name={`fields.${index}.type`}
                                                    as={Input}
                                                    type="select"
                                                    onChange={(e) => {
                                                      setFieldValue(
                                                        `fields.${index}.type`,
                                                        e.target.value
                                                      )
                                                      if (
                                                        e.target.value ===
                                                        'option'
                                                      ) {
                                                        setFieldValue(
                                                          `fields.${index}.configs`,
                                                          {
                                                            list_options: [
                                                              {
                                                                key: '',
                                                                value: '',
                                                              },
                                                            ],
                                                          }
                                                        )
                                                      } else {
                                                        setFieldValue(
                                                          `fields.${index}.configs`,
                                                          {}
                                                        )
                                                      }
                                                    }}
                                                    invalid={
                                                      touched.fields?.[index]
                                                        ?.type &&
                                                      !!errors.fields?.[index]
                                                        ?.type
                                                    }
                                                  >
                                                    <option value="has_one_internal_contact">
                                                      Precisa ter um contato
                                                    </option>
                                                    <option value="has_one_internal_contact_estrategic">
                                                      Precisa ter um contato estrategico
                                                    </option>
                                                    <option value="has_one_internal_agenda">
                                                      Precisa ter um agendamento
                                                    </option>
                                                    <option value="has_one_internal_task">
                                                      Precisa ter uma tarefa
                                                    </option>
                                                    <option value="text">
                                                      Texto livre
                                                    </option>
                                                    <option value="option">
                                                      Opções
                                                    </option>
                                                  </Field>
                                                  <ErrorMessage
                                                    name={`fields.${index}.type`}
                                                    component={FormFeedback}
                                                  />
                                                </FormGroup>
                                              </Col>
                                              <Col md={2}>
                                                <FormGroup>
                                                  <Label
                                                    for={`fields.${index}.required`}
                                                  >
                                                    Obrigatório?
                                                  </Label>
                                                  <Field
                                                    name={`fields.${index}.required`}
                                                    as={Input}
                                                    type="select"
                                                    invalid={
                                                      touched.fields?.[index]
                                                        ?.required &&
                                                      !!errors.fields?.[index]
                                                        ?.required
                                                    }
                                                  >
                                                    <option value={true}>
                                                      Sim
                                                    </option>
                                                    <option value={false}>
                                                      Não
                                                    </option>
                                                  </Field>
                                                  <ErrorMessage
                                                    name={`fields.${index}.required`}
                                                    component={FormFeedback}
                                                  />
                                                </FormGroup>
                                              </Col>
                                              <Col md={1}>
                                                <Button
                                                  style={{ marginTop:'26px' }}
                                                  color="danger"
                                                  onClick={() => remove(index)}
                                                >
                                                  <i class="mdi mdi-trash-can d-block font-size-16"></i>
                                                </Button>
                                              </Col>
                                            </Row>
                                            {field.type === 'option' && (
                                              <FieldArray
                                                name={`fields.${index}.configs.list_options`}
                                              >
                                                {({ insert, remove, push }) => (
                                                  <>
                                                    {field.configs?.list_options
                                                      ?.length > 0 &&
                                                      field.configs.list_options.map(
                                                        (
                                                          option,
                                                          optionIndex
                                                        ) => (
                                                          <Row
                                                            key={optionIndex}
                                                          >
                                                            <Col md={1}></Col>
                                                            <Col md={3}>
                                                              <FormGroup>
                                                                <Label
                                                                  for={`fields.${index}.configs.list_options.${optionIndex}.key`}
                                                                >
                                                                  Key
                                                                </Label>
                                                                <Field
                                                                  name={`fields.${index}.configs.list_options.${optionIndex}.key`}
                                                                  as={Input}
                                                                  invalid={
                                                                    touched
                                                                      .fields?.[
                                                                      index
                                                                    ]?.configs
                                                                      ?.list_options?.[
                                                                      optionIndex
                                                                    ]?.key &&
                                                                    !!errors
                                                                      .fields?.[
                                                                      index
                                                                    ]?.configs
                                                                      ?.list_options?.[
                                                                      optionIndex
                                                                    ]?.key
                                                                  }
                                                                />
                                                                <ErrorMessage
                                                                  name={`fields.${index}.configs.list_options.${optionIndex}.key`}
                                                                  component={
                                                                    FormFeedback
                                                                  }
                                                                />
                                                              </FormGroup>
                                                            </Col>
                                                            <Col md={3}>
                                                              <FormGroup>
                                                                <Label
                                                                  for={`fields.${index}.configs.list_options.${optionIndex}.value`}
                                                                >
                                                                  Value
                                                                </Label>
                                                                <Field
                                                                  name={`fields.${index}.configs.list_options.${optionIndex}.value`}
                                                                  as={Input}
                                                                  invalid={
                                                                    touched
                                                                      .fields?.[
                                                                      index
                                                                    ]?.configs
                                                                      ?.list_options?.[
                                                                      optionIndex
                                                                    ]?.value &&
                                                                    !!errors
                                                                      .fields?.[
                                                                      index
                                                                    ]?.configs
                                                                      ?.list_options?.[
                                                                      optionIndex
                                                                    ]?.value
                                                                  }
                                                                />
                                                                <ErrorMessage
                                                                  name={`fields.${index}.configs.list_options.${optionIndex}.value`}
                                                                  component={
                                                                    FormFeedback
                                                                  }
                                                                />
                                                              </FormGroup>
                                                            </Col>
                                                            <Col md={2}>
                                                              <FormGroup>
                                                                <Label
                                                                  for={`fields.${index}.configs.list_options.${optionIndex}.strength`}
                                                                >
                                                                  Strength
                                                                </Label>
                                                                <Field
                                                                  name={`fields.${index}.configs.list_options.${optionIndex}.strength`}
                                                                  as={Input}
                                                                  invalid={
                                                                    touched
                                                                      .fields?.[
                                                                      index
                                                                    ]?.configs
                                                                      ?.list_options?.[
                                                                      optionIndex
                                                                    ]?.strength &&
                                                                    !!errors
                                                                      .fields?.[
                                                                      index
                                                                    ]?.configs
                                                                      ?.list_options?.[
                                                                      optionIndex
                                                                    ]?.strength
                                                                  }
                                                                />
                                                                <ErrorMessage
                                                                  name={`fields.${index}.configs.list_options.${optionIndex}.strength`}
                                                                  component={
                                                                    FormFeedback
                                                                  }
                                                                />
                                                              </FormGroup>
                                                            </Col>
                                                            <Col md={3}>
                                                              <Button
                                                                color="danger"
                                                                style={{ marginTop: '25px' }}
                                                                onClick={() =>
                                                                  remove(
                                                                    optionIndex
                                                                  )
                                                                }
                                                              >
                                                                <i class="mdi mdi-trash-can d-block font-size-16"></i>
                                                              </Button>
                                                            </Col>
                                                          </Row>
                                                        )
                                                      )}
                                                    <Button
                                                      color="secondary"
                                                      style={{ marginLeft:'90px', marginBottom:'20px'}}
                                                      onClick={() =>
                                                        push({
                                                          key: '',
                                                          value: '',
                                                        })
                                                      }
                                                    >
                                                      + opção
                                                    </Button>
                                                  </>
                                                )}
                                              </FieldArray>
                                            )}
                                          </div>
                                        ))}
                                      <hr></hr>
                                      <Button
                                        color="secondary"
                                        onClick={() =>
                                          push({
                                            name: '',
                                            label: '',
                                            type: 'text',
                                            required: false,
                                            configs: {},
                                          })
                                        }
                                      >
                                        Adicionar novo campo
                                      </Button>
                                    </>
                                  )}
                                </FieldArray>
                              </FormGroup>
                            </Col>
                          </Row>

                          <Row>
                            <Col>
                              <hr></hr>
                            </Col>
                          </Row>

                          <Button
                            type="submit"
                            color="primary"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Atualizando...' : 'Atualizar Step'}
                          </Button>
                        </Form>
                      )}
                    </Formik>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default EditStep
