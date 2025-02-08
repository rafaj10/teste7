import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './reducers'
import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()
const logMiddleware = (store) => (next) => (action) => {
  if (import.meta.env.MODE === 'development') {
    console.log('dispatching', action)
  }

  let result = next(action)

  if (import.meta.env.MODE === 'development') {
    console.log('next state', store.getState())
  }

  return result
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware, logMiddleware))
)
sagaMiddleware.run(rootSaga)

export default store
