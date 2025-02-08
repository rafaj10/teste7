import React from 'react'
import { Row, Col, Input, Button, Label, Card, CardBody } from 'reactstrap'

const TaskItem = ({
  index,
  task,
  setFieldValue,
  handleRemoveTask,
  isFirstTask,
  steps,
  addReadTask,
  removeReadTask,
  emailTemplates,
}) => {
  const isFirstReadTask = (taskIndex, readIndex) => readIndex === 0

  return (
    <Card className="mb-3" style={{ backgroundColor: '#f0f0f0' }}>
      <i
        className="mdi mdi-arrow-right-thick"
        style={{ marginLeft: '20px', marginTop: '20px' }}
      >{`Tarefa ${index + 1}`}</i>
      <CardBody>
        {task.taskType !== 'send_email' ? (
          <>
            <Row className="align-items-center">
              <Col md="2">
                <Label className="form-label">Executar:</Label>
                <Input
                  type="select"
                  name={`tasks[${index}].trigger`}
                  value={task.trigger}
                  onChange={(e) =>
                    setFieldValue(`tasks[${index}].trigger`, e.target.value)
                  }
                  disabled={isFirstTask}
                >
                  <option value="now">Agora</option>
                  {!isFirstTask && (
                    <option value="after_previous">Depois do último</option>
                  )}
                </Input>
              </Col>
              <Col md="2">
                <Label className="form-label">Tipo:</Label>
                <Input
                  type="select"
                  name={`tasks[${index}].taskType`}
                  value={task.taskType}
                  onChange={(e) =>
                    setFieldValue(`tasks[${index}].taskType`, e.target.value)
                  }
                >
                  <option value="create_lead_task">Tarefa</option>
                  <option value="change_step">Mudar Step (automático)</option>
                  <option value="send_email">Enviar Email (automático)</option>
                  <option value="wait">Esperar (automático)</option>
                </Input>
              </Col>
              {task.taskType === 'create_lead_task' && (
                <>
                  <Col md="4">
                    <Label className="form-label">Título:</Label>
                    <Input
                      type="text"
                      name={`tasks[${index}].title`}
                      value={task.title}
                      onChange={(e) =>
                        setFieldValue(`tasks[${index}].title`, e.target.value)
                      }
                    />
                  </Col>
                  <Col md="3">
                    <Label className="form-label">Vence em:</Label>
                    <div style={{ display: 'flex' }}>
                      <Input
                        type="select"
                        name={`tasks[${index}].when.type`}
                        value={task.when.type}
                        onChange={(e) =>
                          setFieldValue(
                            `tasks[${index}].when.type`,
                            e.target.value
                          )
                        }
                        style={{ width: '120px' }}
                      >
                        <option value="hours">Horas</option>
                        <option value="days">Dias</option>
                      </Input>
                      <Input
                        type="number"
                        name={`tasks[${index}].when.value`}
                        value={task.when.value}
                        onChange={(e) =>
                          setFieldValue(
                            `tasks[${index}].when.value`,
                            e.target.value
                          )
                        }
                        className="mt-0"
                        style={{ width: '50px', marginLeft: '20px' }}
                      />
                    </div>
                  </Col>
                </>
              )}
              {task.taskType === 'change_step' && (
                <Col md="7">
                  <Label className="form-label">Step:</Label>
                  <Input
                    type="select"
                    name={`tasks[${index}].configs.step`}
                    value={task.configs?.step || ''}
                    onChange={(e) =>
                      setFieldValue(
                        `tasks[${index}].configs.step`,
                        e.target.value
                      )
                    }
                  >
                    <option value="">Selecione um step:</option>
                    {steps.map((i) => (
                      <option key={i._id} value={i._id}>
                        {i.name}
                      </option>
                    ))}
                  </Input>
                </Col>
              )}
              {task.taskType === 'wait' && (
                <Col md="7">
                  <Label className="form-label">Tempo:</Label>
                  <div style={{ display: 'flex' }}>
                      <Input
                        type="select"
                        name={`tasks[${index}].when.type`}
                        value={task.when.type}
                        onChange={(e) =>
                          setFieldValue(
                            `tasks[${index}].when.type`,
                            e.target.value
                          )
                        }
                        style={{ width: '120px' }}
                      >
                        <option value="hours">Horas</option>
                        <option value="days">Dias</option>
                      </Input>
                      <Input
                        type="number"
                        name={`tasks[${index}].when.value`}
                        value={task.when.value}
                        onChange={(e) =>
                          setFieldValue(
                            `tasks[${index}].when.value`,
                            e.target.value
                          )
                        }
                        className="mt-0"
                        style={{ width: '50px', marginLeft: '20px' }}
                      />
                    </div>
                </Col>
              )}
              <Col md="1" className="text-center">
                <Button
                  color="danger"
                  type="button"
                  onClick={() => handleRemoveTask(index)}
                  className="mt-4"
                >
                  Excluir
                </Button>
              </Col>
            </Row>
          </>
        ) : (
          <>
            <Row className="align-items-center">
              <Col md="2">
                <Label className="form-label">Executar:</Label>
                <Input
                  type="select"
                  name={`tasks[${index}].trigger`}
                  value={task.trigger}
                  onChange={(e) =>
                    setFieldValue(`tasks[${index}].trigger`, e.target.value)
                  }
                  disabled={isFirstTask}
                >
                  <option value="now">Agora</option>
                  {!isFirstTask && (
                    <option value="after_previous">Depois do último</option>
                  )}
                </Input>
              </Col>
              <Col md="3">
                <Label className="form-label">Tipo:</Label>
                <Input
                  type="select"
                  name={`tasks[${index}].taskType`}
                  value={task.taskType}
                  onChange={(e) =>
                    setFieldValue(`tasks[${index}].taskType`, e.target.value)
                  }
                >
                  <option value="create_lead_task">Criar Tarefa</option>
                  <option value="change_step">Mudar Etapa (automático)</option>
                  <option value="send_email">Enviar Email (automático)</option>
                  <option value="wait">Esperar (automático)</option>
                </Input>
              </Col>
              {task.taskType === 'create_lead_task' && (
                <>
                  <Col md="3">
                    <Label className="form-label">Título:</Label>
                    <Input
                      type="text"
                      name={`tasks[${index}].title`}
                      value={task.title}
                      onChange={(e) =>
                        setFieldValue(`tasks[${index}].title`, e.target.value)
                      }
                    />
                  </Col>
                  <Col md="3">
                    <Label className="form-label">Vence em:</Label>
                    <div style={{ display: 'flex' }}>
                      <Input
                        type="select"
                        name={`tasks[${index}].when.type`}
                        value={task.when.type}
                        onChange={(e) =>
                          setFieldValue(
                            `tasks[${index}].when.type`,
                            e.target.value
                          )
                        }
                        style={{ width: '120px' }}
                      >
                        <option value="hours">Horas</option>
                        <option value="days">Dias</option>
                      </Input>
                      <Input
                        type="number"
                        name={`tasks[${index}].when.value`}
                        value={task.when.value}
                        onChange={(e) =>
                          setFieldValue(
                            `tasks[${index}].when.value`,
                            e.target.value
                          )
                        }
                        className="mt-0"
                        style={{ width: '50px', marginLeft: '20px' }}
                      />
                    </div>
                  </Col>
                </>
              )}
              {task.taskType === 'change_step' && (
                <Col md="6">
                  <Label className="form-label">Step:</Label>
                  <Input
                    type="select"
                    name={`tasks[${index}].configs.step`}
                    value={task.configs?.step || ''}
                    onChange={(e) =>
                      setFieldValue(
                        `tasks[${index}].configs.step`,
                        e.target.value
                      )
                    }
                  >
                    <option value="">Selecione um step:</option>
                    {steps.map((i) => (
                      <option key={i._id} value={i._id}>
                        {i.name}
                      </option>
                    ))}
                  </Input>
                </Col>
              )}
              {task.taskType === 'send_email' && (
                <>
                  <Col md="3">
                    <Label className="form-label">Assunto:</Label>
                    <Input
                      type="text"
                      name={`tasks[${index}].configs.subject`}
                      value={task.configs?.subject || ''}
                      onChange={(e) =>
                        setFieldValue(
                          `tasks[${index}].configs.subject`,
                          e.target.value
                        )
                      }
                    />
                  </Col>
                  <Col md="3">
                    <Label className="form-label">Template:</Label>
                    <Input
                      type="select"
                      name={`tasks[${index}].configs.template`}
                      value={task.configs?.template || ''}
                      onChange={(e) =>
                        setFieldValue(
                          `tasks[${index}].configs.template`,
                          e.target.value
                        )
                      }
                    >
                      <option value="">Selecione um template</option>
                      {emailTemplates.map((template) => (
                        <option key={template._id} value={template._id}>
                          {template.title}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </>
              )}
              <Col md="1" className="text-center">
                <Button
                  color="danger"
                  type="button"
                  onClick={() => handleRemoveTask(index)}
                  className="mt-4"
                >
                  Excluir
                </Button>
              </Col>
            </Row>
            <Row>
              <Row>
                <Col md="12">
                  <Label className="form-label" style={{ marginTop: '30px' }}>
                    Tarefa(s) ao ler e-mail:
                  </Label>
                  {task.configs?.readTasks?.map((readTask, readIndex) => (
                    <Card key={readIndex} className="mb-2">
                      <i
                        className="mdi mdi-arrow-right-thick"
                        style={{ marginLeft: '20px', marginTop: '20px' }}
                      >{`Tarefa ao ler e-mail ${readIndex + 1}`}</i>
                      <CardBody>
                        <Row className="align-items-center">
                          <Col md="2">
                            <Label className="form-label">Gatilho</Label>
                            <Input
                              type="select"
                              name={`tasks[${index}].configs.readTasks[${readIndex}].trigger`}
                              value={readTask.trigger}
                              onChange={(e) =>
                                setFieldValue(
                                  `tasks[${index}].configs.readTasks[${readIndex}].trigger`,
                                  e.target.value
                                )
                              }
                              disabled={isFirstReadTask(index, readIndex)}
                            >
                              <option value="now">Agora</option>
                              {!isFirstReadTask(index, readIndex) && (
                                <option value="after_previous">
                                  Depois do último
                                </option>
                              )}
                            </Input>
                          </Col>
                          <Col md="2">
                            <Label className="form-label">Tipo</Label>
                            <Input
                              type="select"
                              name={`tasks[${index}].configs.readTasks[${readIndex}].taskType`}
                              value={readTask.taskType}
                              onChange={(e) =>
                                setFieldValue(
                                  `tasks[${index}].configs.readTasks[${readIndex}].taskType`,
                                  e.target.value
                                )
                              }
                            >
                              <option value="create_lead_task">Tarefa</option>
                              <option value="change_step">Mudar Step (automático)</option>
                              <option value="send_email">Enviar Email (automático)</option>
                              <option value="wait">Esperar (automático)</option>
                            </Input>
                          </Col>
                          {readTask.taskType === 'create_lead_task' && (
                            <>
                              <Col md="4">
                                <Label className="form-label">Título</Label>
                                <Input
                                  type="text"
                                  name={`tasks[${index}].configs.readTasks[${readIndex}].title`}
                                  value={readTask.title}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `tasks[${index}].configs.readTasks[${readIndex}].title`,
                                      e.target.value
                                    )
                                  }
                                />
                              </Col>
                              <Col md="3">
                                <Label className="form-label">Quando</Label>
                                <div style={{ display: 'flex' }}>
                                  <Input
                                    type="select"
                                    name={`tasks[${index}].configs.readTasks[${readIndex}].when.type`}
                                    value={readTask.when?.type}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `tasks[${index}].configs.readTasks[${readIndex}].when.type`,
                                        e.target.value
                                      )
                                    }
                                    style={{ width: '120px' }}
                                  >
                                    <option value="hours">Horas</option>
                                    <option value="days">Dias</option>
                                  </Input>
                                  <Input
                                    type="number"
                                    name={`tasks[${index}].configs.readTasks[${readIndex}].when.value`}
                                    value={readTask.when?.value}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `tasks[${index}].configs.readTasks[${readIndex}].when.value`,
                                        e.target.value
                                      )
                                    }
                                    className="mt-0"
                                    style={{
                                      width: '50px',
                                      marginLeft: '20px',
                                    }}
                                  />
                                </div>
                              </Col>
                            </>
                          )}
                          {readTask.taskType === 'change_step' && (
                            <Col md="6">
                              <Label className="form-label">Step</Label>
                              <Input
                                type="select"
                                name={`tasks[${index}].configs.readTasks[${readIndex}].configs.step`}
                                value={readTask.configs?.step || ''}
                                onChange={(e) =>
                                  setFieldValue(
                                    `tasks[${index}].configs.readTasks[${readIndex}].configs.step`,
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Selecione um step</option>
                                {steps.map((i) => (
                                  <option key={i._id} value={i._id}>
                                    {i.name}
                                  </option>
                                ))}
                              </Input>
                            </Col>
                          )}
                          {readTask.taskType === 'send_email' && (
                            <>
                              <Col md="2">
                                <Label className="form-label">Assunto</Label>
                                <Input
                                  type="text"
                                  name={`tasks[${index}].configs.readTasks[${readIndex}].configs.subject`}
                                  value={readTask.configs?.subject || ''}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `tasks[${index}].configs.readTasks[${readIndex}].configs.subject`,
                                      e.target.value
                                    )
                                  }
                                />
                              </Col>
                              <Col md="2">
                                <Label className="form-label">Template</Label>
                                <Input
                                  type="select"
                                  name={`tasks[${index}].configs.readTasks[${readIndex}].configs.template`}
                                  value={readTask.configs?.template || ''}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `tasks[${index}].configs.readTasks[${readIndex}].configs.template`,
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">
                                    Selecione um template
                                  </option>
                                  {emailTemplates.map((template) => (
                                    <option
                                      key={template._id}
                                      value={template._id}
                                    >
                                      {template.title}
                                    </option>
                                  ))}
                                </Input>
                              </Col>
                            </>
                          )}
                          {readTask.taskType === 'wait' && (
                            <Col md="6">
                              <Label className="form-label">Tempo</Label>
                              <div style={{ display: 'flex' }}>
                                  <Input
                                    type="select"
                                    name={`tasks[${index}].configs.readTasks[${readIndex}].when.type`}
                                    value={readTask.when?.type}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `tasks[${index}].configs.readTasks[${readIndex}].when.type`,
                                        e.target.value
                                      )
                                    }
                                    style={{ width: '120px' }}
                                  >
                                    <option value="hours">Horas</option>
                                    <option value="days">Dias</option>
                                  </Input>
                                  <Input
                                    type="number"
                                    name={`tasks[${index}].configs.readTasks[${readIndex}].when.value`}
                                    value={readTask.when?.value}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `tasks[${index}].configs.readTasks[${readIndex}].when.value`,
                                        e.target.value
                                      )
                                    }
                                    className="mt-0"
                                    style={{
                                      width: '50px',
                                      marginLeft: '20px',
                                    }}
                                  />
                                </div>
                            </Col>
                          )}
                          <Col md="1" className="text-center">
                            <Button
                              color="danger"
                              type="button"
                              onClick={() => removeReadTask(index, readIndex)}
                              className="mt-4"
                            >
                              Excluir
                            </Button>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    onClick={() => addReadTask(index)}
                    color="secondary"
                    className="mt-2"
                    style={{ marginLeft: '20px' }}
                  >
                    Adicionar tarefa ao ler e-mail
                  </Button>
                </Col>
              </Row>
            </Row>
          </>
        )}
      </CardBody>
    </Card>
  )
}

export default TaskItem
