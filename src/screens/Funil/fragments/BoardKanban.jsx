import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Card, CardBody, Row, Col, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import { dateToViewAndHour } from '../../../helpers/frontend_helper'

const Board = ({ onDragEnd, steps, onClickDetails, leadList }) => {
  const [expandedCardIds, setExpandedCardIds] = useState([])

  const toggleExpandCard = (cardId) => {
    setExpandedCardIds((prev) =>
      prev.includes(cardId)
        ? prev.filter((id) => id !== cardId)
        : [...prev, cardId]
    )
  }

  const isLate = (dueDate) => {
    const now = new Date()
    const due = new Date(dueDate)
    return now > due
  }

  const translateType = (type) => {
    const types = {
      minutes: 'min(s)',
      hours: 'hora(s)',
      days: 'dia(s)'
    };
    return types[type] || type;
  };

  const areRequiredFieldsPresent = (card, requiredFields) => {
    for (const field of requiredFields) {
      if (field.type === 'has_one_internal_contact') {
        if (!card.contacts || card.contacts.length === 0) {
          return false
        }
      } else if (field.type === 'has_one_internal_contact_estrategic') {
        if (!card.contacts || (card?.contacts ?? []).some(contact => contact.strategic === false)) {
          return false
        }
      } else if (field.type === 'has_one_internal_agenda') {
        if (!card.counters || card.counters.meetings === 0) {
          return false
        }
      } else if (field.type === 'has_one_internal_task') {
        if (!card.counters || card.counters.tasks <= 0) {
          return false
        }
      } else if (!card.customFields || !card.customFields[field.name]) {
        return false
      }
    }
    return true
  }

  const canDragCard = (card, stepFields) => {
    const requiredFields = stepFields.filter((field) => field.required)
    return (
      requiredFields.length === 0 ||
      areRequiredFieldsPresent(card, requiredFields)
    )
  }

  const calculateProposalSum = (cards) => {
    return cards.reduce((total, card) => {
      const proposalTotal =
        card.proposals?.reduce(
          (sum, proposal) => sum + (proposal.finalPrice || 0),
          0
        ) || 0
      return total + proposalTotal
    }, 0)
  }

  return (
    <div
      style={{
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        height: 'calc(100vh - 270px)', // Ajuste conforme necessário
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        {steps?.map((line) => {
          const filteredCards =
            leadList?.filter((card) => card.step._id === line._id) || []
          const totalProposals = calculateProposalSum(filteredCards)

          return (
            <Droppable droppableId={line._id} key={line._id}>
              {(provided) => (
                <div
                  key={line._id}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    minWidth: '280px',
                    maxWidth: '280px',
                    marginRight: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#eaeaee',
                    borderRadius: '4px',
                    flex: '0 0 auto',
                  }}
                >
                  <Card
                    style={{
                      flex: '1 1 auto',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}
                  >
                    <div
                      style={{ height: '2px', backgroundColor: line.color }}
                    ></div>
                    <div style={{ height: '40px', backgroundColor: '#fff' }}>
                      <Row>
                        <Col xs="12">
                          <div
                            style={{
                              marginLeft: '10px',
                              marginTop: '12px',
                              display: 'flex',
                            }}
                          >
                            <div style={{ width: '200px' }}>
                              <span style={{ fontWeight: '600' }}>
                                {line.name} (
                                {
                                  leadList.filter(
                                    (i) => i.step._id === line._id
                                  ).length
                                }
                                )
                              </span>
                            </div>
                            {line.sla && (
                              <div>
                                {line.sla?.value} {translateType(line.sla?.type)}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <CardBody
                      style={{
                        backgroundColor: '#eaeaee',
                        padding: 10,
                        overflowY: 'auto',
                        flex: '1 1 auto',
                      }}
                    >
                      <div>
                        {filteredCards.map((card, index) => {
                          const getStrategicContact = card.contacts.filter(
                            (contact) => contact.strategic
                          )
                          const isDragDisabled = !canDragCard(card, line.fields)
                          const isExpanded = expandedCardIds.includes(card._id)
                          return (
                            <Draggable
                              key={card._id}
                              draggableId={card._id}
                              index={index}
                              isDragDisabled={isDragDisabled}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="card task-list"
                                >
                                  <div
                                    className="task-box"
                                    style={{
                                      backgroundColor: isLate(card.dueDate)
                                        ? '#f1d4d4'
                                        : '',
                                    }}
                                  >
                                    <CardBody>
                                      <Button
                                        className="float-end"
                                        color="link"
                                        onClick={() =>
                                          toggleExpandCard(card._id)
                                        }
                                      >
                                        <i
                                          className={
                                            isExpanded
                                              ? 'mdi mdi-eye-off m-0 text-muted h5'
                                              : 'mdi mdi-eye m-0 text-muted h5'
                                          }
                                        ></i>
                                      </Button>

                                      <div onClick={() => onClickDetails(card)}>
                                        <h5 className="font-size-15">
                                          <Link
                                            to="#"
                                            className="text-dark"
                                            id="task-name"
                                          >
                                            {card?.company?.alias} {card?.title}
                                          </Link>
                                        </h5>
                                        <p></p>

                                        {/* Person */}
                                        {getStrategicContact?.length > 0 ? (
                                          <p className="text-muted font-size-11">
                                            <i
                                              className="fas fa-address-card"
                                              style={{ marginRight: 8 }}
                                            ></i>
                                            {
                                              getStrategicContact?.[0]?.person
                                                ?.name
                                            }
                                          </p>
                                        ) : (
                                          <p className="text-muted font-size-11">
                                            <i
                                              className="fas fa-address-card"
                                              style={{ marginRight: 8 }}
                                            ></i>
                                            Nenhum contato cadastrado
                                          </p>
                                        )}

                                        {/* Proposal */}
                                        {card?.proposals?.length > 0 ? (
                                          <p className="text-muted font-size-11">
                                            <i
                                              className="fas fa-file-invoice-dollar"
                                              style={{ marginRight: 8 }}
                                            ></i>
                                            {card?.proposals?.[0]?.totalPrice.toLocaleString(
                                              'pt-BR',
                                              {
                                                style: 'currency',
                                                currency: 'BRL',
                                              }
                                            )}
                                          </p>
                                        ) : (
                                          card?.type === 'crm' && (
                                            <p className="text-muted font-size-11">
                                              <i
                                                className="fas fa-file-invoice-dollar"
                                                style={{ marginRight: 8 }}
                                              ></i>
                                              Nenhuma proposta
                                            </p>
                                          )
                                        )}

                                        {/* Updated At */}
                                        <p className="text-muted font-size-11">
                                          <i
                                            className="fas fa-calendar-alt"
                                            style={{ marginRight: 8 }}
                                          ></i>
                                          Últ. interação{' '}
                                          {dateToViewAndHour(card?.updatedAt)}
                                        </p>

                                        {/* Moviment Block */}
                                        {isDragDisabled && (
                                          <p className="text-muted font-size-11">
                                            <i
                                              className="fas fas fa-not-equal"
                                              style={{ marginRight: 8 }}
                                            ></i>
                                            Campos obrigatórios
                                          </p>
                                        )}

                                        {/* Additional details (visible on expand) */}
                                        {isExpanded && (
                                          <>
                                            {/* Sector */}
                                            <p className="text-muted font-size-11">
                                              <i
                                                className="fas fa-building"
                                                style={{ marginRight: 8 }}
                                              ></i>
                                              {card?.company.sector}
                                            </p>
                                            {/* Category */}
                                            <p className="text-muted font-size-11">
                                              <i
                                                className="fas fa-tag"
                                                style={{ marginRight: 8 }}
                                              ></i>
                                              {card?.company.category}
                                            </p>
                                          </>
                                        )}
                                      </div>
                                    </CardBody>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          )
                        })}
                        {provided.placeholder}
                      </div>
                    </CardBody>
                    {/* Incluindo totalProposals dentro do Card */}
                    {totalProposals > 0 && (
                      <div
                        style={{
                          backgroundColor: '#ffffff',
                          padding: '10px',
                          fontSize: '20px',
                        }}
                      >
                        {totalProposals.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </div>
                    )}
                  </Card>
                </div>
              )}
            </Droppable>
          )
        })}
      </DragDropContext>
    </div>
  )
}

export default Board
