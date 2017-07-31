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
  maxLength30,
  validAlpha,
  validDate,
  validCharStrict
} from '../../validate'
import {
  REQUIRE_MESSAGE_CHILD_FIRST_NAME,
  REQUIRE_MESSAGE_STREET,
  REQUIRE_MESSAGE_POSTCODE
} from '../../validation-messages'

const renderHospitalOption = option =>
  <div>{option.name}, {option.location}</div>

const requireHandler = () => {
  throw new Error('REQUIRE_A_HANDLER_FUNCTION')
}

const fields = {
  'child.firstNames': {
    name: 'child.firstNames',
    component: renderField,
    type: 'text',
    placeholder: 'First name',
    label: makeMandatoryLabel('Child\'s given name(s)'),
    instructionText: 'Enter the child\'s first name(s) and any middle names. The order you enter the names here is how they will appear on the birth certificate',
    validate: [requiredWithMessage(REQUIRE_MESSAGE_CHILD_FIRST_NAME), validAlpha],
    normalize: maxLength(75)
  },

  'child.surname': {
    name: 'child.surname',
    component: renderField,
    type: 'text',
    placeholder: 'E.g Smith',
    label: makeMandatoryLabel('Child\'s surname'),
    validate: [required, validAlpha],
    normalize: maxLength(75)
  },

  'child.sex': {
    name: 'child.sex',
    component: renderRadioGroup,
    label: makeMandatoryLabel('Child\'s sex'),
    validate: [required],
    options: sexOptions
  },

  'child.stillBorn': {
    name: 'child.aliveAtBirth',
    component: renderRadioGroup,
    label: makeMandatoryLabel('Was this child alive at birth?'),
    validate: [required],
    options: yesNoOptions
  },

  'child.birthDate': {
    name: 'child.birthDate',
    component: renderDatepicker,
    label: makeMandatoryLabel('The child\'s date of birth'),
    validate: [required, validDate]
  },

  'child.oneOfMultiple': {
    name: 'child.oneOfMultiple',
    component: renderRadioGroup,
    label: makeMandatoryLabel('Is this child one of a multiple birth (twins, triplets, etc)'),
    options: yesNoOptions,
    onChange: requireHandler,
    validate: [required]
  },

  'child.multipleBirthOrder': {
    name: 'child.multipleBirthOrder',
    component: renderBirthOrderSelector,
    label: makeMandatoryLabel('What is the birth order for this child?'),
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
    placeholder: 'Please select',
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
    onPlaceSelect: requireHandler,
    normalize: combine(maxLength(33), titleCase),
    validate: [requiredWithMessage(REQUIRE_MESSAGE_STREET)]
  },

  'birthPlace.home.suburb': {
    name: 'birthPlace.home.suburb',
    component: renderField,
    type: 'text',
    label: 'Suburb',
    normalize: combine(maxLength(20), titleCase)
  },

  'birthPlace.home.line2': {
    name: 'birthPlace.home.line2',
    component: renderField,
    type: 'text',
    label: makeMandatoryLabel('Town/City and Postcode'),
    validate: [requiredWithMessage(REQUIRE_MESSAGE_POSTCODE)],
    normalize: combine(maxLength(20), titleCase)
  },

  'birthPlace.other': {
    name: 'birthPlace.other',
    component: renderField,
    type: 'text',
    instructionText: 'Describe the circumstances of the birth. If you went to a hospital please include the name of the hospital.',
    ariaLabel: makeMandatoryAriaLabel('State other birth place'),
    validate: [required, validCharStrict],
    normalize: maxLength(75)
  },

  'child.maoriDescendant': {
    name: 'child.maoriDescendant',
    component: renderRadioGroup,
    label: makeMandatoryLabel('Is this child a descendant of a New Zealand Māori?'),
    instructionText: 'This will not appear on the birth certificate',
    options: yesNoNotSureOptions,
    validate: [required]
  },

  'child.ethnicGroups': {
    name: 'child.ethnicGroups',
    component: renderCheckboxGroup,
    label: makeMandatoryLabel('Which ethnic group(s) does this child belong to?'),
    instructionText: 'Select as many boxes as you wish to describe the ethnic group(s) this child belongs to.',
    options: ethnicGroupOptions,
    onChange: requireHandler,
    validate: [required]
  },

  'child.ethnicityDescription': {
    name: 'child.ethnicityDescription',
    component: renderField,
    type: 'text',
    ariaLabel: makeMandatoryAriaLabel('State other ethnicity'),
    placeholder: 'Please describe the child’s ethnicity',
    validate: [required, maxLength30, validCharStrict]
  }
}

export default fields
