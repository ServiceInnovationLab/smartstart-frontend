import get from 'lodash/get'
import set from 'lodash/set'
import unset from 'lodash/unset'

const fieldArrayRegex = /\.\[\d+\]/

const check = (field) => (schema, values, errors) => {
  let schemaField

  if (fieldArrayRegex.test(field)) {
    schemaField = field.replace(fieldArrayRegex, '[]')
  } else {
    schemaField = field
  }

  const validateFuncs = get(schema, `${schemaField}`, {})['validate'] || []

  const messages = validateFuncs
    .map(
      func => func(get(values, field))
    )
    .filter(message => !!message)

  if (messages && messages.length) {
    set(errors, field, messages[0])
  } else {
    unset(errors, field)
  }

  return errors
}

export default check
