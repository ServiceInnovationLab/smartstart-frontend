import deepMap from 'deep-map'
import get from 'lodash/get'
import set from 'lodash/set'

// 1. change all strings to booleans, numbers etc
// 2. if key is in schema, add to object to be sent
// 3. if key is not is schema, use it to infer keyvalues to send instead

const transformType = (value) => {
  if (value === 'true') {
    return true
  } else if (value === 'false') {
    return false
  } else if (!isNaN(parseInt(value, 10))) {
    return parseInt(value, 10)
  }
  return value
}

const transform = (data, schema) => {
  let body = {}

  // 1.
  data = deepMap(data, value => transformType(value))

  // 2.
  schema.forEach(atom => {
    let valueFromForm = get(data, atom.name, null)

    if (valueFromForm !== null) {
      set(body, atom.name, valueFromForm)
    }
  })

  // 3.
  // 3.a. we don't provide any cash threshold values, so just set them to true
  set(body, 'threshold.cash.AccommodationSupplement', true)

  return body
}

export default transform
