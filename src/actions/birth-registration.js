import { checkStatus } from 'utils'
import { applicationError } from './actions'

export const REQUEST_BIRTH_FACILITIES = 'REQUEST_BIRTH_FACILITIES'
export const RECEIVE_BIRTH_FACILITIES = 'RECEIVE_BIRTH_FACILITIES'

function requestBirthFacilities() {
  return {
    type: REQUEST_BIRTH_FACILITIES
  }
}

function receiveBirthFacilities(payload) {
  return {
    type: RECEIVE_BIRTH_FACILITIES,
    payload
  }
}

export function fetchBirthFacilities() {
  return dispatch => {
    dispatch(requestBirthFacilities())
    return fetch('/birth-registration-api/ReferenceData/birth-facilities')
      .then(checkStatus)
      .then(response => response.json())
      .then(json => dispatch(receiveBirthFacilities(json)))
      .catch(error => dispatch(applicationError(error)))
  }
}
