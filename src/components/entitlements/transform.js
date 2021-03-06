import deepMap from 'deep-map'
import get from 'lodash/get'
import set from 'lodash/set'
import unset from 'lodash/unset'
import {
  ChildCareSubsidy,
  isCommunityServicesCard,
  JobSeekerSupport,
  SoleParentSupport,
  AccommodationSupplement,
  workingForFamiliesMinTaxCredit,
  WorkingForFamiliesInWorkTaxCredit,
  WorkingForFamiliesFamilyTaxCredit,
  workingForFamiliesParentalTaxCredit,
  SupportedLivingPayment,
  YoungParentPayment
} from './thresholds'

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

const annualIncome = (incomeAndFrequency) => {
  if (!incomeAndFrequency) return 0

  let income = incomeAndFrequency[0]
  let frequency = incomeAndFrequency[1]

  switch (frequency) {
    case 'weekly':
      return income * 52
    case 'fortnightly':
      return income * 26
    case 'monthly':
      return income * 12
    case 'annually':
      return income
    default:
      return 0
  }
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
  // 3.e. infer children.allFinanciallyIndependent
  if (data.children && data.children.ages && data.children.ages.length && data.children.ages[0] > 15) {
    // ^ all of the children are 16 or older (first element in array is the youngest child)
    if (data.children.financiallyIndependant) {
      set(body, 'children.allFinanciallyIndependent', true)
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
  // 3.i. infer parents.areDeceasedMissingOrIncapable
  if (data.children && data.children.birthParents) {
    if (
      data.children.birthParents.indexOf('not-found') > -1 ||
      data.children.birthParents.indexOf('died') > -1
    ) {
      set(body, 'parents.areDeceasedMissingOrIncapable', true)
    }
  }
  // 3.j. note that we DON'T send income.ofApplicantAndSpouse directly: instead we
  // infer thresholds based on income values
  let combinedIncome = 0
  if (data.income && data.applicant) {
    if (data.applicant.relationshipStatus === 'single' || data.applicant.isInadequatelySupportedByPartner) {
      combinedIncome = annualIncome(data.income.applicant)
    } else {
      // if they have a partner it's required to provide their income
      combinedIncome = annualIncome(data.income.applicant) + annualIncome(data.income.spouse)
    }
  }
  set(body, 'threshold.income.ChildCareSubsidy', ChildCareSubsidy(combinedIncome, data.applicant.numberOfChildren))
  set(body, 'threshold.isCommunityServicesCard', isCommunityServicesCard(combinedIncome))
  set(body, 'threshold.income.JobSeekerSupport', JobSeekerSupport(combinedIncome))
  set(body, 'threshold.income.SoleParentSupport', SoleParentSupport(combinedIncome))
  set(body, 'threshold.income.AccommodationSupplement', AccommodationSupplement(combinedIncome))
  set(body, 'threshold.income.workingForFamiliesMinTaxCredit', workingForFamiliesMinTaxCredit(combinedIncome))
  set(body, 'threshold.income.WorkingForFamiliesInWorkTaxCredit', WorkingForFamiliesInWorkTaxCredit(combinedIncome, data.applicant.numberOfChildren))
  set(body, 'threshold.income.WorkingForFamiliesFamilyTaxCredit', WorkingForFamiliesFamilyTaxCredit(combinedIncome, data.applicant.numberOfChildren))
  set(body, 'threshold.income.workingForFamiliesParentalTaxCredit', workingForFamiliesParentalTaxCredit(combinedIncome, data.applicant.numberOfChildren))
  set(body, 'threshold.income.SupportedLivingPayment', SupportedLivingPayment(combinedIncome, data.applicant.relationshipStatus !== 'single'))
  set(body, 'threshold.income.YoungParentPayment', YoungParentPayment(combinedIncome))
  // 3.k. we don't provide any cash threshold values, so just set them to true
  set(body, 'threshold.cash.AccommodationSupplement', true)
  set(body, 'threshold.cash.HomeHelp', true)
  // 3.l. we don't ask about medical certs, so hard code them to true
  set(body, 'applicant.hasMedicalCertificate', true)
  set(body, 'child.hasMedicalCertification', true)
  // 3.m. we don't ask about the applicant having recieved parental leave in the past, hard code to false
  set(body, 'applicant.hasReceivedPaidParentalLeavePayment', false)
  // 3.n. we don't ask about preparing for employment (for jobseekers) so hardcode to true
  set(body, 'recipient.prepareForEmployment', true)
  // 3.o. combine weekly hours into couple.worksWeeklyHours if applicant.relationshipStatus !== 'single'
  // and set default 0 values if not already defined
  if (data.applicant && data.applicant.relationshipStatus !== 'single') {
    if (
      data.applicant.relationshipStatus !== 'single' &&
      typeof data.applicant.worksWeeklyHours !== "undefined" &&
      !data.applicant.isInadequatelySupportedByPartner &&
      data.applicant.doesPartnerWork &&
      data.partner &&
      typeof data.partner.worksWeeklyHours !== "undefined"
    ) {
      set(body, 'couple.worksWeeklyHours', data.applicant.worksWeeklyHours + data.partner.worksWeeklyHours)
    } else if (typeof data.applicant.worksWeeklyHours !== "undefined") {
      set(body, 'couple.worksWeeklyHours', data.applicant.worksWeeklyHours)
    } else if (
      data.applicant.relationshipStatus !== 'single' &&
      !data.applicant.isInadequatelySupportedByPartner &&
      data.applicant.doesPartnerWork &&
      data.partner &&
      typeof data.partner.worksWeeklyHours !== "undefined"
    ) {
      set(body, 'couple.worksWeeklyHours', data.partner.worksWeeklyHours)
    } else {
      set(body, 'applicant.worksWeeklyHours', 0)
      set(body, 'partner.worksWeeklyHours', 0)
      set(body, 'couple.worksWeeklyHours', 0)
    }
  }
  // 3.p. applicant.isPrincipalCarerForProportion needs to be expressed as a number
  if (data.applicant && data.applicant.isPrincipalCarerForProportion) {
    set(body, 'applicant.isPrincipalCarerForProportion', 33)
  } else if (data.applicant && data.applicant.allChildrenInTheirFullTimeCare) {
    set(body, 'applicant.isPrincipalCarerForProportion', 100)
  } else {
    set(body, 'applicant.isPrincipalCarerForProportion', 0)
  }
  // 3.q. assume applicant.IsStudyingFulltimeSecondarySchool is true if they are studying full time
  // this ensures that Student Allowance will come back if the are in the right age range & have partner
  if (data.applicant && data.applicant.isStudyingFullTime) {
    set(body, 'applicant.IsStudyingFulltimeSecondarySchool', true)
  }
  // 3.r. set isStudyingFullTime and employmentStatus to false if don't work or study respectively
  if (data.applicant && (data.applicant.workOrStudy === 'work' || data.applicant.workOrStudy === 'neither')) {
    set(body, 'applicant.isStudyingFullTime', false)
  }
  if (data.applicant && (data.applicant.workOrStudy === 'study' || data.applicant.workOrStudy === 'neither')) {
    set(body, 'applicant.employmentStatus', 'notfulltime')
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
    unset(body, 'child.requiresConstantCareAndAttention')
  }
  // 4.e. WeeklyECEHours
  if (data.child && !data.child.attendsECE) {
    unset(body, 'child.WeeklyECEHours')
  }
  // 4.f. isPrincipalCarerForOneYearFromApplicationDate and parents
  if (data.applicant && data.applicant.isParent) {
    unset(body, 'applicant.isPrincipalCarerForOneYearFromApplicationDate')
    unset(body, 'parents.areUnableToProvideSufficientCare')
    unset(body, 'parents.areDeceasedMissingOrIncapable')
  }
  // 4.g. areUnableToProvideSufficientCare areDeceasedMissingOrIncapableThroughDisability
  if (data.applicant && !data.applicant.isPrincipalCarerForOneYearFromApplicationDate) {
    unset(body, 'parents.areUnableToProvideSufficientCare')
    unset(body, 'parents.areDeceasedMissingOrIncapable')
  }
  // 4.h. worksWeeklyHours
  if (data.applicant && (data.applicant.workOrStudy === 'study' || data.applicant.workOrStudy === 'neither')) {
    unset(body, 'applicant.worksWeeklyHours')
  }
  // 4.i. meetsPaidParentalLeaveEmployedRequirements and isStoppingWorkToCareForChild
  if (data.applicant && !data.applicant.gaveBirthToThisChild) {
    unset(body, 'applicant.meetsPaidParentalLeaveEmployedRequirements')
    unset(body, 'applicant.isStoppingWorkToCareForChild')
  }
  // 4.j. isStoppingWorkToCareForChild if they don't work
  if (
      data.applicant &&
      (data.applicant.workOrStudy === 'study' || data.applicant.workOrStudy === 'neither') &&
      data.applicant.doesPartnerWork !== true
    ) {
    unset(body, 'applicant.isStoppingWorkToCareForChild')
  }
  // 4.k. hasSocialHousing
  if (data.applicant && !data.applicant.hasAccommodationCosts) {
    unset(body, 'applicant.hasSocialHousing')
  }
  // 4.l. isInadequatelySupportedByPartner
  if (data.applicant && data.applicant.isInadequatelySupportedByPartner) {
    unset(body, 'partner.worksWeeklyHours')
  }
  // 4.m. doesPartnerWork
  if (data.applicant && !data.applicant.doesPartnerWork) {
    unset(body, 'partner.worksWeeklyHours')
  }
  // 4.n. numberOfChildren is 0
  if (data.applicant && data.applicant.numberOfChildren === 0) {
    unset(body, 'child.Age')
    unset(body, 'child.isDependent')
    unset(body, 'child.hasSeriousDisability')
    unset(body, 'child.requiresConstantCareAndAttention')
    unset(body, 'child.WeeklyECEHours')
    unset(body, 'children.dependentsUnder14')
    unset(body, 'children.allFinanciallyIndependent')
    unset(body, 'applicant.isParent')
    unset(body, 'applicant.isPrincipalCarer')
    unset(body, 'applicant.isMaintainingChild')
    unset(body, 'applicant.needsDomesticSupport')
    unset(body, 'applicant.allChildrenInTheirFullTimeCare')
    unset(body, 'applicant.isPrincipalCarerForProportion')
    unset(body, 'applicant.isParent')
    unset(body, 'applicant.isPrincipalCarerForOneYearFromApplicationDate')
    unset(body, 'parents.areDeceasedMissingOrIncapable')
    unset(body, 'parents.areUnableToProvideSufficientCare')
  }
  // 4.p. delete any empty objects (there should always be something in applicant)
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
