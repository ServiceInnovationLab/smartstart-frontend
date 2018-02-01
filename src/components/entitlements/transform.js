import deepMap from 'deep-map'

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
    let path = atom.name.split('.')

    // all paths are either two or three levels deep
    if (path.length === 2) {
      if (data[path[0]] && typeof data[path[0]][path[1]] !== 'undefined') {
        if (body[path[0]] === undefined) { body[path[0]] = {} }
        body[path[0]][path[1]] = data[path[0]][path[1]]
      }
    } else if (path.length === 3) {
      if (data[path[0]] && data[path[0]][path[1]] && typeof data[path[0]][path[1]][path[2]] !== 'undefined') {
        if (body[path[0]] === undefined) { body[path[0]] = {} }
        if (body[path[0]][path[1]] === undefined) { body[path[0]][path[1]] = {} }
        body[path[0]][path[1]][path[2]] = data[path[0]][path[1]][path[2]]
      }
    }
  })

  return body
}

export default transform
