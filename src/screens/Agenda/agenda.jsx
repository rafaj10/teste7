import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, Col, Container, Input, Button, Label, Row, Table } from 'reactstrap'
import Tour from 'reactour'
import Breadcrumbs from '/src/components/Common/Breadcrumb'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import ptLocale from '@fullcalendar/core/locales/pt-br'
import interactionPlugin from '@fullcalendar/interaction'
import BootstrapTheme from '@fullcalendar/bootstrap'
import { useMeetings } from '../../store/meetings/hooks'
import MeetingDetailModal from './meeting-details'
import MeetingCreateModal from './meeting-create'
import { dateToHour } from '../../helpers/frontend_helper'
import moment from 'moment'
import './agenda.css'

const Agenda = () => {
  document.title = 'Agenda | 7stratos'

  const { data: meetings } = useMeetings().getMeetings()
  const [event, setEvent] = useState({})
  const [modalcategory, setModalcategory] = useState(false)
  const [modalCreate, setModalCreate] = useState(false)
  const [isTourOpen, setIsTourOpen] = useState(false)

  const [tableDate, setTableDate] = useState(new Date())
  const [tableFilter, setTableFilter] = useState('all')

  const tourSteps = [
    {
      selector: '.breadcrumb',
      content: 'Aqui você pode navegar pelo dashboard e acessar diferentes seções.',
    },
    {
      selector: '.font-title',
      content: 'Aqui você pode ver a quantidade total de atividades.',
    },
    {
      selector: '.tabs',
      content: 'Use estes filtros para ver todas as atividades, apenas as atrasadas ou as a vencer.',
    },
    {
      selector: '.table-actions',
      content: 'Navegue entre as datas para ver as atividades de dias específicos.',
    },
    {
      selector: '.table-responsive',
      content: 'Esta tabela lista todas as atividades para a data selecionada.',
    },
    {
      selector: '.fc-toolbar',
      content: 'Este é o calendário onde você pode ver todas as atividades do mês, semana ou dia.',
    },
  ]

  /**
   * Handling the modal state
   */
  const toggle = () => {
    if (modalcategory) {
      setModalcategory(false)
      setEvent(null)
    } else {
      setModalcategory(true)
    }
  }

  /**
   * Handling date click on calendar
   */
  const handleDateClick = (arg) => {
    const date = arg['date']
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    const currectDate = new Date()
    const currentHour = currectDate.getHours()
    const currentMin = currectDate.getMinutes()
    const currentSec = currectDate.getSeconds()
    const modifiedDate = new Date(
      year,
      month,
      day,
      currentHour,
      currentMin,
      currentSec
    )
    const modifiedData = { ...arg, date: modifiedDate }
  }

  /**
   * Handling click on event on calendar
   */
  const handleEventClick = (arg) => {
    const event = arg.event

    setEvent({
      id: event.id,
      title: event.title,
      title_category: event.title_category,
      start: event.start,
      end: event.end,
      className: event.classNames,
      category: event.classNames[0],
      event_category: event.classNames[0],
      url: event.url,
    })

    setModalcategory(true)
    toggle()
  }

  function getType(type) {
    switch (type) {
      case 'meetings':
        return 'Reunião'
      case 'lead_meetings':
        return 'Reunião de Lead'
      case 'tasks':
        return 'Tarefa'
      case 'lead_tasks':
        return 'Tarefa de Lead'
      default:
        return 'Outro'
    }
  }

  function isTask(type) {
    return type === 'tasks' || type === 'lead_tasks'
  }

  function isLate(date) {
    const meetingDate = new Date(date)
    const now = new Date()
    return meetingDate < now
  }

  function getFilteredMeetingsByTableDate() {
    return meetings?.filter((meeting) => {
      const meetingDate = new Date(meeting.date)
      return meetingDate.getMonth() === tableDate.getMonth() &&
        meetingDate.getFullYear() === tableDate.getFullYear() &&
        meetingDate.getDate() === tableDate.getDate()
    })
  }

  function getLateMeetings(m) {
    return m?.filter((e) => {
      const meetingDate = new Date(e.date)
      return meetingDate < new Date()
    })
  }

  function getToDueMeetings(m) {
    return m?.filter((e) => {
      const meetingDate = new Date(e.date)
      return meetingDate >= new Date()
    })
  }

  function filterTableByType() {
    if (tableFilter === 'late') {
      return getLateMeetings(getFilteredMeetingsByTableDate())
    }

    if (tableFilter === 'todue') {
      return getToDueMeetings(getFilteredMeetingsByTableDate())
    }

    return getFilteredMeetingsByTableDate()
  }

  return (
    <React.Fragment>
      <Tour
        steps={tourSteps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
        startAt={0}
      />
      <MeetingDetailModal
        event={event}
        show={modalcategory}
        onCloseClick={() => toggle()}
      />
      <MeetingCreateModal
        show={modalCreate}
        onCloseClick={() => setModalCreate(false)}
      />
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Atividades" breadcrumbItem="Agenda" />
          <Row>
            <Col className="col-12">
              <Row>
                <Col lg={6}>
                  <Card>
                    <CardBody>
                      <div id="external-events" className="mt-2">
                        <div className="font-title">
                          Atividades: {meetings?.length}
                        </div>

                        <div className="tabs">
                          <ul>
                            <li
                              className={`${tableFilter === 'all' && 'active'}`}
                              onClick={() => setTableFilter('all')}
                            >
                              Todas
                            </li>
                            <li
                              className={`${tableFilter === 'late' && 'active'}`}
                              onClick={() => setTableFilter('late')}
                            >
                              {getLateMeetings(meetings)?.length} atrasadas
                            </li>
                            <li
                              className={`${tableFilter === 'todue' && 'active'}`}
                              onClick={() => setTableFilter('todue')}
                            >
                              {getToDueMeetings(meetings)?.length} a vencer
                            </li>
                          </ul>
                        </div>

                        <div className="table-actions">
                          <button
                            className="btn"
                            onClick={() => {
                              setTableDate(moment.utc(tableDate).subtract(1, 'day').toDate())
                            }}
                          >
                            {'<'}
                          </button>
                          <span>{moment.utc(tableDate).format('dddd, DD MMM YYYY')}</span>
                          <button
                            className="btn"
                            onClick={() => {
                              setTableDate(moment.utc(tableDate).add(1, 'day').toDate())
                            }}
                          >
                            {'>'}
                          </button>
                        </div>
                        <Table className="table-responsive font-small">
                          <thead>
                            <tr>
                              <th></th>
                              <th>Hora</th>
                              <th>Atividade</th>
                              <th>Lead</th>
                              <th>Assunto</th>
                              <th>Canal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filterTableByType()?.length === 0 && (
                              <tr>
                                <td className="text-center" colSpan={6}>Nenhuma atividade encontrada</td>
                              </tr>
                            )}
                            {filterTableByType()?.map((event) => (
                              <tr key={event._id} className={`${isTask(event.origin) ? 'bg-task' : 'bg-meeting'}`}>
                                <td>
                                  {isTask(event.origin) && (
                                    <Input type="checkbox" />
                                  )}
                                </td>
                                <td>
                                  {isLate(event.date) && (
                                    <i className="fa fa-exclamation-triangle text-danger" style={{ marginRight: 6 }} />
                                  )}
                                  {dateToHour(event.date)}
                                </td>
                                <td>{getType(event.origin)}</td>
                                <td>Nome Lead</td>
                                <td>{event.title}</td>
                                <td>{event.type}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </CardBody>
                  </Card>
                </Col>

                <Col className="mb-4">
                  {/*
                  <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 16 }}>
                    <Button onClick={() => setModalCreate(true)}>
                      <i className="fa fa-plus-circle" style={{ marginRight: 6 }} />
                      Criar Meeting
                    </Button>
                  </div>
                  */}
                  <FullCalendar
                    plugins={[BootstrapTheme, dayGridPlugin, interactionPlugin]}
                    handleWindowResize={true}
                    slotDuration={'00:15:00'}
                    themeSystem="bootstrap"
                    allDayText='Dia Todo'
                    headerToolbar={{
                      left: 'prev,next today',
                      center: 'title',
                      right: 'dayGridMonth,dayGridWeek,dayGridDay',
                    }}
                    timeZone='America/Sao_Paulo'
                    events={[
                      ...(meetings ?? [])?.map((event) => {
                        return {
                          id: event._id,
                          title: event.title,
                          url: event?.obj?.link,
                          className: "bg-primary text-white",
                          start: event.date,
                          end: event.obj.to,
                        }
                      })
                    ]}
                    editable={false}
                    droppable={false}
                    selectable={false}
                    dateClick={handleDateClick}
                    eventClick={(arg) => {
                      arg.jsEvent.preventDefault()
                      handleEventClick(arg)
                    }}
                    locale={ptLocale}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

Agenda.propTypes = {
  events: PropTypes.array,
  categories: PropTypes.array,
  className: PropTypes.string,
  onGetEvents: PropTypes.func,
  onAddNewEvent: PropTypes.func,
  onUpdateEvent: PropTypes.func,
  onDeleteEvent: PropTypes.func,
  onGetCategories: PropTypes.func,
}

export default Agenda
