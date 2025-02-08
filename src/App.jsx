import PropTypes from 'prop-types'
import React, { useEffect } from 'react'

import { connect } from 'react-redux'
import { Route, Routes } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'

// Import Routes all
import { authProtectedRoutes, publicRoutes } from './routes'

// Import all middleware
import Authmiddleware from './routes/route'

// layouts Format
import HorizontalLayout from './components/HorizontalLayout/'
import NonAuthLayout from './components/NonAuthLayout'
import VerticalLayout from './components/VerticalLayout/'

// Import scss
import { Toaster } from 'sonner'
import './assets/scss/theme.scss'

// Import Firebase Configuration file
// import { initFirebaseBackend } from "./helpers/firebase_helper"

import fakeBackend from '/src/helpers/AuthType/fakeBackend'
import {
  clearSocketConnection,
  setSocketManagerToken,
  socketManager,
} from './socket'
import { useNotification } from './store/notifications/notification.hooks'

// Activating fake backend
fakeBackend()

const App = (props) => {
  const selectLayoutState = (state) => state.Layout
  const LayoutProperties = createSelector(selectLayoutState, (layout) => ({
    layoutType: layout.layoutType,
  }))
  const storage = JSON.parse(localStorage.getItem('authUser'))

  const notifications = useNotification()
  const { refetch } = notifications.getNotifications()
  const { refetch: refetchCounter } = notifications.getNotificationCounter()

  const { layoutType } = useSelector(LayoutProperties)

  function getLayout(layoutType) {
    let layoutCls = VerticalLayout
    switch (layoutType) {
      case 'horizontal':
        layoutCls = HorizontalLayout
        break
      default:
        layoutCls = VerticalLayout
        break
    }
    return layoutCls
  }

  useEffect(() => {
    if (storage?.token) {
      setSocketManagerToken()

      socketManager.on('connect', () => {
        console.log('connected')
      })

      socketManager.on('disconnect', () => {
        console.log('disconnected')
      })

      socketManager.on('new_notification', () => {
        refetch()
        refetchCounter()
      })
    } else {
      clearSocketConnection()
    }

    return () => {
      clearSocketConnection()
    }
  }, [storage?.token])

  const Layout = getLayout(layoutType)

  return (
    <React.Fragment>
      <Toaster />
      <Routes>
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={<NonAuthLayout>{route.component}</NonAuthLayout>}
            key={idx}
            exact={true}
          />
        ))}

        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <Authmiddleware>
                <Layout>{route.component}</Layout>
              </Authmiddleware>
            }
            key={idx}
            exact={true}
          />
        ))}
      </Routes>
    </React.Fragment>
  )
}

App.propTypes = {
  layout: PropTypes.any,
}

const mapStateToProps = (state) => {
  return {
    layout: state.Layout,
  }
}

export default connect(mapStateToProps, null)(App)
