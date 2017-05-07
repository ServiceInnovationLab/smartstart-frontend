import {
  REQUIRE_MESSAGE,
  INVALID_EMAIL_MESSAGE
} from './validation-messages'

export const required = value => value ? undefined : REQUIRE_MESSAGE

export const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined

export const maxLength30 = maxLength(30)

export const number = value => value && isNaN(Number(value)) ? 'Must be a number' : undefined

export const minValue = min => value =>
  value && value < min ? `Must be at least ${min}` : undefined

export const minValue18 = minValue(18)

export const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
  INVALID_EMAIL_MESSAGE : undefined

