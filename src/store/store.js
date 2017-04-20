import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import rootReducer from 'store/reducers'

export default function configureStore (preloadedState) {
  const middleware = [ thunkMiddleware ]

  if (process.env.NODE_ENV !== 'production') {
    middleware.push(logger)
  }

  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(...middleware)
  )
}
