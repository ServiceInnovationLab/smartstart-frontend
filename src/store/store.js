import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import rootReducer from 'store/reducers'

export default function configureStore (preloadedState) {
  const middleware = [ thunkMiddleware ]

  if (process.env.NODE_ENV !== 'production') {
    middleware.push(logger)
  }

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  return createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(
      applyMiddleware(...middleware)
    )
  )
}
