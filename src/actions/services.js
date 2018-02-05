// actions for location based Services
import { checkStatus } from 'utils'

export const REQUEST_SERVICES_API = 'REQUEST_SERVICES_API'
export const RECEIVE_SERVICES_API = 'RECEIVE_SERVICES_API'
export const RECEIVE_SERVICES_API_ERROR = 'RECEIVE_SERVICES_API_ERROR'

// Action types

function requestServicesAPI () {
  return {
    type: REQUEST_SERVICES_API
  }
}

function receiveServicesAPI (json) {
  return {
    type: RECEIVE_SERVICES_API,
    data: json.result.records
  }
}

function receiveServicesAPIError () {
  return {
    type: RECEIVE_SERVICES_API_ERROR
  }
}

// Action creators

export function fetchServicesDirectory (query) {
  return dispatch => {
    dispatch(requestServicesAPI())
    return fetch(query)
      .then(checkStatus)
      .then(response => response.json())
      .then(json => dispatch(receiveServicesAPI(json)))
      .catch(() => {
        dispatch(receiveServicesAPIError())
      })
  }
}
