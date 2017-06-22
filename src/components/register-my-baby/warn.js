import moment from 'moment'
import get from 'lodash/get'
import set from 'lodash/set'
import {
  WARNING_FATHER_DATE_OF_BIRTH,
  WARNING_MOTHER_DATE_OF_BIRTH,
  WARNING_CITIZENSHIP
} from './validation-messages'

const motherWarn = (values) => {
  const warnings = {}

  let dob = get(values, 'mother.dateOfBirth')
  let childBirthDate = get(values, 'child.birthDate')

  if (dob && childBirthDate) {
    if (typeof dob === 'string') {
      dob = moment(dob)
    }

    if (typeof childBirthDate === 'string') {
      childBirthDate = moment(childBirthDate)
    }

    if (dob.isValid() && childBirthDate.diff(dob, 'years') < 13) {
      set(warnings, 'mother.dateOfBirth', WARNING_MOTHER_DATE_OF_BIRTH)
    }
  }

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
  let dob = get(values, 'father.dateOfBirth')
  let childBirthDate = get(values, 'child.birthDate')

  if (dob && childBirthDate) {
    if (typeof dob === 'string') {
      dob = moment(dob)
    }

    if (typeof childBirthDate === 'string') {
      childBirthDate = moment(childBirthDate)
    }

    if (dob.isValid() && childBirthDate.diff(dob, 'years') < 13) {
      set(warnings, 'father.dateOfBirth', WARNING_FATHER_DATE_OF_BIRTH)
    }
  }

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

const warn = (values) => {
  const motherWarnings = motherWarn(values)
  const fatherWarnings = fatherWarn(values)

  return {
    ...motherWarnings,
    ...fatherWarnings
  }
}

export default warn
