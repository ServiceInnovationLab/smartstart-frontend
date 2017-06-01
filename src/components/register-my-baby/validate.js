import moment from 'moment'
import { validateIrdNumber, validateMsdNumber } from './modulus-11'
import {
  REQUIRE_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  INVALID_NUMBER_MESSAGE,
  EXCEED_MAXLENGTH_MESSAGE,
  INVALID_NAME_MESSAGE,
  INVALID_DATE_MESSAGE,
  INVALID_IRD_MESSAGE,
  INVALID_MSD_MESSAGE,
  FUTURE_DATE_MESSAGE
} from './validation-messages'

export const required = value =>
  (typeof value === 'undefined' || value === null || (value.trim && value.trim() === '')) ? REQUIRE_MESSAGE : undefined

export const requiredWithMessage = message => value => value ? undefined : message

export const maxLength = max => value =>
  value && value.length > max ? EXCEED_MAXLENGTH_MESSAGE.replace('{max}', max) : undefined

export const maxLength30 = maxLength(30)

export const number = value => value && isNaN(Number(value)) ? INVALID_NUMBER_MESSAGE : undefined

export const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
  INVALID_EMAIL_MESSAGE : undefined

/*
 * Validation rules for name in BRO form:
 * - alpha characters only except hyphen and apostrophe
 * - Macrons allowed
 */
export const validName = value =>
  value && /[0-9,.":;_=+*~`!<>?|\!()@#$%^&*_+&*^$]/g.test(value) ?
  INVALID_NAME_MESSAGE : undefined

export const validDate = value => {
  if (!value) {
    return
  }

  if (typeof value === 'string') {
    value = moment(value)
  }

  if (!value.isValid()) {
    return INVALID_DATE_MESSAGE
  } else if (value.isAfter(moment())) {
    return FUTURE_DATE_MESSAGE
  }
}

export const validIrd = value => {
  if (!value) {
    return
  }

  if (!validateIrdNumber(value)) {
    return INVALID_IRD_MESSAGE
  }
}

export const validMsd = value => {
  if (!value) {
    return
  }

  if (!validateMsdNumber(value)) {
    return INVALID_MSD_MESSAGE
  }
}
