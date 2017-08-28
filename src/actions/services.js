// actions for location based Services
import { checkStatus } from 'utils'

export const REQUEST_SERVICES_API = 'REQUEST_SERVICES_API'
export const RECEIVE_SERVICES_API = 'RECEIVE_SERVICES_API'

// TODO make sure this is passed in from config?
const SERVICES_ENDPOINT = 'https://catalogue.data.govt.nz/api/action/datastore_search_sql?sql='

// using select distinct (and not trying to return catergory data) means that
// duplicate entries (across returned values) will be dropped

let query = encodeURI(`SELECT DISTINCT
  "PROVIDER_NAME",
  "ORGANISATION_PURPOSE",
  "SERVICE_NAME",
  "SERVICE_DETAIL",
  "PHYSICAL_ADDRESS",
  "LATITUDE",
  "LONGITUDE",
  "PROVIDER_WEBSITE_1",
  "PUBLISHED_CONTACT_EMAIL_1",
  "PUBLISHED_PHONE_1",
  "PROVIDER_CONTACT_AVAILABILITY"
from "35de6bf8-b254-4025-89f5-da9eb6adf9a0"
  WHERE
    "LATITUDE" IS NOT NULL
  AND
    "LONGITUDE" IS NOT NULL
  AND
    "LATITUDE" != '0'
  AND
    "LONGITUDE" != '0'
  AND
  (
      LOWER("SERVICE_DETAIL") LIKE '%breast%feeding%'
    OR
      LOWER("ORGANISATION_PURPOSE") LIKE '%breast%feeding%'
    OR
      "LEVEL_2_CATEGORY" LIKE '%Breast Feeding Support%'
  )
  ORDER BY
    "LONGITUDE"`)

  // (
  //     "LEVEL_2_CATEGORY" LIKE '%Pregnancy%'
  //   OR
  //     "LEVEL_2_CATEGORY" LIKE '%Babies%'
  //   OR
  //     "LEVEL_2_CATEGORY" LIKE '%Young Parents%'
  //   OR
  //     "LEVEL_2_CATEGORY" LIKE '%Breast Feeding Support%'
  // )

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

export function fetchServicesDirectory () {
  return dispatch => {
    dispatch(requestServicesAPI())
    return fetch(SERVICES_ENDPOINT + query) // TODO set in webpack config
      .then(checkStatus)
      .then(response => response.json())
      .then(json => dispatch(receiveServicesAPI(json)))
      .catch(function (error) {
        // TODO what should we do for the error here?
      })
  }
}
