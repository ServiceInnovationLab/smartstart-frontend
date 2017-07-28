import toLower from 'lodash/toLower'
import startCase from 'lodash/startCase'

export const combine = (...normalizers) => (value, previousVal) => {
  normalizers.forEach(normalize =>
    value = normalize(value, previousVal)
  )
  return value
}

export const maxLength = (max) => (value) => {
  return value.length <= max ? value : value.substring(0, max)
}

/**
 * A normalizer function to mimic HTML5 `maxlength` behavior (refer to MSD & IRD field)
 */
export const maximum = (max) => (value, previousVal) => {
  if (isNaN(value)) {
    return previousVal;
  }

  return value <= max ? value : previousVal
}

export const titleCase = value => {
  const spacesInTheEndMatches  = (value || '').match(/\s+$/)

  let suffix = ''
  if (spacesInTheEndMatches && spacesInTheEndMatches.length) {
    suffix = spacesInTheEndMatches[0]
  }

  // lodash stripe out the trailing spaces after `startCase`
  // we need to preserve this otherwise user can't type space at all
  return `${startCase(toLower(value))}${suffix}`
}

