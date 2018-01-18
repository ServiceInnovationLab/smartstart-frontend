import {
  REQUEST_API,
  RECEIVE_API,
  SUPPLEMENTARY_OPEN,
  OPEN_PROFILE,
  CLOSE_PROFILE,
  OPEN_TODO,
  CLOSE_TODO
} from 'actions/timeline'

export default function timeline (state = {
  isFetching: false,
  phases: [],
  supplementary: [],
  about: [],
  profilePaneOpen: false,
  todoPaneOpen: false,
  supplementaryID: null
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
    case SUPPLEMENTARY_OPEN:
      return Object.assign({}, state, {
        activeSupplementary: action.activeSupplementary
      })
    default:
      return state
  }
}
