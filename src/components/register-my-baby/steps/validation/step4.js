import moment from 'moment'
import get from 'lodash/get'
import set from 'lodash/set'
import range from 'lodash/range'
import check from 'components/form/get-validation'
import schema from '../schemas/step4'
import {
  MIN_16_AGE_RELATIONSHIP_DATE_MESSAGE,
} from '../../validation-messages'

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

  let parentRelationshipDate = get(values, 'parentRelationshipDate')
  let motherBirthDate = get(values, 'mother.dateOfBirth')
  let fatherBirthDate = get(values, 'father.dateOfBirth')

  if (motherBirthDate && fatherBirthDate && parentRelationshipDate) {
    if (typeof motherBirthDate === 'string') {
      motherBirthDate = moment(motherBirthDate)
    }

    if (typeof fatherBirthDate === 'string') {
      fatherBirthDate = moment(fatherBirthDate)
    }

    if (typeof parentRelationshipDate === 'string') {
      parentRelationshipDate = moment(parentRelationshipDate)
    }

    if (
      motherBirthDate.isValid() &&
      fatherBirthDate.isValid() &&
      parentRelationshipDate.isValid() &&
      (
        parentRelationshipDate.diff(motherBirthDate, 'years') < 16 ||
        parentRelationshipDate.diff(fatherBirthDate, 'years') < 16
      )
    ) {
      set(errors, 'parentRelationshipDate', MIN_16_AGE_RELATIONSHIP_DATE_MESSAGE)
    }
  }

  return errors
}

export default validate
