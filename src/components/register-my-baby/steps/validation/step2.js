import moment from 'moment'
import get from 'lodash/get'
import set from 'lodash/set'
import check from './check'
import  schema from '../schemas/step2'
import {
  MIN_10_AGE_MOTHER_MESSAGE
} from '../../validation-messages'

const validate = (values) => {
  const errors = {}

  const ethnicGroups = get(values, 'mother.ethnicGroups')
  const isCitizen = get(values, 'mother.isCitizen')
  const isPermanentResident = get(values, 'mother.isPermanentResident')
  const isNZRealmResident = get(values, 'mother.isNZRealmResident')
  const isAuResidentOrCitizen = get(values, 'mother.isAuResidentOrCitizen')
  const citizenshipSource = get(values, 'mother.citizenshipSource')

  check('mother.firstNames')(schema, values, errors)
  check('mother.surname')(schema, values, errors)
  check('mother.firstNamesAtBirth')(schema, values, errors)
  check('mother.surnameAtBirth')(schema, values, errors)
  check('mother.occupation')(schema, values, errors)
  check('mother.dateOfBirth')(schema, values, errors)
  check('mother.placeOfBirth')(schema, values, errors)
  check('mother.countryOfBirth')(schema, values, errors)

  check('mother.homeAddress.line1')(schema, values, errors)
  check('mother.homeAddress.line2')(schema, values, errors)
  check('mother.homeAddress.suburb')(schema, values, errors)

  check('mother.maoriDescendant')(schema, values, errors)
  check('mother.ethnicGroups')(schema, values, errors)


  let childBirthDate = get(values, 'child.birthDate')
  let motherBirthDate = get(values, 'mother.dateOfBirth')

  if (childBirthDate && motherBirthDate) {
    if (typeof motherBirthDate === 'string') {
      motherBirthDate = moment(motherBirthDate)
    }

    if (typeof childBirthDate === 'string') {
      childBirthDate = moment(childBirthDate)
    }

    if (
      motherBirthDate.isValid() &&
      childBirthDate.isValid() &&
      childBirthDate.diff(motherBirthDate, 'years') < 10
    ) {
      set(errors, 'mother.dateOfBirth', MIN_10_AGE_MOTHER_MESSAGE)
    }
  }

  if (ethnicGroups && ethnicGroups.length && ethnicGroups.indexOf('other') > -1) {
    check('mother.ethnicityDescription')(schema, values, errors)
  }

  check('mother.isCitizen')(schema, values, errors)

  if (isCitizen === 'no') {
    check('mother.isPermanentResident')(schema, values, errors)
    check('mother.isNZRealmResident')(schema, values, errors)
    check('mother.isAuResidentOrCitizen')(schema, values, errors)

    if (
      isPermanentResident === 'yes' ||
      isNZRealmResident === 'yes' ||
      isAuResidentOrCitizen === 'yes'
    ) {
      check('mother.nonCitizenDocNumber')(schema, values, errors)
    }
  }

  if (isCitizen === 'yes') {
    check('mother.citizenshipSource')(schema, values, errors)

    if (
      citizenshipSource === 'bornInNiue' ||
      citizenshipSource === 'bornInCookIslands' ||
      citizenshipSource === 'bornInTokelau'
    ) {
      check('mother.citizenshipPassportNumber')(schema, values, errors)
    }
  }

  check('mother.daytimePhone')(schema, values, errors)
  check('mother.alternativePhone')(schema, values, errors)
  check('mother.email')(schema, values, errors)

  return errors
}

export default validate

