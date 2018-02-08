import deepMap from 'deep-map'
import get from 'lodash/get'
import set from 'lodash/set'
import unset from 'lodash/set'

// 1. change all strings to booleans, numbers etc
// 2. if key is in schema, add to object to be sent
// 3. if key is not is schema, use it to infer keyvalues to send instead
// 4. if object to be sent has keyvalues that shouldn't be sent b/c of other conditions, remove them

const transformType = (value) => {
  if (value === 'true') {
    return true
  } else if (value === 'false') {
    return false
  } else if (!isNaN(parseInt(value, 10))) {
    return parseInt(value, 10)
  }
  return value
}

const transform = (data, schema) => {
  let body = {}

  // 1.
  data = deepMap(data, value => transformType(value))


  // 2.
  schema.forEach(atom => {
    let valueFromForm = get(data, atom.name, null)

    if (valueFromForm !== null) {
      set(body, atom.name, valueFromForm)
    }
  })


  // 3.
  // 3.a. assume normallyLivesInNZ === hasLivedInNZfor2Years
  if (data.applicant && data.applicant.normallyLivesInNZ) {
    set(body, 'applicant.hasLivedInNZfor2Years', true)
  }
  // 3.b. assume applicant.isUnableToSupportThemselves if applicant.hasSeriousDisability
  if (data.applicant && data.applicant.hasSeriousDisability) {
    set(body, 'applicant.isUnableToSupportThemselves', true)
  }
  // 3.c. infer child.isDependent from numberOfChildren
  if (data.applicant && data.applicant.numberOfChildren && data.applicant.numberOfChildren !== '0') {
    set(body, 'child.isDependent', true)
  }
  // 3.d. set child.Age based on the lowest provided value for children.ages
  // and set dependentsUnder14 using the same
  if (data.children && data.children.ages && data.children.ages.length) {
    // first element in the array is the lowest
    set(body, 'child.Age', data.children.ages[0])
    if (data.children.ages[0] < 14) {
      // we don't need to provide the full number of dependents, just need at least 1
      set(body, 'children.dependentsUnder14', 1)
    }
  }
  // 3.e. infer children.overWFFcutoffAgeAndFinanciallyDependant
  if (data.children && data.children.ages && data.children.ages.length && data.children.ages[data.children.ages.length - 1] > 15) {
    if (data.children && !data.children.financiallyIndependant) {
      set(body, 'children.overWFFcutoffAgeAndFinanciallyDependant', true)
    }
  }
  // 3.f. lower child.Age as needed if child.constantCareUnderSix
  // this is a spurious made up value to just get us under the threshold as appropriate
  if (body.child && body.child.Age > 5 && data.child.constantCareUnderSix) {
    set(body, 'child.Age', 5)
  }
  // 3.g. infer parents.areUnableToProvideSufficientCare
  if (data.children && data.children.birthParents) {
    if (
      data.children.birthParents.indexOf('family-breakdown') > -1 ||
      data.children.birthParents.indexOf('in-prison') > -1
    ) {
      set(body, 'parents.areUnableToProvideSufficientCare', true)
    }
  }
  // 3.h. infer parents.areDeceasedMissingOrIncapableThroughDisability
  if (data.children && data.children.birthParents) {
    if (
      data.children.birthParents.indexOf('not-found') > -1 ||
      data.children.birthParents.indexOf('died') > -1
    ) {
      set(body, 'parents.areDeceasedMissingOrIncapableThroughDisability', true)
    }
  }
  // 3.i. note that we DON'T sent income.ofApplicantAndSpouse directly: instead we
  // infer threshold.income.AccommodationSupplement based on income values
  // TODO calculate here! for now just hard code to true
  // TODO calculate if we meet other thresholds
  // TODO only use spouse income if applicant.relationshipStatus !=== 'single'
  set(body, 'threshold.income.AccommodationSupplement', true)
  // 3.j. we don't provide any cash threshold values, so just set them to true
  // TODO any other cash thresholds should be set here
  set(body, 'threshold.cash.AccommodationSupplement', true)
  // 3.k. we don't ask about medical certs, so hard code them to true
  set(body, 'applicant.hasMedicalCertificate', true)
  set(body, 'child.hasMedicalCertification', true)
  // 3.l. we don't ask about the applicant having recieved parental leave in the past, hard code to false
  set(body, 'applicant.hasReceivedPaidParentalLeavePayment', false)


  // 4.
  // 4.a hasDisability
  if (data.applicant && !data.applicant.hasDisability) {
    unset(body, 'applicant.hasSeriousDisability')
  }
  // 4.b. relationshipStatus
  if (data.applicant && data.applicant.relationshipStatus === 'single') {
    unset(body, 'applicant.isInadequatelySupportedByPartner')
  }
  // 4.c. needsDomesticSupport
  if (data.applicant && data.applicant.numberOfChildren && parseInt(data.applicant.numberOfChildren, 10) < 3) {
    unset(body, 'applicant.needsDomesticSupport﻿')
  }
  // 4.d. financiallyIndependant
  if (data.children && data.children.ages && data.children.ages.length && data.children.ages[data.children.ages.length - 1] < 16) {
    unset(body, 'children.financiallyIndependant﻿')
  }
  // 4.e. requiresConstantCare
  if (data.child && !data.child.hasSeriousDisability) {
    unset(body, 'child.requiresConstantCare')
  }
  // 4.f. WeeklyECEHours
  if (data.child && !data.child.attendsECE) {
    unset(body, 'child.WeeklyECEHours')
  }
  // 4.g. isPrincipalCarerForProportion
  if (data.applicant && data.applicant.allChildrenInTheirFullTimeCare) {
    unset(body, 'applicant.isPrincipalCarerForProportion')
  }
  // 4.g. isPrincipalCarerForOneYearFromApplicationDate and parents
  if (data.applicant && data.applicant.gaveBirthToThisChild) {
    unset(body, 'applicant.isPrincipalCarerForOneYearFromApplicationDate')
    unset(body, 'parents.areUnableToProvideSufficientCare﻿')
    unset(body, 'parents.areDeceasedMissingOrIncapableThroughDisability')
  }
  // 4.h. areUnableToProvideSufficientCare areDeceasedMissingOrIncapableThroughDisability
  if (data.applicant && !data.applicant.isPrincipalCarerForOneYearFromApplicationDate) {
    unset(body, 'parents.areUnableToProvideSufficientCare')
    unset(body, 'parents.areDeceasedMissingOrIncapableThroughDisability')
  }
  // 4.i. isStudyingFullTime
  if (data.applicant && (data.applicant.workOrStudy === 'work' || data.applicant.workOrStudy === 'neither')) {
    unset(body, 'applicant.isStudyingFullTime')
  }
  // 4.j. employmentStatus and worksWeeklyHours
  if (data.applicant && (data.applicant.workOrStudy === 'study' || data.applicant.workOrStudy === 'neither')) {
    unset(body, 'applicant.employmentStatus')
    unset(body, 'applicant.worksWeeklyHours')
  }
  // 4.k. meetsPaidParentalLeaveEmployedRequirements
  if (data.applicant && !data.applicant.expectingChild) {
    unset(body, 'applicant.meetsPaidParentalLeaveEmployedRequirements')
  }

  return body
}

export default transform
