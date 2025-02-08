import { useState } from 'react'
import { Button, Input, Modal, ModalHeader, Table } from 'reactstrap'
import { dateToHour, dateToView } from '../../../helpers/frontend_helper'
import '../lead.css'
import { LeadTasksCreateView } from './lead-tasks-create-view'
import useLead from '../../../store/lead/hooks'

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

export const LeadTasksTabView = ({ id }) => {
  const [isModalOpen, setIsModalOpen] = useState({
    open: false,
    task: undefined,
  })

  const { data: tasks, refetch } = useLead().getLeadTasks(id ?? '')
  const toggleTask = useLead().toggleTask()
  const deleteTask = useLead().deleteTask()

  const onCompleteTask = (checked, task) => {
    toggleTask.mutate(
      {
        id,
        taskId: task._id,
        completed: checked,
        title: task.title,
        responsible: task.responsible?._id,
        contact: task.contact?._id,
      },
      {
        onSuccess: () => refetch(),
      }
    )
  }

  const onDeleteTask = (task) => {
    deleteTask.mutate(
      { leadId: id, taskId: task._id },
      { onSuccess: () => refetch() }
    )
  }

  const toggleModal = ({ task }) => {
    setIsModalOpen({
      open: !isModalOpen.open,
      task,
    })
  }

  return (
    <>
      <div className="padding-content">
        <div className="mb-4 mt-2">
          <Button color="primary" onClick={toggleModal}>
            <i className="fa fa-plus-circle mr-2" /> Nova tarefa
          </Button>
        </div>

        {tasks?.length === 0 && (
          <div className="text-center">
            <h4>Nenhuma tarefa cadastrada</h4>
          </div>
        )}

        {tasks?.length > 0 && (
          <Table className="table-responsive">
            <thead>
              <tr>
                <th>Concluir</th>
                <th>Tipo da tarefa</th>
                <th>Assunto</th>
                <th>Canal</th>
                <th>Contato</th>
                <th>Para data</th>
                <th>Hora</th>
                <th>Responsável</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks?.map((task, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <Input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {}}
                        onClick={() => onCompleteTask(!task.completed, task)}
                      />
                    </td>
                    <td>{TASKTYPES.find((mt) => mt.value === task.type)?.label || 'Desconhecido'}</td>
                    <td>{task.title}</td>
                    <td>{CHANNELS.find((mt) => mt.value === task.channel)?.label || 'Desconhecido'}</td>
                    <td>{task.contact?.name}</td>
                    <td>{dateToView(task.dueDate)}</td>
                    <td>{dateToHour(task.dueDate)}</td>
                    <td>{task.responsible?.name}</td>
                    <td>
                      <Button
                        style={{ marginRight: '10px' }}
                        color="info"
                        size="sm"
                        outline
                        onClick={() => {
                          toggleModal({ task })
                        }}
                      >
                        <i className="fa fa-edit" />
                      </Button>
                      <Button
                        color="danger"
                        outline
                        size="sm"
                        onClick={() => onDeleteTask(task)}
                      >
                        <i className="fa fa-trash" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        )}
      </div>

      <Modal
        isOpen={isModalOpen.open}
        toggle={() => {
          setIsModalOpen({ open: false, task: undefined })
        }}
        size="lg"
      >
        <ModalHeader toggle={toggleModal}>Criar nova tarefa</ModalHeader>
        <LeadTasksCreateView
          leadId={id}
          toggleModal={toggleModal}
          task={isModalOpen.task}
        />
      </Modal>
    </>
  )
}
