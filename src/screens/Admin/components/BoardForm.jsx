import React, { useEffect, useState } from 'react'
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
} from 'reactstrap'
import { Link } from 'react-router-dom'
import { useBoardSelector } from '../../../store/board/selectors'
import { useDispatch } from 'react-redux'
import { getBoardListReq } from '../../../store/board/actions'

const BoardForm = ({
  initialValues,
  onSubmit,
  onStepUpdate,
  onStepDelete,
  onStepCreate,
  isEditMode,
}) => {
  const dispatch = useDispatch()
  const { boardList } = useBoardSelector()

  useEffect(() => {
    dispatch(getBoardListReq())
  }, [dispatch])

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={null}
      onSubmit={(values, actions) => {
        if (isEditMode) {
          console.log(JSON.stringify(values))
          onSubmit(values)
        } else {
          console.log(JSON.stringify(values))
          onSubmit(values)
          actions.setSubmitting(false)
          actions.resetForm()
        }
      }}
    >
      {({ handleSubmit, isSubmitting, setFieldValue, values }) => (
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="name">Nome do Funil</Label>
            <Field name="name" as={Input} />
          </FormGroup>
          <FormGroup>
            <Label for={`icon`}>Icone</Label>
            <Field
              name={`icon`}
              as={Input}
              type="select"
              onChange={(e) => {
                setFieldValue(
                  `icon`,
                  e.target.value
                )
              }}
            >
              <option value="">Selecione um icone</option>
              <option value="bx-run">bx-run</option>
              <option value="bx-pyramid">bx-pyramid</option>
              <option value="bx-sort-up">bx-sort-up</option>
              <option value="bx-transfer">bx-transfer</option>
              <option value="bx-radar">bx-radar</option>
              <option value="bx-redo">bx-redo</option>
              <option value="bx-down-arrow">bx-down-arrow</option>
              <option value="bx-crown">bx-crown</option>
              <option value="bx-star">bx-star</option>
              <option value="bx-filter">bx-filter</option>
              <option value="bx-sitemap">bx-sitemap</option>
              <option value="bx-sidebar">bx-sidebar</option>
              <option value="bx-link-alt">bx-link-alt</option>
              <option value="bx-dollar">bx-dollar</option>
              <option value="bx-trending-up">bx-trending-up</option>
              <option value="bx-align-right">bx-align-right</option>
              <option value="bxs-business">bxs-business</option>
            </Field>
            <i class="bx bxs-image">bxs-image</i> &nbsp;&nbsp;
              <i class="bx bx-run">bx-run</i> &nbsp;&nbsp;
              <i class="bx bx-pyramid">bx-pyramid</i> &nbsp;&nbsp;
              <i class="bx bx-sort-up">bx-sort-up</i> &nbsp;&nbsp;
              <i class="bx bx-transfer">bx-transfer</i> &nbsp;&nbsp;
              <i class="bx bx-radar">bx-radar</i> &nbsp;&nbsp;
              <i class="bx bx-redo">bx-redo</i> &nbsp;&nbsp;
              <i class="bx bx-down-arrow">bx-down-arrow</i> &nbsp;&nbsp;
              <i class="bx bx-crown">bx-crown</i> &nbsp;&nbsp;
              <i class="bx bx-star">bx-star</i> &nbsp;&nbsp;
              <i class="bx bx-filter">bx-filter</i> &nbsp;&nbsp;
              <i class="bx bx-sitemap">bx-sitemap</i> &nbsp;&nbsp;
              <i class="bx bx-sidebar">bx-sidebar</i> &nbsp;&nbsp;
              <i class="bx bx-link-alt">bx-link-alt</i> &nbsp;&nbsp;
              <i class="bx bx-dollar">bx-dollar</i> &nbsp;&nbsp;
              <i class="bx bx-trending-up">bx-trending-up</i> &nbsp;&nbsp;
              <i class="bx bx-align-right">bx-align-right</i> &nbsp;&nbsp;
              <i class="bx bxs-business">bxs-business</i> &nbsp;&nbsp;
          </FormGroup>
          <FormGroup>
            <Label for={`visible`}>Visivel</Label>
            <Field
              name={`visible`}
              as={Input}
              type="select"
              onChange={(e) => {
                setFieldValue(
                  `visible`,
                  e.target.value
                )
              }}
            >
              <option value="">Selecione um status</option>
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </Field>
          </FormGroup>
          <FormGroup>
            <Label for={`type`}>Tipo do Funil</Label>
            <Field
              name={`type`}
              as={Input}
              type="select"
              onChange={(e) => {
                setFieldValue(
                  `type`,
                  e.target.value
                )
              }}
            >
              <option value="">Selecione um tipo de funil</option>
              <option value="engagement">Engagement</option>
              <option value="crm">CRM</option>
            </Field>
          </FormGroup>
          <FormGroup>
          {/* <Label for={`relatedTo`}>Relacionado a outro funil?</Label>
              <Input
            type="select"
            id="relatedTo"
            onChange={(e) => {
              setFieldValue(
                `relatedTo`,
                e.target.value
              )
            }}
          >
            <option value="">Sem relacionamento</option>
            {boardList.map((board) => (
              <option key={board._id} value={board._id}>
                {board.name}
              </option>
            ))}
          </Input> */}
          </FormGroup>
          <FieldArray name="steps">
            {({ push, remove }) => (
              <div>
                {values.steps.map((step, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: 'whitesmoke',
                      padding: '10px',
                      marginLeft: '10px',
                      marginTop: '20px',
                      marginBottom: '20px',
                    }}
                  >
                    <h5>
                      {step.name || `(Step ${index + 1})`}
                      {step._id && (
                        <Link
                        to={`/admin/tenants/${step.tenant}/boards/${step.board}/steps/${step._id}`}
                        >
                        &nbsp;&nbsp; (atualizar etapa)
                        </Link>
                      )}
                    </h5>
                    <Row form>
                      <Col md={4}>
                        <FormGroup>
                          <Label for={`steps.${index}.name`}>Nome da etapa</Label>
                          <Field
                            name={`steps.${index}.name`}
                            as={Input}
                            invalid={!!ErrorMessage[`steps.${index}.name`]}
                          />
                          <ErrorMessage
                            name={`steps.${index}.name`}
                            component={FormFeedback}
                          />
                        </FormGroup>
                      </Col>
                      {/* <Col md={4}>
                        <FormGroup>
                          <Label for={`steps.${index}.type`}>Tipo da etapa</Label>
                          <Field
                            name={`steps.${index}.type`}
                            as={Input}
                            type="select"
                            invalid={!!ErrorMessage[`steps.${index}.type`]}
                            onChange={(e) => {
                              setFieldValue(
                                `steps.${index}.type`,
                                e.target.value
                              )
                              setFieldValue(`steps.${index}.flags`, {
                                starter: false,
                                isWon: false,
                                isLost: false,
                                allowProposal: false,
                                allowClose: false,
                              })
                            }}
                          >
                            <option value="engagement">Engagement</option>
                            <option value="crm">CRM</option>
                          </Field>
                          <ErrorMessage
                            name={`steps.${index}.type`}
                            component={FormFeedback}
                          />
                        </FormGroup>
                      </Col> */}
                      <Col md={4}>
                        <FormGroup>
                          <Label for={`steps.${index}.color`}>Color da etapa</Label>
                          <Field
                            name={`steps.${index}.color`}
                            as={Input}
                            type="color"
                            invalid={!!ErrorMessage[`steps.${index}.color`]}
                          />
                          <ErrorMessage
                            name={`steps.${index}.color`}
                            component={FormFeedback}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row form>
                      <Col md={4}>
                        <FormGroup>
                          <Label for={`steps.${index}.sla.type`}>
                            SLA da etapa
                          </Label>
                          <Field
                            name={`steps.${index}.sla.type`}
                            as={Input}
                            type="select"
                            invalid={!!ErrorMessage[`steps.${index}.sla.type`]}
                          >
                            <option value="minutes">Minutos</option>
                            <option value="hours">Horas</option>
                            <option value="days">Dias</option>
                            <option value="weeks">Semanas</option>
                          </Field>
                          <ErrorMessage
                            name={`steps.${index}.sla.type`}
                            component={FormFeedback}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label for={`steps.${index}.sla.value`}>
                            SLA valor
                          </Label>
                          <Field
                            name={`steps.${index}.sla.value`}
                            as={Input}
                            type="number"
                            invalid={!!ErrorMessage[`steps.${index}.sla.value`]}
                          />
                          <ErrorMessage
                            name={`steps.${index}.sla.value`}
                            component={FormFeedback}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row form>
                      <Col md={4}>
                        <FormGroup>
                          <Label for={`steps.${index}.flags.starter`}>
                            Starter
                          </Label>
                          <Field
                            name={`steps.${index}.flags.starter`}
                            type="checkbox"
                            as={Input}
                            invalid={
                              !!ErrorMessage[`steps.${index}.flags.starter`]
                            }
                          />
                          <ErrorMessage
                            name={`steps.${index}.flags.starter`}
                            component={FormFeedback}
                          />
                        </FormGroup>
                      </Col>
                      {/* {values.steps[index].type === 'engagement' ? (
                        <Col md={4}>
                          <FormGroup>
                            <Label for={`steps.${index}.flags.allowProposal`}>
                              Allow Proposal
                            </Label>
                            <Field
                              name={`steps.${index}.flags.allowProposal`}
                              type="checkbox"
                              as={Input}
                              invalid={
                                !!ErrorMessage[
                                  `steps.${index}.flags.allowProposal`
                                ]
                              }
                            />
                            <ErrorMessage
                              name={`steps.${index}.flags.allowProposal`}
                              component={FormFeedback}
                            />
                          </FormGroup>
                        </Col>
                      ) : ( */}
                        <>
                          <Col md={2}>
                          <FormGroup>
                            <Label for={`steps.${index}.flags.allowProposal`}>
                              Allow Proposal
                            </Label>
                            <Field
                              name={`steps.${index}.flags.allowProposal`}
                              type="checkbox"
                              as={Input}
                              invalid={
                                !!ErrorMessage[
                                  `steps.${index}.flags.allowProposal`
                                ]
                              }
                            />
                            <ErrorMessage
                              name={`steps.${index}.flags.allowProposal`}
                              component={FormFeedback}
                            />
                          </FormGroup>
                            <FormGroup>
                              <Label for={`steps.${index}.flags.isWon`}>
                                Is Won
                              </Label>
                              <Field
                                name={`steps.${index}.flags.isWon`}
                                type="checkbox"
                                as={Input}
                                invalid={
                                  !!ErrorMessage[`steps.${index}.flags.isWon`]
                                }
                              />
                              <ErrorMessage
                                name={`steps.${index}.flags.isWon`}
                                component={FormFeedback}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={2}>
                            <FormGroup>
                              <Label for={`steps.${index}.flags.isLost`}>
                                Is Lost
                              </Label>
                              <Field
                                name={`steps.${index}.flags.isLost`}
                                type="checkbox"
                                as={Input}
                                invalid={
                                  !!ErrorMessage[`steps.${index}.flags.isLost`]
                                }
                              />
                              <ErrorMessage
                                name={`steps.${index}.flags.isLost`}
                                component={FormFeedback}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup>
                              <Label for={`steps.${index}.flags.allowClose`}>
                                Allow Close
                              </Label>
                              <Field
                                name={`steps.${index}.flags.allowClose`}
                                type="checkbox"
                                as={Input}
                                invalid={
                                  !!ErrorMessage[
                                    `steps.${index}.flags.allowClose`
                                  ]
                                }
                              />
                              <ErrorMessage
                                name={`steps.${index}.flags.allowClose`}
                                component={FormFeedback}
                              />
                            </FormGroup>
                          </Col>
                        </>
                      {/* )} */}
                    </Row>
                    {step._id ? (
                      <>
                        {/* <Button
                          color="primary"
                          onClick={() => onStepUpdate(step, index)}
                          className="mb-4"
                        >
                          Atualizar Etapa
                        </Button> &nbsp;&nbsp;&nbsp;&nbsp; */}
                        <Button
                          color="danger"
                          onClick={() => onStepDelete(step._id)}
                          className="mb-4"
                        >
                          Remover Etapa
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          color="primary"
                          onClick={() =>
                            onStepCreate(step, index, setFieldValue)
                          }
                          className="mb-4"
                        >
                          Confirmar Etapa
                        </Button>
                        <Button
                          color="secondary"
                          onClick={() => remove(index)}
                          className="mb-4"
                        >
                          Cancelar
                        </Button>
                      </>
                    )}
                  </div>
                ))}
                <div style={{ display: 'flex', flexDirection: 'column'}}>
                  <Button
                    color="secondary"
                    onClick={() =>
                      push({
                        name: '',
                        type: 'engagement',
                        color: '#000000',
                        sla: { type: 'hours', value: 0 },
                        flags: { starter: false },
                        fields: [],
                      })
                    }
                  >
                    Adicionar nova etapa
                  </Button>
                </div>
              </div>
            )}
          </FieldArray>
          {isEditMode ? (
            <Button
              type="button"
              color="primary"
              onClick={() => onSubmit(values)}
              className="mt-4"
              style={{ marginTop:'30px'}}
            >
              Atualizar Funil
            </Button>
          ) : (
            <Button type="submit" color="primary" disabled={isSubmitting} style={{ marginTop:'30px'}}>
              {isSubmitting ? 'Criando...' : 'Criar Funil'}
            </Button>
          )}
        </Form>
      )}
    </Formik>
  )
}

export default BoardForm
