import {
  REQUIRE_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  INVALID_NUMBER_MESSAGE,
  EXCEED_MAXLENGTH_MESSAGE
} from './validation-messages'

export const required = value => value ? undefined : REQUIRE_MESSAGE

export const maxLength = max => value =>
  value && value.length > max ? EXCEED_MAXLENGTH_MESSAGE.replace('{max}', max) : undefined

export const maxLength30 = maxLength(30)

export const number = value => value && isNaN(Number(value)) ? INVALID_NUMBER_MESSAGE : undefined

export const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
  INVALID_EMAIL_MESSAGE : undefined

