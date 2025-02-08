import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Modal, ModalHeader } from 'reactstrap'
import * as helper from '../../../helpers/frontend_helper'
import { getLeadMeetingsReq } from '../../../store/lead/actions'
import { useLeadSelector } from '../../../store/lead/selectors'
import { LeadMeetingCreateView } from './lead-meeting-create-view'

const MEETINGTYPE = [
  { value: 'presential', label: 'Presencial' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'google_meet', label: 'Google Meet' },
  { value: 'teams', label: 'Microsoft Teams' },
  { value: 'other', label: 'Outros' },
]

export const LeadMeetingsTabView = ({ id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useDispatch()

  const {
    meetings: { data: meetings },
  } = useLeadSelector()

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  useEffect(() => {
    dispatch(getLeadMeetingsReq({ id }))
  }, [])

  return (
    <>
      <div className="padding-content">
        <div className="mb-4 mt-2">
          <Button color="primary" onClick={toggleModal}>
            <i className="fa fa-plus-circle" /> Nova Reunião
          </Button>
        </div>

        {meetings.length === 0 && (
          <div className="text-center">
            <h4>Nenhuma reunião cadastrada</h4>
          </div>
        )}

        {meetings.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Contato</th>
                  <th>Assunto</th>
                  <th>Data</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {meetings.map((e, i) => (
                  <tr key={i}>
                    <td>{MEETINGTYPE.find((mt) => mt.value === e.type)?.label || 'Desconhecido'}</td>
                    <td>{e.contact?.name}</td>
                    <td>{e.title}</td>
                    <td>
                      {helper.dateToViewAndHour(e.from)} -{' '}
                      {helper.dateToViewAndHour(e.to)}
                    </td>
                    <td>
                      <a href={e.link} target="_blank" rel="noreferrer">
                        {e.link}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal toggle={toggleModal} isOpen={isModalOpen} size="lg">
        <ModalHeader>
          <h3>Nova Reunião</h3>
        </ModalHeader>
        <LeadMeetingCreateView leadId={id} toggleModal={toggleModal} />
      </Modal>
    </>
  )
}
