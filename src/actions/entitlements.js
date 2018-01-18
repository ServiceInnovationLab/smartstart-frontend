import { checkStatus } from 'utils'
import fetchWithRetry from 'fetch-retry'

export const REQUEST_SCHEMA = 'REQUEST_SCHEMA'
export const RECEIVE_SCHEMA = 'RECEIVE_SCHEMA'
export const FAILURE_SCHEMA = 'FAILURE_SCHEMA'

function requestSchema() {
  return {
    type: REQUEST_SCHEMA
  }
}

function receiveSchema(payload) {
  return {
    type: RECEIVE_SCHEMA,
    payload
  }
}

function failureSchema() {
  return {
    type: FAILURE_SCHEMA
  }
}

export function fetchSchema() {
  return dispatch => {
    dispatch(requestSchema())
    // TODO bring url below from config or via caching? also auth token
    return fetchWithRetry('https://nz.raap.d61.io/api/v0/domain/nz-entitlements-eligibility/schema?criteria=draft', {
      retries: 3,
      retryDelay: 500,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0Zjc5MzJjOC1jMGFhLTQwY2QtYWFmMy1mYjkzM2YyMWI0MDEiLCJleHAiOjE1MTg0NjIxMzMsImlhdCI6MTUxNjA0MjkzM30.-dXnWoQfUSv9dNyLnpm3vxSmRwYGdgmUL5BZrHtnjw8'
      }
    })
    .then(checkStatus)
    .then(response => {
      return response.json()
    })
    .then(json => dispatch(receiveSchema(json)))
    .catch(() =>  dispatch(failureSchema()))
  }
}
