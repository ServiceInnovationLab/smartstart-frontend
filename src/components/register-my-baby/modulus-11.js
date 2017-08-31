const calculateCheckDigit = (parts, weightFactors) => {
  const sumByWeight = parts.reduce(
    (accumulator, val, idx) =>
      accumulator + parseInt(val, 10) * weightFactors[idx] ,
    0
  )

  const remainder = sumByWeight % 11
  const calculatedCheckDigit = remainder === 0 ? remainder : 11 - remainder

  return calculatedCheckDigit
}

/**
 * Specs: https://www.ird.govt.nz/resources/d/8/d8e49dce-1bda-4875-8acf-9ebf908c6e17/rwt-nrwt-spec-2014.pdf
 *
 * ALGORITHM:
 *
 * #1 Validate range:
 * - Ensure the number in the range (MSD 8 or 9 characters, IRD has more specific range to check )
 *
 * #2 The check digit:
 * - Grep the last digit, it will become the check digit, we will compare with the calculated check digit later
 *
 * #3 Calculate the check digit from the base:
 * - Remove the last digit to have the base
 * - Pad to eight digits by adding a leading zero
 * - Calculate the check digit using provided weight factors
 *
 * #4 Check the result:
 * - If the first calculated check digit is 10, we need a second calculation using a differnt weight factor
 * - Otherwise, if the calculated check digit is in the range 0 - 9, we compare it with the check digit grepped from step #2
 *
 * RULES:
 * - Number is valid when [calculated check digit] === [check digit]
 * - After second calculation, if calculated check digit is still 10, the number is invalid
 */
export const validateIrdNumber = value => {
  if (!value) {
    return false
  }

  const numberValue = parseInt(value, 10)
  const stringValue = `${value}`

  if (isNaN(numberValue) || numberValue < 10000000 || numberValue > 150000000) {
    return false
  }

  const checkDigit = parseInt(stringValue.substring(stringValue.length - 1), 10)
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

  const numberValue = parseInt(value, 10)
  const stringValue = `${value}`

  if (isNaN(numberValue) || (stringValue.length !== 8 && stringValue.length !== 9)) {
    return false
  }

  const checkDigit = parseInt(stringValue.substring(stringValue.length - 1), 10)
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
