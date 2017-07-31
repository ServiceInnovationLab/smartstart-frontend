import get from 'lodash/get'
import range from 'lodash/range'
import check from './check'
import  schema from '../schemas/step4'

const validate = (values) => {
  const errors = {}

  const fatherKnown = get(values, 'fatherKnown')
  const assistedHumanReproduction = get(values, 'assistedHumanReproduction')
  const assistedHumanReproductionSpermDonor = get(values, 'assistedHumanReproductionSpermDonor')
  const otherChildren = get(values, 'otherChildren')

  const isFormHidden = fatherKnown === 'no' || (assistedHumanReproduction === 'yes' && assistedHumanReproductionSpermDonor)

  if (isFormHidden) {
    return errors;
  }

  const parentRelationship = get(values, 'parentRelationship')

  check('otherChildren')(schema, values, errors)

  if (otherChildren > 0) {
    range(otherChildren).forEach(idx => {
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


