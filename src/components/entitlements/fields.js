import makeMandatoryLabel from 'components/form/hoc/make-mandatory-label'
import renderField from 'components/form/fields/render-field'
import renderRadioGroup from 'components/form/fields/render-radio-group'
import renderSelect from 'components/form/fields/render-select'
import renderCheckboxGroup from 'components/form/fields/render-checkbox-group'

const required = value =>
  (
    typeof value === 'undefined' ||
    value === null ||
    (value.trim && value.trim() === '') ||
    (Array.isArray(value) && !value.length)
  ) ? `This is a required field, please provide an answer.` : undefined

const number = value => value && isNaN(Number(value)) ? `This is not a valid number, please try again.` : undefined

const maxLength = (max) => (value) => {
  return value.length <= max ? value : value.substring(0, max)
}

const booleanOptions = [
  { value: 'true', display: 'Yes'},
  { value: 'false', display: 'No'}
]

const relationshipOptions = [
  { value: 'notsingle', display: 'Yes'}, // not actually used but must not be ''
  { value: 'single', display: 'No'}
]

const employmentOptions = [
  { value: 'full-time', display: 'Yes'},
  { value: 'notfulltime', display: 'No'}  // not actually used but must not be ''
]

const numberOfChildren = [
  { value: '0', display: '0'},
  { value: '1', display: '1'},
  { value: '2', display: '2'},
  { value: '3', display: '3'},
  { value: '4', display: '4'},
  { value: '5', display: '5'},
  { value: '6', display: '6'},
  { value: '7', display: '7'},
  { value: '8', display: '8'},
  { value: '9', display: '9'},
  { value: '10', display: '10'},
  { value: '11', display: '11'},
  { value: '12', display: '12'},
  { value: '13', display: '13'},
  { value: '14', display: '14'},
  { value: '15', display: '15'},
  { value: '16', display: '16'}
]

const ageGroups = [
  { value: '0', display: 'under 1 year'},
  { value: '4', display: '1 to 4 years'},
  { value: '13', display: '5 to 13 years'},
  { value: '15', display: '14 to 15 years'},
  { value: '18', display: '16 to 18 years'}
]

const birthParents = [
  { value: 'family-breakdown', display: 'There was a family breakdown'},
  { value: 'not-found', display: 'They can’t be found'},
  { value: 'in-prison', display: 'They’re in prison'},
  { value: 'died', display: 'They died'},
  { value: 'other', display: 'Other'}
]

const workOrStudyOptions = [
  { value: 'work', display: 'I work'},
  { value: 'study', display: 'I study'},
  { value: 'both', display: 'I work and study'},
  { value: 'neither', display: 'I don’t work or study'}
]

