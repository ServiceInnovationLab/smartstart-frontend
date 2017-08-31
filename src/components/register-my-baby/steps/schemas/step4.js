import React from 'react'
import makeMandatoryLabel from '../../hoc/make-mandatory-label'
import renderField from '../../fields/render-field'
import renderDatepicker from '../../fields/render-datepicker'
import renderRadioGroup from '../../fields/render-radio-group'
import renderSelect from '../../fields/render-select'
import FatherText from './father-text'
import { combine, maxLength, titleCase } from '../../normalize'
import {
  sexes as sexOptions,
  childStatuses as childStatusOptions,
  parentRelationships as parentRelationshipOptions
} from '../../options'
import {
  required,
  validDate,
  validCharStrict
} from '../../validate'

const fields = {
  'otherChildren': {
    name: "otherChildren",
    component: renderSelect,
    options: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    renderEmptyOption: false,
    label: makeMandatoryLabel("Are there other children born from the same parent relationship?"),
    instructionText: <span>Select the number of other children with the same mother and <FatherText />. If this is the first child together then go to the next question</span>,
    validate: [required],
  },
  'siblings[].sex': {
    name: "siblings[].sex",
    component: renderRadioGroup,
    label: makeMandatoryLabel("Sex of child"),
    options: sexOptions,
    validate: [required],
  },
  'siblings[].statusOfChild': {
    name: `siblings[].statusOfChild`,
    component: renderRadioGroup,
    label: makeMandatoryLabel("Is this child alive, since died, or were they stillborn?"),
    options: childStatusOptions,
    validate: [required],
  },
  'siblings[].dateOfBirth': {
    name: `siblings[].dateOfBirth`,
    component: renderDatepicker,
    label: makeMandatoryLabel("What is this child's date of birth?"),
    validate: [required, validDate],
  },
  'parentRelationship': {
    name: "parentRelationship",
    component: renderSelect,
    options: parentRelationshipOptions,
    label: makeMandatoryLabel("What was the parents' relationship with each other at the time of the child's birth?"),
    validate: [required],
  },
  'parentRelationshipDate': {
    name: "parentRelationshipDate",
    component: renderDatepicker,
    label: makeMandatoryLabel("Date of marriage/civil union"),
    validate: [required, validDate],
  },
  'parentRelationshipPlace': {
    name: "parentRelationshipPlace",
    component: renderField,
    type: "text",
    label: makeMandatoryLabel("Place of marriage/civil union"),
    instructionText: "City or town and Country (if ceremony was performed overseas)",
    placeholder: "e.g. Fiji",
    validate: [required, validCharStrict],
    normalize: combine(maxLength(60), titleCase),
  }
}

export default fields

