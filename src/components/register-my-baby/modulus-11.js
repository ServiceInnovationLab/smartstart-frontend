const calculateCheckDigit = (parts, weightFactors) => {
  const sumByWeight = parts.reduce(
    (accumulator, val, idx) =>
      accumulator + parseInt(val) * weightFactors[idx] ,
    0
  )

  const remainder = sumByWeight % 11
  const calculatedCheckDigit = remainder === 0 ? remainder : 11 - remainder

  return calculatedCheckDigit;
}

/**
 * Specs: https://www.ird.govt.nz/resources/d/8/d8e49dce-1bda-4875-8acf-9ebf908c6e17/rwt-nrwt-spec-2014.pdf
 */
export const validateIrdNumber = value => {
  if (!value) {
    return false
  }

  const numberValue = parseInt(value)
  const stringValue = `${value}`

  if (isNaN(numberValue) || numberValue < 10000000 || numberValue > 150000000) {
    return false
  }

  const checkDigit = parseInt(stringValue.substring(stringValue.length - 1))
  let base = stringValue.substring(0, stringValue.length - 1)

  if (base.length === 7) {
    base = `0${base}`
  }

  const parts = base.split('')

  const firstCalculatedCheckDigit = calculateCheckDigit(parts, [3, 2, 7, 6, 5, 4, 3, 2])
  if (firstCalculatedCheckDigit !== 10) {
    return firstCalculatedCheckDigit === checkDigit
  }

  const secondCalculatedCheckDigit = calculateCheckDigit(parts, [7, 4, 3, 2, 5, 2, 7, 6])
  if (secondCalculatedCheckDigit !== 10) {
    return secondCalculatedCheckDigit === checkDigit
  }

  return false
}

/**
 * The differences with IRD's one are the range check & different weight factors
 */
export const validateMsdNumber = value => {
  if (!value) {
    return false
  }

  const numberValue = parseInt(value)
  const stringValue = `${value}`

  if (isNaN(numberValue) || (stringValue.length !== 8 && stringValue.length !== 9)) {
    return false
  }

  const checkDigit = parseInt(stringValue.substring(stringValue.length - 1))
  let base = stringValue.substring(0, stringValue.length - 1)

  if (base.length === 7) {
    base = `0${base}`
  }

  const parts = base.split('')

  const firstCalculatedCheckDigit = calculateCheckDigit(parts, [8, 7, 9, 10, 6, 3, 4, 2])
  if (firstCalculatedCheckDigit !== 10) {
    return firstCalculatedCheckDigit === checkDigit
  }

  const secondCalculatedCheckDigit = calculateCheckDigit(parts, [3, 4, 2, 10, 5, 8, 7, 9])
  if (secondCalculatedCheckDigit !== 10) {
    return secondCalculatedCheckDigit === checkDigit
  }

  return false
}
