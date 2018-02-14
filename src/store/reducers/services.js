import {
  REQUEST_SERVICES_API,
  RECEIVE_SERVICES_API,
  RECEIVE_SERVICES_API_ERROR
} from 'actions/services'

export default function services (state = {
  isFetching: false,
  directory: [],
  directoryError: false
}, action) {
  switch (action.type) {
    case REQUEST_SERVICES_API:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RECEIVE_SERVICES_API:
      return Object.assign({}, state, {
        isFetching: false,
        directory: action.data,
        directoryError: false
      })
    case RECEIVE_SERVICES_API_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        directory: [],
        directoryError: true
      })
    default:
      return state
  }
}
