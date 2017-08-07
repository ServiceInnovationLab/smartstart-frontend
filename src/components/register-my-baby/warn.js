import moment from 'moment'
import get from 'lodash/get'
import set from 'lodash/set'
import {
  MIN_16_AGE_RELATIONSHIP_DATE_MESSAGE,
  WARNING_CITIZENSHIP
} from './validation-messages'

const motherWarn = (values) => {
  const warnings = {}

  const isPermanentResident = get(values, 'mother.isPermanentResident')
  const isNZRealmResident = get(values, 'mother.isNZRealmResident')
  const isAuResidentOrCitizen = get(values, 'mother.isAuResidentOrCitizen')

  if (
    isPermanentResident === 'no' &&
    isNZRealmResident === 'no' &&
    isAuResidentOrCitizen === 'no'
  ) {
    set(warnings, 'mother.citizenshipWarning', WARNING_CITIZENSHIP)
  }

  return warnings;
}

const fatherWarn = (values) => {
  const warnings = {}

  const isPermanentResident = get(values, 'father.isPermanentResident')
  const isNZRealmResident = get(values, 'father.isNZRealmResident')
  const isAuResidentOrCitizen = get(values, 'father.isAuResidentOrCitizen')

  if (
    isPermanentResident === 'no' &&
    isNZRealmResident === 'no' &&
    isAuResidentOrCitizen === 'no'
  ) {
    set(warnings, 'father.citizenshipWarning', WARNING_CITIZENSHIP)
  }
  return warnings
}

const relationshipWarn = (values) => {
  const warnings = {}

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
      set(warnings, 'parentRelationshipDate', MIN_16_AGE_RELATIONSHIP_DATE_MESSAGE)
    }
  }

  return warnings
}

const warn = (values) => {
  const motherWarnings = motherWarn(values)
  const fatherWarnings = fatherWarn(values)
  const relationshipWarnings = relationshipWarn(values)

  return {
    ...motherWarnings,
    ...fatherWarnings,
    ...relationshipWarnings
  }
}

export default warn
