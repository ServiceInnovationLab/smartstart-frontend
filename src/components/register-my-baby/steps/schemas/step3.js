import React from 'react'
import makeMandatoryLabel, { makeMandatoryAriaLabel } from '../../hoc/make-mandatory-label'
import renderField from '../../fields/render-field'
import renderDatepicker from '../../fields/render-datepicker'
import renderCheckboxGroup from '../../fields/render-checkbox-group'
import renderRadioGroup from '../../fields/render-radio-group'
import renderPlacesAutocomplete from '../../fields/render-places-autocomplete'
import renderCheckbox from '../../fields/render-checkbox'
import renderWarning from '../../fields/render-warning'
import renderError from '../../fields/render-error'
import renderSelect from '../../fields/render-select'
import FatherText from './father-text'
import { combine, maxLength, titleCase } from '../../normalize'
import {
  ethnicGroups as ethnicGroupOptions,
  yesNo as yesNoOptions,
  yesNoNotSure as yesNoNotSureOptions,
  citizenshipSources as citizenshipSourceOptions
} from '../../options'
import {
  required,
  requiredWithMessage,
  maxLength30,
  validAlpha,
  validDate,
  validCharStrict,
  youngerThan,
  email
} from '../../validate'
import {
  REQUIRE_MESSAGE_STREET,
  REQUIRE_MESSAGE_POSTCODE
} from '../../validation-messages'

const requireHandler = () => {
  throw new Error('REQUIRE_A_HANDLER_FUNCTION')
}

