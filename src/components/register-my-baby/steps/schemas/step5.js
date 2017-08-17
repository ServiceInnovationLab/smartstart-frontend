import React from 'react'
import makeMandatoryLabel from '../../hoc/make-mandatory-label'
import renderField from '../../fields/render-field'
import renderSelect from '../../fields/render-select'
import renderCheckbox from '../../fields/render-checkbox'
import renderRadioGroup from '../../fields/render-radio-group'
import FatherText from './father-text'
import {
  yesNo as yesNoOptions
} from '../../options'
import { required, requiredWithMessage, validIrd, validMsd } from '../../validate'
import { maximum } from '../../normalize'
import {
  REQUIRE_IRD_ADDRESS
} from '../../validation-messages'

const fields = {
  'ird.applyForNumber': {
    name: "ird.applyForNumber",
    component: renderRadioGroup,
    label: makeMandatoryLabel("Do you wish to apply for an IRD number for your child?"),
    options: yesNoOptions,
    validate: [required],
  },
  'ird.deliveryAddress': {
    name: "ird.deliveryAddress",
    component: renderSelect,
    options: [],
    label: makeMandatoryLabel("Please choose an address IR should post your child's IRD number to"),
    validate: [requiredWithMessage(REQUIRE_IRD_ADDRESS)],
  },
  'ird.numberByEmail': {
    name: "ird.numberByEmail",
    component: renderRadioGroup,
    label: makeMandatoryLabel("Do you also wish to receive your child's IRD number by email?"),
    options: yesNoOptions,
    validate: [required],
  },
  'ird.taxCreditIRDNumber': {
    name: "ird.taxCreditIRDNumber",
    component: renderField,
    type: "text",
    instructionText: "This will allow Inland Revenue to add the child's IRD number to your Working for Families details.",
    label: "If you have applied for Working for Families Tax Credits for this child please provide your IRD number",
    validate: [validIrd],
    normalize: maximum(999999999),
  },
  'msd.notify': {
    name: "msd.notify",
    label: "I give permission for Births, Deaths and Marriages to notify the Ministry of Social Development of the birth of my child.",
    component: renderCheckbox,
  },
  'msd.mothersClientNumber': {
    name: "msd.mothersClientNumber",
    component: renderField,
    type: "text",
    label: "Mother's MSD client number",
    instructionText: "Please provide the MSD client number for at least one parent",
    validate: [validMsd],
    normalize: maximum(999999999),
  },
  'msd.fathersClientNumber': {
    name: "msd.fathersClientNumber",
    component: renderField,
    type: "text",
    label: <span><FatherText capitalize />'s MSD client number</span>,
    instructionText: "Please provide the MSD client number for at least one parent",
    validate: [validMsd],
    normalize: maximum(999999999),
  }
}

export default fields
