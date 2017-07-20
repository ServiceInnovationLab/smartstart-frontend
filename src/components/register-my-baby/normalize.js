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

