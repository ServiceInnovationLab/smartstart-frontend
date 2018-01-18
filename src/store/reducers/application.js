import {
  APPLICATION_ERROR,
  AUTH_ERROR,
  PIWIK_TRACK,
  GET_PIWIK_ID
} from 'actions/application'

export default function application (state = {
  error: false,
  authError: false,
  piwikID: null
}, action) {
  switch (action.type) {
    case APPLICATION_ERROR:
      return Object.assign({}, state, {
        error: action.error
      })
    case AUTH_ERROR:
      return Object.assign({}, state, {
        authError: action.authError
      })
    case GET_PIWIK_ID:
      return Object.assign({}, state, {
        piwikID: action.piwikID
      })
    case PIWIK_TRACK:
    default:
      return state
  }
}
