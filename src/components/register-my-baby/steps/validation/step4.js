import get from 'lodash/get'
import check from './check'
import  schema from '../schemas/step4'

const validate = (values) => {
  const errors = {}

  const siblings = get(values, 'siblings')

  const parentRelationship = get(values, 'parentRelationship')

  check('otherChildren')(schema, values, errors)

  if (siblings && siblings.length) {
    siblings.forEach((sibling, idx) => {
      check(`siblings.[${idx}].sex`)(schema, values, errors)
      check(`siblings.[${idx}].statusOfChild`)(schema, values, errors)
      check(`siblings.[${idx}].dateOfBirth`)(schema, values, errors)
    })
  }

  check('parentRelationship')(schema, values, errors)

  if (parentRelationship === 'marriage' || parentRelationship === 'civilUnion') {
    check('parentRelationshipDate')(schema, values, errors)
    check('parentRelationshipPlace')(schema, values, errors)
  }

  return errors
}

export default validate


