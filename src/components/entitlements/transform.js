import deepMap from 'deep-map'
import get from 'lodash/get'
import set from 'lodash/set'
import unset from 'lodash/unset'

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
  // 3.c. infer child.isDependent and applicant.isMaintainingChild from numberOfChildren
  if (data.applicant && data.applicant.numberOfChildren && data.applicant.numberOfChildren !== 0) {
    set(body, 'child.isDependent', true)
    set(body, 'applicant.isMaintainingChild', true)
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
  // 3.g. change WeeklyECEHours to a number
  // this is a fudge, the number just needs to be above 3 right now
  if (body.child && body.child.WeeklyECEHours) {
    set(body, 'child.WeeklyECEHours', 10)
  }
  // 3.h. infer parents.areUnableToProvideSufficientCare
  if (data.children && data.children.birthParents) {
    if (
      data.children.birthParents.indexOf('family-breakdown') > -1 ||
      data.children.birthParents.indexOf('in-prison') > -1
    ) {
      set(body, 'parents.areUnableToProvideSufficientCare', true)
    }
  }
  // 3.i. infer parents.areDeceasedMissingOrIncapableThroughDisability
  if (data.children && data.children.birthParents) {
    if (
      data.children.birthParents.indexOf('not-found') > -1 ||
      data.children.birthParents.indexOf('died') > -1
    ) {
      set(body, 'parents.areDeceasedMissingOrIncapableThroughDisability', true)
    }
  }
  // 3.j. note that we DON'T send income.ofApplicantAndSpouse directly: instead we
  // infer threshold.income.AccommodationSupplement based on income values
  // TODO calculate here! for now just hard code to true
  // TODO calculate if we meet other thresholds
  // TODO only use spouse income if applicant.relationshipStatus !== 'single'
  set(body, 'threshold.income.AccommodationSupplement', true)
  // 3.k. we don't provide any cash threshold values, so just set them to true
  set(body, 'threshold.cash.AccommodationSupplement', true)
  set(body, 'threshold.cash.HomeHelp', true)
  // 3.l. we don't ask about medical certs, so hard code them to true
  set(body, 'applicant.hasMedicalCertificate', true)
  set(body, 'child.hasMedicalCertification', true)
  // 3.m. we don't ask about the applicant having recieved parental leave in the past, hard code to false
  set(body, 'applicant.hasReceivedPaidParentalLeavePayment', false)
  // 3.n. if applicant answered yes to gaveBirthToThisChild set isParent to true also
  if (data.applicant && data.applicant.gaveBirthToThisChild) {
    set(body, 'applicant.isParent', true)
  }
  // 3.o. we don't ask about preparing for employment (for jobseekers) so hardcode to true
  set(body, 'recipient.prepareForEmployment', true)
  // 3.p. combine weekly hours into couple.worksWeeklyHours if applicant.relationshipStatus !== 'single'
  // TODO combine weekly hours into couple.worksWeeklyHours
  // 3.q. infer applicant.receivesAccommodationSupport is true if they are a full time student
  if (data.applicant && data.applicant.isStudyingFullTime) {
    set(body, 'applicant.receivesAccommodationSupport', true)
  }
  // 3.u. applicant.isPrincipalCarerForProportion needs to be expressed as a number
  if (data.applicant && data.applicant.isPrincipalCarerForProportion) {
    set(body, 'applicant.isPrincipalCarerForProportion', 33)
  }


  // 4.
  // 4.a. isInadequatelySupportedByPartner and partner.worksWeeklyHours
  if (data.applicant && data.applicant.relationshipStatus === 'single') {
    unset(body, 'applicant.isInadequatelySupportedByPartner')
    unset(body, 'partner.worksWeeklyHours')
  }
  // 4.b. needsDomesticSupport
  if (data.applicant && data.applicant.numberOfChildren && data.applicant.numberOfChildren < 3) {
    unset(body, 'applicant.needsDomesticSupport')
  }
  // 4.c. financiallyIndependant
  if (data.children && data.children.ages && data.children.ages.length && data.children.ages[data.children.ages.length - 1] < 16) {
    unset(body, 'children.financiallyIndependant')
  }
  // 4.d. requiresConstantCare
  if (data.child && !data.child.hasSeriousDisability) {
    unset(body, 'child.requiresConstantCare')
  }
  // 4.e. WeeklyECEHours
  if (data.child && !data.child.attendsECE) {
    unset(body, 'child.WeeklyECEHours')
  }
  // 4.f. isPrincipalCarerForProportion
  if (data.applicant && data.applicant.allChildrenInTheirFullTimeCare) {
    unset(body, 'applicant.isPrincipalCarerForProportion')
  }
  // 4.g. isPrincipalCarerForOneYearFromApplicationDate and parents
  if (data.applicant && data.applicant.gaveBirthToThisChild) {
    unset(body, 'applicant.isPrincipalCarerForOneYearFromApplicationDate')
    unset(body, 'parents.areUnableToProvideSufficientCare')
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
  // 4.l. isStoppingWorkToCareForChild
  if (
      (data.applicant && (data.applicant.workOrStudy === 'study' || data.applicant.workOrStudy === 'neither')) ||
      (data.applicant && data.applicant.relationshipStatus === 'single')
    ) {
    unset(body, 'applicant.isStoppingWorkToCareForChild')
  }
  // 4.m. hasSocialHousing
  if (data.applicant && !data.applicant.hasAccommodationCosts) {
    unset(body, 'applicant.hasSocialHousing')
  }
  // 4.n. delete any empty objects (there should always be something in applicant)
  if (body.parents && Object.keys(body.parents).length === 0) {
    unset(body, 'parents')
  }
  if (body.child && Object.keys(body.child).length === 0) {
    unset(body, 'child')
  }
  if (body.children && Object.keys(body.children).length === 0) {
    unset(body, 'children')
  }
  if (body.threshold && Object.keys(body.threshold).length === 0) {
    unset(body, 'threshold')
  }
  if (body.partner && Object.keys(body.partner).length === 0) {
    unset(body, 'partner')
  }

  return body
}

export default transform
