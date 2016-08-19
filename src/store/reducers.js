import { combineReducers } from 'redux'
import { REQUEST_API, RECEIVE_API, CHECK_AUTHENTICATION, APPLICATION_ERROR, PIWIK_TRACK } from 'actions/actions'

function contentActions (state = {
  isFetching: false,
  phases: [],
  supplementary: []
}, action) {
  switch (action.type) {
    case REQUEST_API:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RECEIVE_API:
      return Object.assign({}, state, {
        isFetching: false,
        phases: action.phases,
        supplementary: action.supplementary
      })
    default:
      return state
  }
}

function personalisationActions (state = {
  isLoggedIn: false
}, action) {
  switch (action.type) {
    case CHECK_AUTHENTICATION:
      return Object.assign({}, state, {
        isLoggedIn: action.isLoggedIn
      })
    default:
      return state
  }
}

function applicationActions (state = {
  error: false
}, action) {
  switch (action.type) {
    case APPLICATION_ERROR:
      return Object.assign({}, state, {
        error: action.error
      })
    case PIWIK_TRACK:
    default:
      return state
  }
}

const rootReducer = combineReducers({
  contentActions,
  personalisationActions,
  applicationActions
})

export default rootReducer
