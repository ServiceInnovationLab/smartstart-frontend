/*
 * These general purpose validators all have customisable messages .
 * Validators that are specific to a particular form are kept directly with that
 * component.
 */

export const requiredWithMessage = message => value =>
  (
    typeof value === 'undefined' ||
    value === null ||
    (value.trim && value.trim() === '') ||
    (Array.isArray(value) && !value.length) // some field's values bind to an array eg.ethnicGroups
  ) ? message : undefined

export const numberWithMessage = message => value =>
  (
    value &&
    (
      isNaN(parseInt(value, 10)) ||
      parseInt(value, 10) < 0
    )
  ) ? message : undefined
