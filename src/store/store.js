import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from 'store/reducers'

export default function configureStore (preloadedState) {
  const middleware = [ thunkMiddleware ]

  if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger({ diff: true, collapsed: true }))
  }

  // Enabling the interaction with Redux Dev Tools extension.
  // Beside debugging capabilities, one convenient thing that it supports is for export/import the state
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  return createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(
      applyMiddleware(...middleware)
    )
  )
}
