import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import {
  REQUEST_API,
  RECEIVE_API,
  CHECK_AUTHENTICATION,
  APPLICATION_ERROR,
  AUTH_ERROR,
  PIWIK_TRACK,
  SUPPLEMENTARY_OPEN,
  SET_DUE_DATE,
  SET_USER_EMAIL,
  REQUEST_PHASE_METADATA,
  RECEIVE_PHASE_METADATA,
  SAVE_PERSONALISATION,
  REQUEST_PERSONALISATION_DATA,
  RECIEVE_PERSONALISATION_DATA,
  OPEN_PROFILE,
  CLOSE_PROFILE,
  OPEN_TODO,
  CLOSE_TODO,
  GET_PIWIK_ID
} from 'actions/actions'
import {
  RECEIVE_BIRTH_FACILITIES,
  RECEIVE_COUNTRIES
} from 'actions/birth-registration'

function contentActions (state = {
  isFetching: false,
  phases: [],
  supplementary: [],
  about: []
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
        supplementary: action.supplementary,
        about: action.about
      })
    default:
      return state
  }
}

function personalisationActions (state = {
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

function applicationActions (state = {
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

function settingsDisplayActions (state = {
  profilePaneOpen: false,
  todoPaneOpen: false
}, action) {
  switch (action.type) {
    case OPEN_PROFILE:
      return Object.assign({}, state, {
        profilePaneOpen: true
      })
    case CLOSE_PROFILE:
      return Object.assign({}, state, {
        profilePaneOpen: false
      })
    case OPEN_TODO:
      return Object.assign({}, state, {
        todoPaneOpen: true
      })
    case CLOSE_TODO:
      return Object.assign({}, state, {
        todoPaneOpen: false
      })
    default:
      return state
  }
}

function supplementaryContentActions (state = {
  supplementaryID: null
}, action) {
  switch (action.type) {
    case SUPPLEMENTARY_OPEN:
      return Object.assign({}, state, {
        activeSupplementary: action.activeSupplementary
      })
    default:
      return state
  }
}

/*
 * If we have a saved state of form, here is where we load that state into upon initialization
 *
 * A saved state should following this structure:
 *
 * {
 *   step: number, // current step at the time of save
 *   data: object  // current form state at the time of save
 * }
 */

const initialRegistrationFormState = {
  numberOfSiblings: 0,
  certificateOrder: {
    courierDelivery: 'standard'
  }
}

function birthRegistration (state = {
  birthFacilities: [],
  countries: [],
  savedRegistrationForm: initialRegistrationFormState
}, action) {
  switch (action.type) {
    case RECEIVE_BIRTH_FACILITIES:
      return {
        ...state,
        birthFacilities: action.payload.response
      };
    case RECEIVE_COUNTRIES:
      return {
        ...state,
        countries: action.payload.response
      };
    default:
      return state
  }
}

const rootReducer = combineReducers({
  contentActions,
  personalisationActions,
  applicationActions,
  settingsDisplayActions,
  supplementaryContentActions,
  form: formReducer,
  birthRegistration
})

export default rootReducer
