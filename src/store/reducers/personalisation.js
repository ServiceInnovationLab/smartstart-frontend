import {
  CHECK_AUTHENTICATION,
  SET_DUE_DATE,
  SET_USER_EMAIL,
  REQUEST_PHASE_METADATA,
  RECEIVE_PHASE_METADATA,
  SAVE_PERSONALISATION,
  REQUEST_PERSONALISATION_DATA,
  RECIEVE_PERSONALISATION_DATA
} from 'actions/personalisation'

export default function personalisation (state = {
  isLoggedIn: false,
  dueDate: null,
  userEmail: null,
  isFetchingPhaseMetadata: false,
  phaseMetadata: [],
  personalisationValues: {},
  isFetchingPersonalisation: false
}, action) {
  switch (action.type) {
    case CHECK_AUTHENTICATION:
      return Object.assign({}, state, {
        isLoggedIn: action.isLoggedIn
      })
    case SET_DUE_DATE:
      return Object.assign({}, state, {
        dueDate: action.dueDate
      })
    case SET_USER_EMAIL:
      return Object.assign({}, state, {
        userEmail: action.email
      })
    case REQUEST_PHASE_METADATA:
      return Object.assign({}, state, {
        isFetchingPhaseMetadata: true
      })
    case RECEIVE_PHASE_METADATA:
      return Object.assign({}, state, {
        isFetchingPhaseMetadata: false,
        phaseMetadata: action.phaseMetadata
      })
    case SAVE_PERSONALISATION:
      return Object.assign({}, state, {
        personalisationValues: action.personalisationValues
      })
    case REQUEST_PERSONALISATION_DATA:
      return Object.assign({}, state, {
        isFetchingPersonalisation: true
      })
    case RECIEVE_PERSONALISATION_DATA:
      return Object.assign({}, state, {
        isFetchingPersonalisation: false,
        personalisationValues: action.personalisationValues
      })
    default:
      return state
  }
}