export const fields = {
  'applicant.isNZResident': {
    name: 'applicant.isNZResident',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Are you a New Zealand citizen or resident?`),
    validate: [required],
    options: booleanOptions
  },

  'applicant.normallyLivesInNZ': {
    name: 'applicant.normallyLivesInNZ',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Do you normally live in New Zealand?`),
    validate: [required],
    options: booleanOptions
  },

  'applicant.Age': {
    name: 'applicant.Age',
    component: renderField,
    type: 'number',
    placeholder: 'e.g. 18',
    label: makeMandatoryLabel(`How old are you?`),
    validate: [required, number],
    normalize: maxLength(3)
  },

  'applicant.hasDisability': { // TODO confirm name for this atom
    name: 'applicant.hasDisability',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Do you have a health condition, injury or disability?`),
    validate: [required],
    options: booleanOptions
  },

  'applicant.hasSeriousDisability': {
    name: 'applicant.hasSeriousDisability',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Is your health condition, injury or disability permanent or severe?`),
    validate: [required],
    options: booleanOptions
  },

  'applicant.relationshipStatus': { // TODO change to hasPartner?
    name: 'applicant.relationshipStatus',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Do you have a partner?`),
    validate: [required],
    options: relationshipOptions
  },

  'applicant.isInadequatelySupportedByPartner': {
    name: 'applicant.isInadequatelySupportedByPartner',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Are you living apart from, or lost the financial support of your partner?`),
    validate: [required],
    options: booleanOptions
  },

  'applicant.expectingChild': { // TODO confirm name for this atom
    name: 'applicant.expectingChild',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Are you expecting a baby or planning to adopt a child?`),
    validate: [required],
    options: booleanOptions
  },

  'applicant.numberOfChildren': {
    name: 'applicant.numberOfChildren',
    component: renderSelect,
    label: makeMandatoryLabel(`How many dependant children do you have in your care?`),
    options: numberOfChildren,
    validate: [required],
  },

  'applicant.needsDomesticSupport﻿': {
    name: 'applicant.needsDomesticSupport﻿',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Are any of your children twins, triplets etc?`),
    validate: [required],
    options: booleanOptions
  },

  'children.ages': {
    name: 'children.ages',
    component: renderCheckboxGroup,
    label: makeMandatoryLabel(`Please select the age groups for all your children`),
    instructionText: `You can select more than one`,
    options: ageGroups,
    validate: [required]
  },

  'children.financiallyIndependant': {
    name: 'children.financiallyIndependant',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Are any of your children aged 16 and over financially independent?`),
    validate: [required],
    options: booleanOptions
  },

  'child.hasSeriousDisability': {
    name: 'child.hasSeriousDisability',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Do any of your children have a disability?`),
    validate: [required],
    options: booleanOptions
  },

  'child.requiresConstantCare': {
    name: 'child.requiresConstantCare',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Do any of those children require constant care and attention?`),
    validate: [required],
    options: booleanOptions
  },

  'child.constantCareUnderSix': {
    name: 'child.constantCareUnderSix',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Are they under 6?`),
    validate: [required],
    options: booleanOptions
  },

  'child.attendsECE': {
    name: 'child.attendsECE',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Do any of your children go to an approved early childhood program?`),
    validate: [required],
    options: booleanOptions
  },

  'child.WeeklyECEHours': {
    name: 'child.WeeklyECEHours',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Do they go for 3 or more hours a week?`),
    validate: [required],
    options: booleanOptions
  },

  'applicant.isPrincipalCarer': {
    name: 'applicant.isPrincipalCarer',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Are you the primary carer for all of your children?`),
    validate: [required],
    options: booleanOptions
  },

  'applicant.allChildrenInTheirFullTimeCare': {
    name: 'applicant.allChildrenInTheirFullTimeCare',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Are all of your children in your custody full-time?`),
    validate: [required],
    options: booleanOptions
  },

  'applicant.isPrincipalCarerForProportion': {
    name: 'applicant.isPrincipalCarerForProportion',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Are any of your children in your custody for more than 5 days every 2 weeks?`),
    validate: [required],
    options: booleanOptions
  },

  'applicant.gaveBirthToThisChild': { // TODO this needs to map to more than one atom???
    name: 'applicant.gaveBirthToThisChild',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Are you the birth/adoptive/step parent of all of your children?`),
    validate: [required],
    options: booleanOptions
  },

  'applicant.isPrincipalCarerForOneYearFromApplicationDate': {
    name: 'applicant.isPrincipalCarerForOneYearFromApplicationDate',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Will the children you’re not the birth/adoptive/step parent of be staying in your care for more than 12 months?`),
    validate: [required],
    options: booleanOptions
  },

  'children.birthParents': {
    name: 'children.birthParents',
    component: renderCheckboxGroup,
    label: makeMandatoryLabel(`What happened to the birth parents of the child/children you’re caring for?`),
    instructionText: `You can select more than one`,
    options: birthParents,
    validate: [required]
  },

  'applicant.workOrStudy': {
    name: 'applicant.workOrStudy',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`What's your work/study situation?`),
    validate: [required],
    options: workOrStudyOptions
  },

  'applicant.isStudyingFullTime': {
    name: 'applicant.isStudyingFullTime',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Do you study full-time?`),
    validate: [required],
    options: booleanOptions
  },

  'applicant.employmentStatus': { // TODO change to a boolean?
    name: 'applicant.employmentStatus',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Do you work full-time?`),
    validate: [required],
    options: employmentOptions
  },

  'applicant.worksWeeklyHours': {
    name: 'applicant.worksWeeklyHours',
    component: renderField,
    type: 'number',
    placeholder: 'e.g. 40',
    label: makeMandatoryLabel(`How many hours a week do you work?`),
    validate: [required, number],
    normalize: maxLength(3)
  },

  'applicant.meetsPaidParentalLeaveEmployedRequirements': {
    name: 'applicant.meetsPaidParentalLeaveEmployedRequirements',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Have you worked an average of 10 hours a week for at least 6 months out of the last year?`),
    validate: [required],
    options: booleanOptions
  },

  // TODO change up the components for these income fields
  'income.applicant': {
    name: 'income.applicant',
    component: renderField,
    type: 'number',
    label: makeMandatoryLabel(`What’s your current gross income?`),
    validate: [required, number],
    normalize: maxLength(8)
  },

  // TODO change up the components for these income fields
  'income.spouse': {
    name: 'income.spouse',
    component: renderField,
    type: 'number',
    label: makeMandatoryLabel(`What’s your partner’s current gross income?`),
    validate: [required, number],
    normalize: maxLength(8)
  },

  'applicant.receivesIncomeTestedBenefit': {
    name: 'applicant.receivesIncomeTestedBenefit',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Do you currently get any money from an income-tested benefit or payment?`),
    validate: [required],
    options: booleanOptions
  },

  'applicant.holdsCommunityServicesCard': {
    name: 'applicant.holdsCommunityServicesCard',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Do you have a Community Services Card?`),
    validate: [required],
    options: booleanOptions
  },

  'applicant.hasAccommodationCosts': {
    name: 'applicant.hasAccommodationCosts',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Do you have accomodation costs?`),
    validate: [required],
    options: booleanOptions
  },

  'applicant.hasSocialHousing': {
    name: 'applicant.hasSocialHousing',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Do you pay rent to a social housing provider?`),
    validate: [required],
    options: booleanOptions
  },

  'applicant.receivesAccommodationSupport': {
    name: 'applicant.receivesAccommodationSupport',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Do you receive any accommodation support, including from a spouse, from contracted carer or disability services or from any other source?`),
    validate: [required],
    options: booleanOptions
  }
}

export default fields
