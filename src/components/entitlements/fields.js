import React from 'react'
import makeMandatoryLabel, { makeMandatoryAriaLabel } from 'components/form/hoc/make-mandatory-label'
import renderField from 'components/form/fields/render-field'
import renderRadioGroup from 'components/form/fields/render-radio-group'

export const required = value =>
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
  'general.age': {
    name: 'general.age',
    component: renderField,
    type: 'text',
    placeholder: 'e.g. 18',
    label: makeMandatoryLabel(`What is your age?`),
    instructionText: `Some instruction text`,
    validate: [required, number],
    normalize: maxLength(75)
  },

  'general.isNZResident': {
    name: 'general.isNZResident',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Are you a New Zealand resident?`),
    validate: [required],
    options: booleanOptions
  }
}

export default fields
