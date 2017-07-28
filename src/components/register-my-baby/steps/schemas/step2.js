import makeMandatoryLabel, { makeMandatoryAriaLabel } from '../../hoc/make-mandatory-label'
import renderField from '../../fields/render-field'
import renderDatepicker from '../../fields/render-datepicker'
import renderCheckboxGroup from '../../fields/render-checkbox-group'
import renderRadioGroup from '../../fields/render-radio-group'
import renderPlacesAutocomplete from '../../fields/render-places-autocomplete'
import renderWarning from '../../fields/render-warning'
import renderSelect from '../../fields/render-select'
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
  olderThan,
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
  'mother.firstNames': {
    name: "mother.firstNames",
    component: renderField,
    type: "text",
    label: makeMandatoryLabel("All first name(s) mother is currently known by"),
    instructionText: "Enter all current first and given names. If any differ from names given at birth, those names can be entered below.",
    validate: [required, validAlpha],
    normalize: maxLength(75),
  },
  'mother.surname': {
    name: "mother.surname",
    component: renderField,
    type: "text",
    label: makeMandatoryLabel("Surname of mother (currently known by)"),
    instructionText: "Enter all current surnames or family names. If any differ from names at birth, those names can be entered below.",
    validate: [required, validAlpha],
    normalize: maxLength(75),
  },
  'mother.firstNamesAtBirth': {
    name: "mother.firstNamesAtBirth",
    component: renderField,
    type: "text",
    label: "All first name(s) of mother at birth (if different from current name)",
    instructionText: "Enter the name given at birth (if it differs from the above). If adopted, please enter the name/s given when adopted not before adoption (if known)",
    validate: [validAlpha],
  },
  'mother.surnameAtBirth': {
    name: "mother.surnameAtBirth",
    component: renderField,
    type: "text",
    label: "Surname of mother at birth (if different from current name)",
    instructionText: "Enter the surname or family name at birth (if it differs). If adopted, please enter the surname when adopted not before adoption (if known)",
    validate: [validAlpha],
    normalize: maxLength(75),
  },
  'mother.occupation': {
    name: "mother.occupation",
    component: renderField,
    type: "text",
    label: makeMandatoryLabel("Usual occupation, profession or job of mother"),
    placeholder: "e.g. Teacher",
    instructionText: "Please enter the mother's type of occupation not the name of the mother's employer",
    validate: [required, validCharStrict],
    normalize: combine(maxLength(60), titleCase),
  },
  'mother.dateOfBirth': {
    name: "mother.dateOfBirth",
    component: renderDatepicker,
    label: makeMandatoryLabel("Mother's date of birth"),
    validate: [required, validDate, olderThan(10), youngerThan(100)],
  },
  'mother.placeOfBirth': {
    name: "mother.placeOfBirth",
    component: renderField,
    type: "text",
    label: makeMandatoryLabel("Place of Birth - City/town"),
    placeholder: "e.g. Auckland",
    validate: [required, validAlpha],
    normalize: combine(maxLength(40), titleCase),
  },
  'mother.countryOfBirth': {
    name: "mother.countryOfBirth",
    component: renderField,
    type: "text",
    label: "Place of Birth - Country (if born overseas)",
    placeholder: "e.g. Australia",
    validate: [validAlpha],
    normalize: combine(maxLength(19), titleCase),
  },
  'mother.homeAddress.line1': {
    name: "mother.homeAddress.line1",
    component: renderPlacesAutocomplete,
    type: "text",
    label: makeMandatoryLabel("Street number and Street name"),
    onPlaceSelect: requireHandler,
    validate: [requiredWithMessage(REQUIRE_MESSAGE_STREET)],
    normalize: combine(maxLength(50), titleCase),
  },
  'mother.homeAddress.suburb': {
    name: "mother.homeAddress.suburb",
    component: renderField,
    type: "text",
    label: "Suburb",
    normalize: combine(maxLength(25), titleCase),
  },
  'mother.homeAddress.line2': {
    name: "mother.homeAddress.line2",
    component: renderField,
    type: "text",
    label: makeMandatoryLabel("Town/City and Postcode"),
    validate: [requiredWithMessage(REQUIRE_MESSAGE_POSTCODE)],
    normalize: combine(maxLength(75), titleCase),
  },
  'mother.maoriDescendant': {
    name: "mother.maoriDescendant",
    component: renderRadioGroup,
    label: makeMandatoryLabel("Is the mother a descendant of a New Zealand Māori?"),
    instructionText: "This will not appear on the birth certificate",
    options: yesNoNotSureOptions,
    validate: [required],
  },
  'mother.ethnicGroups': {
    name: "mother.ethnicGroups",
    component: renderCheckboxGroup,
    label: makeMandatoryLabel("Which ethnic group(s) does the mother belong to?"),
    instructionText: "Select as many boxes as you wish to describe the ethnic group(s) the mother belongs to.",
    options: ethnicGroupOptions,
    validate: [required],
    onChange: requireHandler,
  },
  'mother.ethnicityDescription': {
    name: "mother.ethnicityDescription",
    component: renderField,
    type: "text",
    placeholder: "Please describe the mother’s ethnicity",
    ariaLabel: makeMandatoryAriaLabel("State other ethnicity"),
    validate: [required, maxLength30, validCharStrict],
  },
  'mother.isCitizen': {
    name: 'mother.isCitizen',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Is the mother a New Zealand citizen?`),
    instructionText: `Please indicate the mother's citizenship or immigration status.`,
    options: yesNoOptions,
    validate: [required],
    onChange: requireHandler,
  },
  'mother.isPermanentResident': {
    name: 'mother.isPermanentResident',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Is the mother a New Zealand permanent resident?`),
    options: yesNoOptions,
    validate: [required],
    onChange: requireHandler,
  },
  'mother.isNZRealmResident': {
    name: 'mother.isNZRealmResident',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Is the mother a resident of the Cook Islands, Niue or Tokelau?`),
    options: yesNoOptions,
    validate: [required],
    onChange: requireHandler,
  },
  'mother.isAuResidentOrCitizen': {
    name: 'mother.isAuResidentOrCitizen',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Is the mother an Australian citizen or permanent resident of Australia?`),
    options: yesNoOptions,
    validate: [required],
    onChange: requireHandler,
  },
  'mother.nonCitizenDocNumber': {
    name: 'mother.nonCitizenDocNumber',
    component: renderField,
    label: makeMandatoryLabel(`Enter the passport/travel document number the mother entered New Zealand on:`),
    type: "text",
    validate: [required, validCharStrict],
    normalize: maxLength(9),
  },
  'mother.citizenshipWarning': {
    name: 'mother.citizenshipWarning',
    component: renderWarning,
  },
  'mother.citizenshipSource': {
    name: 'mother.citizenshipSource',
    component: renderSelect,
    label: makeMandatoryLabel(`Mother is either`),
    instructionText: `Please indicate how the mother is a New Zealand citizen`,
    options: citizenshipSourceOptions,
    validate: [required],
  },
  'mother.citizenshipPassportNumber': {
    name: 'mother.citizenshipPassportNumber',
    component: renderField,
    label: makeMandatoryLabel(`Enter the mother's New Zealand passport number`),
    type: "text",
    validate: [required, validCharStrict],
    normalize: maxLength(9),
  },

  'mother.daytimePhone': {
    name: "mother.daytimePhone",
    component: renderField,
    type: "text",
    label: "Daytime contact phone number",
    instructionText: "Please include the area code or suffix",
    validate: [validCharStrict],
    normalize: maxLength(20),
  },
  'mother.alternativePhone': {
    name: "mother.alternativePhone",
    component: renderField,
    type: "text",
    label: "Alternative contact phone number",
    instructionText: "Please include the area code or suffix",
    validate: [validCharStrict],
    normalize: maxLength(20),
  },
  'mother.email': {
    name: "mother.email",
    component: renderField,
    type: "email",
    label: "Email address",
    instructionText: "",
    validate: [email],
    normalize: maxLength(60),
  }
}

export default fields
