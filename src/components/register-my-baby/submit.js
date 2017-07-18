import set from 'lodash/set'
import get from 'lodash/get'
import { checkStatus } from 'utils'
import { SubmissionError } from 'redux-form';
import { transform, transformFullSubmission, SERVER_FIELD_TO_FRONTEND_FIELD } from './transform'
import { frontendMessageByErrorCode } from './validation-messages'

const toReduxFormSubmissionError = (json) => {
  const consumableError = {}
  const statusCode = get(json, 'error.statusCode')
  const duplicate = get(json, 'error.duplicate')
  const errors = get(json, 'error.errors', [])

  if (statusCode === 400) {
    if (Array.isArray(errors)) {
      errors.forEach(error => {
        const frontendMessage = frontendMessageByErrorCode[error.code] || frontendMessageByErrorCode[`${error.code}:${error.field}`]
        const frontendField = SERVER_FIELD_TO_FRONTEND_FIELD[error.field] || error.field

        if (!frontendMessage) {
          throw new Error('NO_FRONTEND_ERROR_CODE_MAPPING')
        }

        if (!frontendMessage.message) {
          frontendMessage.message = error.message
        }

        const fieldErrors = get(consumableError, frontendField, [])
        fieldErrors.push(frontendMessage)

        set(consumableError, frontendField, fieldErrors)
      })
    }

    if (duplicate) {
      set(consumableError, '_error', 'This is a duplicated submission. Please try again or contact us for more detail.')
    }
  } else {
    consumableError._error = 'An unexpected error has occurred.'
  }

  return consumableError
}

export function validateOnly(formState, csrfToken) {
  const transformedData = transform(formState)
  transformedData._csrf = csrfToken
  transformedData.activity = 'validateOnly'
  transformedData.confirmationUrlSuccess = 'https://smartstart.services.govt/register-my-baby/confirmation'
  transformedData.confirmationUrlFailure = 'https://smartstart.services.govt/register-my-baby/confirmation/payment-failed'

  return fetch('/birth-registration-api/Births/birth-registrations', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transformedData)
  })
  .then(checkStatus)
  .then(response => response.json())
  .catch((error) => {
    if (error.response) {
      return error.response.json()
        .then(errorJSON => {
          const reduxFormConsumableError = toReduxFormSubmissionError(errorJSON)
          throw new SubmissionError(reduxFormConsumableError)
        })
    }
  })
}

export function fullSubmit(formState, csrfToken) {
  const transformedData = transformFullSubmission(formState)
  transformedData._csrf = csrfToken
  transformedData.activity = 'fullSubmission'
  transformedData.confirmationUrlSuccess = 'https://smartstart.services.govt/register-my-baby/confirmation'
  transformedData.confirmationUrlFailure = 'https://smartstart.services.govt/register-my-baby/confirmation/payment-failed'

  return fetch('/birth-registration-api/Births/birth-registrations', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transformedData)
  })
  .then(checkStatus)
  .then(response => response.json())
  .catch((error) => {
    if (error.response) {
      return error.response.json()
        .then(errorJSON => {
          const reduxFormConsumableError = toReduxFormSubmissionError(errorJSON)
          throw new SubmissionError(reduxFormConsumableError)
        })
    }
  })
 }
