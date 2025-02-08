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
  Card,
  CardBody,
} from 'reactstrap'
import { useFormik } from 'formik'
import TaskItem from './TaskItem'
import Filters from './Filters'
import BoardStepSelector from '../../components/Common/BoardStepSelector'
import { useEmailTemplate } from '../../store/emailtemplate/hooks'

const WorkflowModal = ({
  isOpen,
  toggle,
  createWorkflow,
  updateWorkflow,
  editing,
}) => {
  const isEdit = Boolean(editing)
  const [addFilters, setAddFilters] = useState(
    Boolean(editing && editing.filters.origins.length > 0)
  )

  const initialValues = isEdit
    ? editing
    : {
        title: '',
        type: 'step_in_out',
        meta: { operation: 'in', step: '' },
        filters: { origins: [], sectors: [] },
        tasks: [
          {
            taskType: 'create_lead_task',
            trigger: 'now',
            type: 'follow_up',
            title: '',
            when: { type: 'hours', value: 1 },
          },
        ],
      }

  const [boardId, setBoardId] = useState('')
  const [stepId, setStepId] = useState('')
  const [steps, setSteps] = useState([])

  const emailTemplate = useEmailTemplate()
  const { data: templates } = emailTemplate.list()

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      const [operation, step] = values.meta.step.split(' ')
      values.meta.operation = operation
      values.meta.step = step

      if (!addFilters) {
        values.filters = { origins: [], sectors: [] }
      }
      if (isEdit) {
        updateWorkflow(editing.id, values)
      } else {
        createWorkflow({ ...values, id: Date.now() })
      }
    },
  })

  const handleAddTask = () => {
    formik.setFieldValue('tasks', [
      ...formik.values.tasks,
      {
        taskType: 'create_lead_task',
        trigger: 'now',
        type: 'follow_up',
        title: '',
        when: { type: 'hours', value: 1 },
      },
    ])
  }

  const handleRemoveTask = (index) => {
    if (formik.values.tasks.length > 1) {
      const tasks = formik.values.tasks.filter((_, i) => i !== index)
      formik.setFieldValue('tasks', tasks)
    }
  }

  const addReadTask = (taskIndex) => {
    const tasks = [...formik.values.tasks]
    tasks[taskIndex].configs = tasks[taskIndex].configs || {}
    tasks[taskIndex].configs.readTasks =
      tasks[taskIndex].configs.readTasks || []
    tasks[taskIndex].configs.readTasks.push({
      taskType: 'change_step',
      trigger: 'now',
      configs: { step: '' },
    })
    formik.setFieldValue('tasks', tasks)
  }

  const removeReadTask = (taskIndex, readTaskIndex) => {
    const tasks = [...formik.values.tasks]
    tasks[taskIndex].configs.readTasks.splice(readTaskIndex, 1)
    formik.setFieldValue('tasks', tasks)
  }

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="lg"
      fade={false}
      style={{
        position: 'fixed',
        margin: 'auto',
        right: '0px',
        minWidth: '80%',
        height: '100%',
        minHeight: '100%',
      }}
      contentClassName="modal-full-height"
    >
      <ModalHeader toggle={toggle}>
        {isEdit ? 'Editar Workflow' : 'Adicionar Workflow'}
      </ModalHeader>
      <ModalBody style={{ overflow: 'auto' }}>
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col xs="12">
              <div className="mb-3">
                <BoardStepSelector
                  setBoardId={setBoardId}
                  setStepId={setStepId}
                  setStepList={setSteps}
                  shouldSelectStep={false}
                />
                <Label className="form-label">Título</Label>
                <Input
                  name="title"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.title}
                />
              </div>
              {steps && steps.length > 0 && (
                <div className="mb-3">
                  <Label className="form-label">Gatilho</Label>
                  <Input
                    type="select"
                    name="meta.step"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.meta.step}
                  >
                    <option value="">Selecione um gatilho</option>
                    {steps.map((i) => (
                      <option key={`in-${i._id}`} value={`in ${i._id}`}>
                        Ao entrar em: {i.name}
                      </option>
                    ))}
                    {steps.map((i) => (
                      <option key={`out-${i._id}`} value={`out ${i._id}`}>
                        Ao sair de: {i.name}
                      </option>
                    ))}
                  </Input>
                </div>
              )}

              <div className="mb-3">
                <Label className="form-label">Adicionar Filtros?</Label>
                <Input
                  type="select"
                  value={addFilters ? 'Sim' : 'Não'}
                  onChange={(e) => setAddFilters(e.target.value === 'Sim')}
                >
                  <option value="Não">Não</option>
                  <option value="Sim">Sim</option>
                </Input>
              </div>
              {addFilters && (
                <Filters
                  filters={formik.values.filters}
                  setFieldValue={formik.setFieldValue}
                />
              )}
              <div className="mb-3">
                <Card className="mb-3">
                  <CardBody>
                    <Label className="form-label">Tarefas</Label>
                    {formik.values.tasks.map((task, index) => (
                      <TaskItem
                        key={index}
                        index={index}
                        task={task}
                        setFieldValue={formik.setFieldValue}
                        handleRemoveTask={handleRemoveTask}
                        isFirstTask={index === 0}
                        steps={steps}
                        addReadTask={addReadTask}
                        removeReadTask={removeReadTask}
                        emailTemplates={templates}
                      />
                    ))}
                    <Button
                      type="button"
                      onClick={handleAddTask}
                      color="secondary"
                      className="mt-2"
                    >
                      Adicionar Tarefa
                    </Button>
                  </CardBody>
                </Card>
              </div>
            </Col>
          </Row>
          <Row>
            <Col className="text-end">
              <Button type="button" color="secondary" onClick={toggle}>
                Cancelar
              </Button>
              <Button
                type="submit"
                color="primary"
                style={{ marginLeft: '20px' }}
              >
                {isEdit ? 'Editar' : 'Confirmar'}
              </Button>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default WorkflowModal
