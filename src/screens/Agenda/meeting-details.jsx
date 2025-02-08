import PropTypes from 'prop-types'
import React from "react"
import { Modal, ModalBody } from "reactstrap"
import './agenda.css'
import moment from 'moment'

const MeetingDetailModal = ({ show, onCloseClick, event }) => {
  if (!event) return null

  return (
    <Modal isOpen={show} toggle={onCloseClick} centered={true}>
      <ModalBody className="py-3 px-5">
        <div className="agenda-modal-container">
          <div className="agenda-modal-title">
            {event.title}
          </div>

          {event.url && event.url !== 'undefined' && (
            <div className="agenda-info-item">
              <div>Link</div>
              <a className="agenda-info-label" href={event.url} target="_black">{event.url}</a>
            </div>
          )}
          <div className="agenda-info-item">
            <div>Data</div>
            <div className="agenda-info-label">
              <div>De {moment(new Date(event?.start)).format("DD/MM/YYYY HH:mm")}</div>
              <div>Até {moment(new Date(event?.end)).format("DD/MM/YYYY HH:mm")}</div>
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}

MeetingDetailModal.propTypes = {
  onCloseClick: PropTypes.func,
  show: PropTypes.any
}

export default MeetingDetailModal