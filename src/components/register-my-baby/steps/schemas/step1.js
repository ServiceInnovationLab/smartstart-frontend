import React from 'react'
import makeMandatoryLabel, { makeMandatoryAriaLabel } from '../../hoc/make-mandatory-label'
import renderField from '../../fields/render-field'
import renderCustomSelect from '../../fields/render-custom-select'
import renderDatepicker from '../../fields/render-datepicker'
import renderBirthOrderSelector from '../../fields/render-birth-order-selector'
import renderCheckboxGroup from '../../fields/render-checkbox-group'
import renderRadioGroup from '../../fields/render-radio-group'
import renderPlacesAutocomplete from '../../fields/render-places-autocomplete'
import { combine, maxLength, titleCase } from '../../normalize'
import {
  ethnicGroups as ethnicGroupOptions,
  yesNo as yesNoOptions,
  yesNoNotSure as yesNoNotSureOptions,
  sexes as sexOptions,
  birthPlaceCategories as birthPlaceCategoryOptions
} from '../../options'
import {
  required,
  requiredWithMessage,
  validAlpha,
  validDate,
  validCharStrict
} from '../../validate'
import {
  REQUIRE_MESSAGE_CHILD_NAME,
  REQUIRE_MESSAGE_STREET,
  REQUIRE_MESSAGE_POSTCODE
} from '../../validation-messages'

const renderHospitalOption = option =>
  <div>{option.name}, {option.location}</div>

const requireHandler = () => {
  throw new Error('REQUIRE_A_HANDLER_FUNCTION')
}

export const fields = {
  'child.firstNames': {
    name: 'child.firstNames',
    component: renderField,
    type: 'text',
    placeholder: 'e.g. Jane Mary',
    label: makeMandatoryLabel('Child\'s given name(s)'),
    instructionText: 'Enter the child\'s first name(s) and any middle names. The child\'s names will appear on the birth certificate in the order that you enter them here.',
    validate: [requiredWithMessage(REQUIRE_MESSAGE_CHILD_NAME), validAlpha],
    normalize: maxLength(75)
  },

  'child.surname': {
    name: 'child.surname',
    component: renderField,
    type: 'text',
    placeholder: 'e.g. Smith',
    label: makeMandatoryLabel('Child\'s surname'),
    instructionText: 'Enter the child\'s surname or family name(s).',
    validate: [requiredWithMessage(REQUIRE_MESSAGE_CHILD_NAME), validAlpha],
    normalize: maxLength(75)
  },

  'child.sex': {
    name: 'child.sex',
    component: renderRadioGroup,
    label: makeMandatoryLabel('Child\'s sex'),
    validate: [required],
    options: sexOptions
  },

  'child.aliveAtBirth': {
    name: 'child.aliveAtBirth',
    component: renderRadioGroup,
    label: makeMandatoryLabel('Was this child alive at birth?'),
    validate: [required],
    options: yesNoOptions
  },

  'child.birthDate': {
    name: 'child.birthDate',
    component: renderDatepicker,
    label: makeMandatoryLabel('Child\'s date of birth'),
    validate: [required, validDate]
  },

  'child.oneOfMultiple': {
    name: 'child.oneOfMultiple',
    component: renderRadioGroup,
    label: makeMandatoryLabel('Is this child one of multiple birth of twins, triplets, etc?'),
    options: yesNoOptions,
    onChange: requireHandler,
    validate: [required]
  },

  'child.multipleBirthOrder': {
    name: 'child.multipleBirthOrder',
    component: renderBirthOrderSelector,
    label: makeMandatoryLabel('What is the birth order for this child?'),
    instructionText: 'Enter the birth order number of the child you are registering first, followed by the number of children in the multiple birth e.g. if the child was the second twin born select \'2 of 2\'.',
    validate: [required]
  },

  'birthPlace.category': {
    name: 'birthPlace.category',
    component: renderRadioGroup,
    label: makeMandatoryLabel('Where was the child born?'),
    options: birthPlaceCategoryOptions,
    onChange: requireHandler,
    validate: [required]
  },

  'birthPlace.hospital': {
    name: 'birthPlace.hospital',
    component: renderCustomSelect,
    options: [],
    valueKey: 'identifier',
    labelKey: 'name',
    placeholder: 'Please select ...',
    optionRenderer: renderHospitalOption,
    valueRenderer: renderHospitalOption,
    searchable: true,
    label: makeMandatoryLabel('Hospital name'),
    validate: [required]
  },

  'birthPlace.home.line1': {
    name: 'birthPlace.home.line1',
    component: renderPlacesAutocomplete,
    type: 'text',
    label: makeMandatoryLabel('Street number and Street name'),
    instructionText: 'Begin typing your address, and select it from the options that appear. If required you can edit the address after you\'ve picked one.',
    onPlaceSelect: requireHandler,
    normalize: combine(maxLength(33), titleCase),
    validate: [requiredWithMessage(REQUIRE_MESSAGE_STREET), validCharStrict]
  },

  'birthPlace.home.suburb': {
    name: 'birthPlace.home.suburb',
    component: renderField,
    type: 'text',
    label: 'Suburb',
    normalize: combine(maxLength(20), titleCase),
    validate: [required, validCharStrict]
  },

  'birthPlace.home.line2': {
    name: 'birthPlace.home.line2',
    component: renderField,
    type: 'text',
    label: makeMandatoryLabel('Town/City and Postcode'),
    validate: [requiredWithMessage(REQUIRE_MESSAGE_POSTCODE), validCharStrict],
    normalize: combine(maxLength(20), titleCase)
  },

  'birthPlace.other': {
    name: 'birthPlace.other',
    component: renderField,
    type: 'text',
    instructionText: 'Describe where you gave birth, and name the hospital you eventually went to for treatment (if applicable).',
    placeholder: 'e.g. In Ambulance On The Way To Auckland Hospital',
    ariaLabel: makeMandatoryAriaLabel('State other birth place'),
    validate: [required, validCharStrict],
    normalize: maxLength(75)
  },

  'child.maoriDescendant': {
    name: 'child.maoriDescendant',
    component: renderRadioGroup,
    label: makeMandatoryLabel('Is this child the descendant of a New Zealand Māori?'),
    instructionText: 'This information won\'t be printed on the birth certificate; it\'s just for statistical purposes.',
    options: yesNoNotSureOptions,
    validate: [required]
  },

  'child.ethnicGroups': {
    name: 'child.ethnicGroups',
    component: renderCheckboxGroup,
    label: makeMandatoryLabel('Which ethnic group or groups does this child belong to?'),
    instructionText: 'Select as many boxes as you\'d like to describe your child\'s ethnicity.',
    options: ethnicGroupOptions,
    onChange: requireHandler,
    validate: [required]
  },

  'child.ethnicityDescription': {
    name: 'child.ethnicityDescription',
    component: renderField,
    type: 'text',
    ariaLabel: makeMandatoryAriaLabel('Please describe the child\'s ethnicity.'),
    instructionText: 'Please describe the child\’s ethnicity. This information helps other government agencies to get a clearer picture of our society so that health, education and other needs in your area can be planned for.',
    placeholder: 'e.g. South African Thai',
    validate: [required, validCharStrict],
    normalize: maxLength(30)
  }
}

export default fields
