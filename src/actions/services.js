// actions for location based Services
import { checkStatus } from 'utils'

export const REQUEST_SERVICES_API = 'REQUEST_SERVICES_API'
export const RECEIVE_SERVICES_API = 'RECEIVE_SERVICES_API'

// TODO make sure this is passed in from config?
const SERVICES_ENDPOINT = 'https://catalogue.data.govt.nz/api/action/datastore_search_sql?sql='

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

// Action creators

export function fetchServicesDirectory (query) {
  return dispatch => {
    dispatch(requestServicesAPI())
    return fetch(SERVICES_ENDPOINT + query) // TODO set in webpack config
      .then(checkStatus)
      .then(response => response.json())
      .then(json => dispatch(receiveServicesAPI(json)))
      .catch(error => {
        // TODO what should we do for the error here?
      })
  }
}
