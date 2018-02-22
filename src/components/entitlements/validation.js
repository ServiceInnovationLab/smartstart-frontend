import get from 'lodash/get'
import check from 'components/form/get-validation'
import fields from './fields'

const validate = (values) => {
  const errors = {}

  // set up values that need to be used for conditions
  const isNZResident = get(values, 'applicant.isNZResident')
  const relationshipStatus = get(values, 'applicant.relationshipStatus')
  const isInadequatelySupportedByPartner = get(values, 'applicant.isInadequatelySupportedByPartner')
  const childrenAmount = get(values, 'applicant.numberOfChildren')
  const numberOfChildren = childrenAmount ? parseInt(childrenAmount, 10) : 0
  const childrenAges = get(values, 'children.ages')
  const childHasDisability = get(values, 'child.hasSeriousDisability')
  const requiresConstantCare = get(values, 'child.requiresConstantCareAndAttention')
  const attendsECE = get(values, 'child.attendsECE')
  const hasAccommodationCosts = get(values, 'applicant.hasAccommodationCosts')
  const allChildrenInTheirFullTimeCare = get(values, 'applicant.allChildrenInTheirFullTimeCare')
  const gaveBirthToThisChild = get(values, 'applicant.gaveBirthToThisChild')
  const isPrincipalCarerForOneYearFromApplicationDate = get(values, 'applicant.isPrincipalCarerForOneYearFromApplicationDate')
  const workOrStudy = get(values, 'applicant.workOrStudy')
  const expectingChild = get(values, 'applicant.expectingChild')
  const doesPartnerWork = get(values, 'applicant.doesPartnerWork')

  // Your background

  check('applicant.isNZResident')(fields, values, errors)

  if (isNZResident === 'true') {
    check('applicant.normallyLivesInNZ')(fields, values, errors)
    check('applicant.Age')(fields, values, errors)
    check('applicant.relationshipStatus')(fields, values, errors)
    check('applicant.hasSeriousDisability')(fields, values, errors)
  }

  if (relationshipStatus !== 'single') {
    check('applicant.isInadequatelySupportedByPartner')(fields, values, errors)
  }

  // Your children

  if (isNZResident === 'true') {
    check('applicant.expectingChild')(fields, values, errors)
    check('applicant.numberOfChildren')(fields, values, errors)
  }

  if (numberOfChildren > 2) {
    check('applicant.needsDomesticSupport﻿')(fields, values, errors)
  }

  if (numberOfChildren > 0) {
    check('children.ages﻿')(fields, values, errors)
    check('child.hasSeriousDisability')(fields, values, errors)
  }

  if (childrenAges && childrenAges.length && parseInt(childrenAges[0], 10) === 18) {
    check('children.financiallyIndependant')(fields, values, errors)
  }

  if (childHasDisability === 'true') {
    check('child.requiresConstantCareAndAttention')(fields, values, errors)
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

  if (numberOfChildren > 0) {
    check('applicant.isPrincipalCarer')(fields, values, errors)
    check('applicant.allChildrenInTheirFullTimeCare')(fields, values, errors)
    check('applicant.gaveBirthToThisChild')(fields, values, errors)
  }

  if (allChildrenInTheirFullTimeCare === 'false') {
    check('applicant.isPrincipalCarerForProportion')(fields, values, errors)
  }

  if (gaveBirthToThisChild === 'false') {
    check('applicant.isPrincipalCarerForOneYearFromApplicationDate')(fields, values, errors)
  }

  if (isPrincipalCarerForOneYearFromApplicationDate === 'true') {
    check('children.birthParents')(fields, values, errors)
  }

  // Work/Study

  if (isNZResident === 'true') {
    check('applicant.workOrStudy')(fields, values, errors)
  }

  if (workOrStudy === 'study' || workOrStudy === 'both') {
    check('applicant.isStudyingFullTime')(fields, values, errors)
  }

  if (workOrStudy === 'work' || workOrStudy === 'both') {
    check('applicant.employmentStatus')(fields, values, errors)
    check('applicant.worksWeeklyHours')(fields, values, errors)
  }

  if (expectingChild === 'true') {
    check('applicant.meetsPaidParentalLeaveEmployedRequirements')(fields, values, errors)
  }

  if (relationshipStatus !== 'single' && isInadequatelySupportedByPartner !== 'true') {
    check('applicant.doesPartnerWork')(fields, values, errors)
  }

  if (doesPartnerWork === 'true') {
    check('partner.worksWeeklyHours')(fields, values, errors)
  }

  if (expectingChild === 'true' && (workOrStudy === 'work' || workOrStudy === 'both' || doesPartnerWork === 'true')) {
    check('applicant.isStoppingWorkToCareForChild')(fields, values, errors)
  }

  // Income

  if (isNZResident === 'true') {
    check('income.applicant')(fields, values, errors)
    check('applicant.receivesIncomeTestedBenefit')(fields, values, errors)
    check('applicant.holdsCommunityServicesCard')(fields, values, errors)
  }

  if (relationshipStatus !== 'single' && isInadequatelySupportedByPartner !== 'true') {
    check('income.spouse')(fields, values, errors)
  }

  // Accomodation

  if (isNZResident === 'true') {
    check('applicant.hasAccommodationCosts')(fields, values, errors)
  }

  if (hasAccommodationCosts === 'true') {
    check('applicant.hasSocialHousing')(fields, values, errors)
  }

  return errors
}

export default validate
