import makeMandatoryLabel from 'components/form/hoc/make-mandatory-label'
import renderField from 'components/form/fields/render-field'
import renderRadioGroup from 'components/form/fields/render-radio-group'

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

export const fields = {
  'applicant.isNZResident': {
    name: 'applicant.isNZResident',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Are you a New Zealand citizen or resident?`),
    instructionText: `For at least X years`,
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

  'applicant.age': {
    name: 'applicant.age',
    component: renderField,
    type: 'number',
    placeholder: 'e.g. 18',
    label: makeMandatoryLabel(`How old are you?`),
    validate: [required, number],
    normalize: maxLength(3)
  }
}

export default fields
