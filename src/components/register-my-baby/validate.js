import moment from 'moment'
import uniq from 'lodash/uniq'
import { validateIrdNumber, validateMsdNumber } from './modulus-11'
import {
  REQUIRE_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  INVALID_NUMBER_MESSAGE,
  EXCEED_MAXLENGTH_MESSAGE,
  INVALID_CHAR_MESSAGE,
  INVALID_DATE_MESSAGE,
  INVALID_IRD_MESSAGE,
  INVALID_MSD_MESSAGE,
  FUTURE_DATE_MESSAGE,
  MIN_AGE_MESSAGE,
  MAX_AGE_MESSAGE
} from './validation-messages'

export const required = value =>
  (typeof value === 'undefined' || value === null || (value.trim && value.trim() === '')) ? REQUIRE_MESSAGE : undefined

export const requiredWithMessage = message => value =>
  (typeof value === 'undefined' || value === null || (value.trim && value.trim() === '')) ? message : undefined

export const maxLength = max => value =>
  value && value.length > max ? EXCEED_MAXLENGTH_MESSAGE.replace('{max}', max) : undefined

export const maxLength30 = maxLength(30)

export const number = value => value && isNaN(Number(value)) ? INVALID_NUMBER_MESSAGE : undefined

export const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
  INVALID_EMAIL_MESSAGE : undefined

const invalidAlphaRegex = /[^a-zA-Z\-'ÀÁÂÃÄÅÇÈÉÊÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝŸàáâãäåçèéêëìíîïñòóðõöùúûüýÿĀāĒēĪīŌōŪū\s]/g
const invalidCharStrictRegex = /[^a-zA-Z0-9\-'ÀÁÂÃÄÅÇÈÉÊÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝŸàáâãäåçèéêëìíîïñòóðõöùúûüýÿĀāĒēĪīŌōŪū\s]/g
const invalidCharRelaxRegex = /[~!@#$%^&*()+={}[]|:;<>]+/g
const invalidCharTest = (value, regex) => {
  const invalidMatches = value ? value.match(regex) : []

  if (invalidMatches && invalidMatches.length) {
    return INVALID_CHAR_MESSAGE.replace('${invalid_matches}', uniq(invalidMatches).map(c => `'${c}'`).join(', '))
  }
}
export const validAlpha = value => invalidCharTest(value, invalidAlphaRegex)
export const validCharStrict = value => invalidCharTest(value, invalidCharStrictRegex)
export const validCharRelax = value => invalidCharTest(value, invalidCharRelaxRegex)

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

export const olderThan = minAge => value => {
  const dob = moment(value)

  if (dob.isValid()) {
    const age = moment().diff(dob, 'years')

    if (age < minAge) {
      return MIN_AGE_MESSAGE.replace('{min_age}', minAge)
    }
  }
}

export const youngerThan = maxAge => value => {
  const dob = moment(value)

  if (dob.isValid()) {
    const age = moment().diff(dob, 'years')

    if (age > maxAge) {
      return MAX_AGE_MESSAGE.replace('{max_age}', maxAge)
    }
  }
}
