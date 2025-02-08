import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from 'reactstrap'
import SimpleBar from 'simplebar-react'
import avatar3 from '../../assets/images/users/avatar-3.jpg'
import { useNotification } from '../../store/notifications/notification.hooks'
import moment from 'moment'
import 'moment/dist/locale/pt-br'

moment.locale('pt-br')

export const NotificationBell = () => {
  const [menu, setMenu] = useState(false)
  const navigate = useNavigate()
  const notification = useNotification()
  const { data: notifications, refetch: refetchNots } =
    notification.getNotifications()
  const { mutate: read } = notification.readNotification()
  const { data: counter, refetch } = notification.getNotificationCounter()

  const onReadMessage = (item) => {
    read(item._id, {
      onSuccess: () => {
        refetch()
        refetchNots()
        navigate(`/lead/${item.context.lead}?board=${item.context.board}`)
        setMenu(false)
      },
    })
  }

  const getNotificationTitle = (type) => {
    switch (type) {
      case 'new_lead':
        return 'Novo Lead'
      default:
        return 'Notificação'
    }
  }

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon position-relative"
          tag="button"
          id="page-header-notifications-dropdown"
        >
          <i
            className={counter?.count > 0 ? 'bx bx-bell bx-tada' : 'bx bx-bell'}
          />
          {counter?.count > 0 && (
            <span className="badge bg-danger rounded-pill">
              {counter?.count ?? ''}
            </span>
          )}
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu dropdown-menu-lg p-0 dropdown-menu-end">
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0">Notificações</h6>
              </Col>
            </Row>
          </div>

          <SimpleBar style={{ height: '230px' }}>
            {notifications?.map((notification, index) => {
              return (
                <Link
                  onClick={() => {
                    onReadMessage(notification)
                  }}
                  className="text-reset notification-item"
                  key={index}
                >
                  <div
                    className="d-flex"
                    style={{
                      backgroundColor: notification.read ? '#fff' : '#e8e8e8',
                    }}
                  >
                    <div className="avatar-xs me-3" style={{ minWidth: 32 }}>
                      <span className="avatar-title bg-primary rounded-circle font-size-16">
                        <i className="bx bx-task" />
                      </span>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mt-0 mb-1">
                        {getNotificationTitle(notification.type)}
                      </h6>
                      <div className="font-size-12 text-muted">
                        <p className="mb-1">{notification.message}</p>
                        <p className="mb-0">
                          <i className="mdi mdi-clock-outline" />{' '}
                          {moment(notification.createdAt).fromNow()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </SimpleBar>
          <div className="p-2 border-top d-grid">
            {/* <Link
              className="btn btn-sm btn-link font-size-14 btn-block text-center"
              to="#"
            >
              <i className="mdi mdi-arrow-right-circle me-1"></i>
              Ver todas
            </Link> */}
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}
