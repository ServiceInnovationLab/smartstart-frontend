import get from 'lodash/get'
import check from './check'
import schema from '../schemas/step1'

const validate = (values) => {
  const errors = {}

  const oneOfMultiple = get(values, 'child.oneOfMultiple')
  const ethnicGroups = get(values, 'child.ethnicGroups')

  check('child.firstNames')(schema, values, errors)
  check('child.surname')(schema, values, errors)
  check('child.sex')(schema, values, errors)
  check('child.aliveAtBirth')(schema, values, errors)
  check('child.birthDate')(schema, values, errors)

  if (oneOfMultiple === 'yes') {
    check('child.multipleBirthOrder')(schema, values, errors)
  }

  check('child.oneOfMultiple')(schema, values, errors)
  check('birthPlace.category')(schema, values, errors)

  if (get(values, 'birthPlace.category') === 'hospital') {
    check('birthPlace.hospital')(schema, values, errors)
  }
  else if (get(values, 'birthPlace.category') === 'home') {
    check('birthPlace.home.line1')(schema, values, errors)
    check('birthPlace.home.line2')(schema, values, errors)
  }
  else if (get(values, 'birthPlace.category') === 'other') {
    check('birthPlace.home.other')(schema, values, errors)
  }

  check('child.maoriDescendant')(schema, values, errors)
  check('child.ethnicGroups')(schema, values, errors)

  if (ethnicGroups && ethnicGroups.length && ethnicGroups.indexOf('other') > -1) {
    check('child.ethnicityDescription')(schema, values, errors)
  }

  return errors
}

export default validate
