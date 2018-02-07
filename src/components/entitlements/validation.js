import get from 'lodash/get'
import check from 'components/form/get-validation'
import fields from './fields'

const validate = (values) => {
  const errors = {}

  // set up values that need to be used for conditions
  const isNZResident = get(values, 'applicant.isNZResident')
  const hasDisability = get(values, 'applicant.disability')
  const relationshipStatus = get(values, 'applicant.relationshipStatus')
  const numberOfChildren = get(values, 'applicant.numberOfChildren')
  const childrenAges = get(values, 'children.ages')
  const childHasDisability = get(values, 'child.hasSeriousDisability')
  const requiresConstantCare = get(values, 'child.requiresConstantCare')
  const attendsECE = get(values, 'child.attendsECE')
  const hasAccommodationCosts = get(values, 'applicant.hasAccommodationCosts')

  // Your background

  check('applicant.isNZResident')(fields, values, errors)

  if (isNZResident === 'true') {
    check('applicant.normallyLivesInNZ')(fields, values, errors)
    check('applicant.Age')(fields, values, errors)
    check('applicant.hasDisability')(fields, values, errors)
    check('applicant.relationshipStatus')(fields, values, errors)
  }

  if (hasDisability === 'true') {
    check('applicant.hasSeriousDisability')(fields, values, errors)
  }

  if (relationshipStatus && relationshipStatus !== 'single') {
    check('applicant.isInadequatelySupportedByPartner')(fields, values, errors)
  }

  // Your children

  if (isNZResident === 'true') {
    check('applicant.expectingChild')(fields, values, errors)
    check('applicant.numberOfChildren')(fields, values, errors)
  }

  if (numberOfChildren && parseInt(numberOfChildren, 10) > 2) {
    check('applicant.needsDomesticSupport﻿')(fields, values, errors)
  }

  if (numberOfChildren && parseInt(numberOfChildren, 10) > 0) {
    check('children.ages﻿')(fields, values, errors)
    check('child.hasSeriousDisability')(fields, values, errors)
  }

  if (childrenAges && childrenAges.length && parseInt(childrenAges[childrenAges.length - 1], 10) === 18) {
    check('children.financiallyIndependant')(fields, values, errors)
  }

  if (childHasDisability === 'true') {
    check('child.requiresConstantCare')(fields, values, errors)
  }

  if (requiresConstantCare === 'true') {
    check('child.constantCareUnderSix')(fields, values, errors)
  }

  if (childrenAges && childrenAges.length && parseInt(childrenAges[0], 10) < 5) {
    check('child.attendECE')(fields, values, errors)
  }

  if (attendsECE === 'true') {
    check('child.WeeklyECEHours')(fields, values, errors)
  }

  // Your relationship to your children

  // Work/Study

  // Income

  // Accomodation

  if (isNZResident === 'true') {
    check('applicant.hasAccommodationCosts')(fields, values, errors)
  }

  if (hasAccommodationCosts === 'true') {
    check('applicant.hasSocialHousing')(fields, values, errors)
    check('applicant.receivesAccommodationSupport')(fields, values, errors)
    check('threshold.income.AccommodationSupplement')(fields, values, errors)
  }

  return errors
}

export default validate
