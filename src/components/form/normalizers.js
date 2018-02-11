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
 * A normalizer function to mimic HTML5 `maxlength` behavior (refer to BRO MSD & IRD field)
 */
export const maximum = (max) => (value, previousVal) => {
  if (isNaN(value)) {
    return previousVal;
  }

  return value <= max ? value : previousVal
}

/**
 * Copy of bro-api's implementation
 */
export const titleCase = (value = '') => {
  value = value.toLowerCase()

  let titleCased = value.replace(
    /(^[a-z])|(\s+[a-z])/g,
    letter => letter.toUpperCase()
  )

  return titleCased
}
