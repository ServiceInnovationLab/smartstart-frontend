import {
  REQUEST_SCHEMA,
  RECEIVE_SCHEMA,
  FAILURE_SCHEMA,
  REQUEST_ELIGIBILITY,
  RECEIVE_ELIGIBILITY,
  FAILURE_ELIGIBILITY
} from 'actions/entitlements'

export default function entitlements (state = {
  fetchingSchema: false,
  schema: [],
  fetchingEligibility: false,
  eligibility: {}
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
    case REQUEST_ELIGIBILITY:
      return {
        ...state,
        fetchingEligibility: true
      }
    case RECEIVE_ELIGIBILITY:
      return {
        ...state,
        fetchingEligibility: false,
        eligibility: action.payload
      }
    case FAILURE_ELIGIBILITY:
      return {
        ...state,
        fetchingEligibility: false
      }
    default:
      return state
  }
}