const fields = {
  'assistedHumanReproduction': {
    name: "assistedHumanReproduction",
    component: renderRadioGroup,
    label: makeMandatoryLabel("Is the child born as a result of an assisted human reproduction procedure?"),
    options: yesNoOptions,
    onChange: requireHandler,
    validate: [required],
  },
  'assistedHumanReproductionManConsented': {
    name: "assistedHumanReproductionManConsented",
    label: "The mother is in a relationship with a man who consented to the procedure. Complete the father step with his details.",
    component: renderCheckbox,
    disabled: false,
  },
  'assistedHumanReproductionWomanConsented': {
    name: "assistedHumanReproductionWomanConsented",
    label: "The mother is in a relationship with a woman who consented to the procedure. Complete the other parent step with her details.",
    component: renderCheckbox,
    disabled: false,
  },
  'assistedHumanReproductionSpermDonor': {
    name: "assistedHumanReproductionSpermDonor",
    label: "The mother used a sperm donor without a consenting partner. The father is not known.",
    component: renderCheckbox,
    disabled: false,
  },
  'assistedHumanReproductionError': {
    name: "assistedHumanReproductionError",
    component: renderError,
    immediate: true,
  },
  'fatherKnown': {
    name: "fatherKnown",
    component: renderRadioGroup,
    label: makeMandatoryLabel("Is the father known?"),
    instructionText: "The mother doesn't need to be in a relationship with the father for him to be named on the birth certificate.",
    options: yesNoOptions,
    validate: [required],
  },

  'father.firstNames': {
    name: "father.firstNames",
    component: renderField,
    type: "text",
    label: makeMandatoryLabel(<span>All first name(s) <FatherText /> is currently known by</span>),
    instructionText: <span>Enter all the <FatherText />'s current first and middle names. If the names were different at birth, you can enter them below.</span>,
    placeholder: "e.g. John Andrew",
    validate: [required, validAlpha],
    normalize: maxLength(75),
  },
  'father.surname': {
    name: "father.surname",
    component: renderField,
    type: "text",
    label: makeMandatoryLabel(<span>Surname <FatherText /> is currently known by</span>),
    instructionText: <span>Enter all the <FatherText />'s current surnames or family names. If the names were different at birth, you can enter them below.</span>,
    placeholder: "e.g. Smith",
    validate: [required, validAlpha],
    normalize: maxLength(75),
  },
  'father.firstNamesAtBirth': {
    name: "father.firstNamesAtBirth",
    component: renderField,
    type: "text",
    label: <span>All first name(s) of <FatherText /> at birth</span>,
    instructionText: <span>You only need to complete this section if the <FatherText />'s first names at birth are different from their current names (as above). If the <FatherText /> was adopted, please enter the names given after adoption.</span>,
    placeholder: "eg. Michael James",
    validate: [validAlpha],
  },
  'father.surnameAtBirth': {
    name: "father.surnameAtBirth",
    component: renderField,
    type: "text",
    label: <span>Surname of <FatherText /> at birth</span>,
    instructionText: <span>You only need to complete this section if the <FatherText />'s surname at birth was different to their current surname. If the father was adopted, please enter the surname given after adoption.</span>,
    placeholder: "eg. Smith",
    validate: [validAlpha],
    normalize: maxLength(75),
  },
  'father.occupation': {
    name: "father.occupation",
    component: renderField,
    type: "text",
    label: makeMandatoryLabel(<span>Usual occupation, profession or job of <FatherText /></span>),
    placeholder: "e.g. Nurse",
    instructionText: "Enter the occupation or job title. You don't need to include the name of the employer.",
    validate: [required, validCharStrict],
    normalize: combine(maxLength(60), titleCase),
  },
  'father.dateOfBirth': {
    name: "father.dateOfBirth",
    component: renderDatepicker,
    label: makeMandatoryLabel(<span><FatherText capitalize />'s date of birth</span>),
    validate: [required, validDate, youngerThan(100)],
  },
  'father.placeOfBirth': {
    name: "father.placeOfBirth",
    component: renderField,
    type: "text",
    label: makeMandatoryLabel("Place of Birth - City/Town"),
    placeholder: "e.g. Whangarei",
    validate: [required, validAlpha],
    normalize: combine(maxLength(40), titleCase),
  },
  'father.countryOfBirth': {
    name: "father.countryOfBirth",
    component: renderField,
    type: "text",
    label: "Country of birth, if born overseas",
    placeholder: "e.g. Samoa",
    validate: [validAlpha],
    normalize: combine(maxLength(19), titleCase),
  },
  'parentSameAddress': {
    name: "parentSameAddress",
    label: "Same as mother's",
    component: renderCheckbox,
    onChange: requireHandler
  },
  'father.homeAddress.line1': {
    name: "father.homeAddress.line1",
    component: renderPlacesAutocomplete,
    type: "text",
    label: makeMandatoryLabel("Street number and Street name"),
    instructionText: "Begin typing your address, and select it from the options that appear. If required you can edit the address after you\'ve picked one.",
    onPlaceSelect: requireHandler,
    validate: [requiredWithMessage(REQUIRE_MESSAGE_STREET)],
    normalize: combine(maxLength(50), titleCase),
  },
  'father.homeAddress.suburb': {
    name: "father.homeAddress.suburb",
    component: renderField,
    type: "text",
    label: "Suburb",
    normalize: combine(maxLength(25), titleCase),
  },
  'father.homeAddress.line2': {
    name: "father.homeAddress.line2",
    component: renderField,
    type: "text",
    label: makeMandatoryLabel("Town/City and Postcode"),
    validate: [requiredWithMessage(REQUIRE_MESSAGE_POSTCODE)],
    normalize: combine(maxLength(75), titleCase),
  },
  'father.maoriDescendant': {
    name: "father.maoriDescendant",
    component: renderRadioGroup,
    label: makeMandatoryLabel(<span>Is the <FatherText /> the descendant of a New Zealand Māori?</span>),
    instructionText: "This information won't appear on the birth certificate, it's just for statistical purposes.",
    options: yesNoNotSureOptions,
    validate: [required],
  },
  'father.ethnicGroups': {
    name: "father.ethnicGroups",
    component: renderCheckboxGroup,
    label: makeMandatoryLabel(<span>Which ethnic group or groups does the <FatherText /> belong to?</span>),
    instructionText: <span>You may select as many boxes as you like to describe the <FatherText />'s ethnicity.</span>,
    options: ethnicGroupOptions,
    validate: [required],
    onChange: requireHandler,
  },
  'father.ethnicityDescription': {
    name: "father.ethnicityDescription",
    component: renderField,
    type: "text",
    placeholder: "eg. Somali, Thai",
    instructionText: <span>Please describe the <FatherText />'s ethnicity. This information helps other government agencies to get a clearer picture of our society so that health, education and other needs in your area can be planned for.</span>,
    ariaLabel: makeMandatoryAriaLabel("State other ethnicity"),
    validate: [required, maxLength30, validCharStrict],
  },
  'father.isCitizen': {
    name: 'father.isCitizen',
    component: renderRadioGroup,
    label: makeMandatoryLabel(<span>Is the <FatherText /> a New Zealand citizen?</span>),
    options: yesNoOptions,
    validate: [required],
    onChange: requireHandler,
  },
  'father.isPermanentResident': {
    name: 'father.isPermanentResident',
    component: renderRadioGroup,
    label: makeMandatoryLabel(<span>Is the <FatherText /> a New Zealand permanent resident?</span>),
    options: yesNoOptions,
    validate: [required],
    onChange: requireHandler,
  },
  'father.isNZRealmResident': {
    name: 'father.isNZRealmResident',
    component: renderRadioGroup,
    label: makeMandatoryLabel(<span>Is the <FatherText /> a resident of the Cook Islands, Niue or Tokelau?</span>),
    options: yesNoOptions,
    validate: [required],
    onChange: requireHandler,
  },
  'father.isAuResidentOrCitizen': {
    name: 'father.isAuResidentOrCitizen',
    component: renderRadioGroup,
    label: makeMandatoryLabel(<span>Is the <FatherText /> an Australian citizen or permanent resident of Australia?</span>),
    options: yesNoOptions,
    validate: [required],
    onChange: requireHandler,
  },
  'father.nonCitizenDocNumber': {
    name: 'father.nonCitizenDocNumber',
    component: renderField,
    label: makeMandatoryLabel(<span>Enter the passport/travel document number the <FatherText /> entered New Zealand on:</span>),
    type: "text",
    validate: [required, validCharStrict],
    normalize: maxLength(9),
  },
  'father.citizenshipWarning': {
    name: 'father.citizenshipWarning',
    component: renderWarning,
  },
  'father.citizenshipSource': {
    name: 'father.citizenshipSource',
    component: renderSelect,
    label: makeMandatoryLabel(<span>Please indicate how the <FatherText /> is a New Zealand citizen?</span>),
    options: citizenshipSourceOptions,
    validate: [required],
  },
  'father.citizenshipPassportNumber': {
    name: 'father.citizenshipPassportNumber',
    component: renderField,
    label: makeMandatoryLabel(<span>Enter the <FatherText />'s New Zealand passport number</span>),
    type: "text",
    validate: [required, validCharStrict],
    normalize: maxLength(9),
  },
  'father.daytimePhone': {
    name: "father.daytimePhone",
    component: renderField,
    type: "text",
    label: "Daytime contact number",
    instructionText: "Please include the area code or suffix, but don't use brackets or spaces.",
    placeholder: "e.g. 041234567",
    validate: [validCharStrict],
    normalize: maxLength(20),
  },
  'father.alternativePhone': {
    name: "father.alternativePhone",
    component: renderField,
    type: "text",
    label: "Alternative contact number",
    instructionText: "Please include the area code or suffix, but don't use brackets or spaces.",
    placeholder: "e.g. 0211234567",
    validate: [validCharStrict],
    normalize: maxLength(20),
  },
  'father.email': {
    name: "father.email",
    component: renderField,
    type: "email",
    label: "Email address",
    instructionText: "",
    validate: [email],
    normalize: maxLength(60),
  }
}

export default fields
