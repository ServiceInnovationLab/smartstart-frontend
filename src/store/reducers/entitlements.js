import {
  REQUEST_SCHEMA,
  RECEIVE_SCHEMA,
  FAILURE_SCHEMA
} from 'actions/entitlements'

export default function entitlements (state = {
  fetchingSchema: false,
  schema: []
}, action) {
  switch (action.type) {
    case REQUEST_SCHEMA:
      return {
        ...state,
        fetchingSchema: true
      }
    case RECEIVE_SCHEMA:
      return {
        ...state,
        fetchingSchema: false,
        schema: action.payload
      }
    case FAILURE_SCHEMA:
      return {
        ...state,
        fetchingSchema: false
      }
    default:
      return state
  }
}
