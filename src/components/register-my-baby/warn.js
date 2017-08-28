import get from 'lodash/get'
import set from 'lodash/set'
import trim from 'lodash/trim'
import {
  WARNING_CITIZENSHIP,
  WARNING_PARENT_SURNAME_MATCH
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

  const fatherSurname = trim(get(values, 'father.surname'))
  const motherSurname = trim(get(values, 'mother.surname'))
  const isPermanentResident = get(values, 'father.isPermanentResident')
  const isNZRealmResident = get(values, 'father.isNZRealmResident')
  const isAuResidentOrCitizen = get(values, 'father.isAuResidentOrCitizen')

  if (fatherSurname && fatherSurname === motherSurname) {
    set(warnings, 'father.surname', WARNING_PARENT_SURNAME_MATCH)
  }

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
    ...fatherWarnings,
  }
}

export default warn
