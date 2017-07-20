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
import { maxLength } from '../../normalize'
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
  'assistedHumanReproduction': {
    name: "assistedHumanReproduction",
    component: renderRadioGroup,
    label: makeMandatoryLabel("Is the child born as a result of an assisted human reproduction procedure (such as artificial insemination)?"),
    options: yesNoOptions,
    onChange: requireHandler,
    validate: [required],
  },
  'assistedHumanReproductionManConsented': {
    name: "assistedHumanReproductionManConsented",
    label: "I am in a relationship with a man who consented to the procedure. I will name him as the child's father",
    component: renderCheckbox,
    disabled: false,
  },
  'assistedHumanReproductionWomanConsented': {
    name: "assistedHumanReproductionWomanConsented",
    label: "I am in a relationship with a woman who consented to the procedure. I will name her as the child's other parent",
    component: renderCheckbox,
    disabled: false,
  },
  'assistedHumanReproductionSpermDonor': {
    name: "assistedHumanReproductionSpermDonor",
    label: "I used a sperm donor on my own without a consenting partner. I do not know who the father of the child is",
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
    instructionText: "The mother does not need to be in a relationship with the father for him to be named on the birth certificate",
    options: yesNoOptions,
    validate: [required],
  },

  'father.firstNames': {
    name: "father.firstNames",
    component: renderField,
    type: "text",
    label: makeMandatoryLabel("All first name(s) father is currently known by"),
    instructionText: "Enter all current first and given names. If any differ from names given at birth, those names can be entered below.",
    validate: [required, validAlpha],
    normalize: maxLength(75),
  },
  'father.surname': {
    name: "father.surname",
    component: renderField,
    type: "text",
    label: makeMandatoryLabel("Surname of father (currently known by)"),
    instructionText: "Enter all current surnames or family names. If any differ from names at birth, those names can be entered below.",
    validate: [required, validAlpha],
    normalize: maxLength(75),
  },
  'father.firstNamesAtBirth': {
    name: "father.firstNamesAtBirth",
    component: renderField,
    type: "text",
    label: "All first name(s) of father at birth (if different from current name)",
    instructionText: "Enter the name given at birth (if it differs from the above). If adopted, please enter the name/s given when adopted not before adoption (if known)",
    validate: [validAlpha],
  },
  'father.surnameAtBirth': {
    name: "father.surnameAtBirth",
    component: renderField,
    type: "text",
    label: "Surname of father at birth (if different from current name)",
    instructionText: "Enter the surname or family name at birth (if it differs). If adopted, please enter the surname when adopted not before adoption (if known)",
    validate: [validAlpha],
    normalize: maxLength(75),
  },
  'father.occupation': {
    name: "father.occupation",
    component: renderField,
    type: "text",
    label: makeMandatoryLabel("Usual occupation, profession or job of father"),
    placeholder: "e.g. Teacher",
    instructionText: "Please enter the father's type of occupation not the name of the father's employer",
    validate: [required, validCharStrict],
    normalize: maxLength(60),
  },
  'father.dateOfBirth': {
    name: "father.dateOfBirth",
    component: renderDatepicker,
    label: makeMandatoryLabel("Father's date of birth"),
    validate: [required, validDate, olderThan(10), youngerThan(100)],
  },
  'father.placeOfBirth': {
    name: "father.placeOfBirth",
    component: renderField,
    type: "text",
    label: makeMandatoryLabel("Place of Birth - City/town"),
    placeholder: "e.g. Auckland",
    validate: [required, validAlpha],
    normalize: maxLength(40),
  },
  'father.countryOfBirth': {
    name: "father.countryOfBirth",
    component: renderField,
    type: "text",
    label: "Place of Birth - Country (if born overseas)",
    placeholder: "e.g. Australia",
    validate: [validAlpha],
    normalize: maxLength(19),
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
    onPlaceSelect: requireHandler,
    validate: [requiredWithMessage(REQUIRE_MESSAGE_STREET)],
    normalize: maxLength(50),
  },
  'father.homeAddress.suburb': {
    name: "father.homeAddress.suburb",
    component: renderField,
    type: "text",
    label: "Suburb",
    normalize: maxLength(25),
  },
  'father.homeAddress.line2': {
    name: "father.homeAddress.line2",
    component: renderField,
    type: "text",
    label: makeMandatoryLabel("Town/City and Postcode"),
    validate: [requiredWithMessage(REQUIRE_MESSAGE_POSTCODE)],
    normalize: maxLength(75),
  },
  'father.maoriDescendant': {
    name: "father.maoriDescendant",
    component: renderRadioGroup,
    label: makeMandatoryLabel("Is the father a descendant of a New Zealand Māori?"),
    instructionText: "This will not appear on the birth certificate",
    options: yesNoNotSureOptions,
    validate: [required],
  },
  'father.ethnicGroups': {
    name: "father.ethnicGroups",
    component: renderCheckboxGroup,
    label: makeMandatoryLabel("Which ethnic group(s) does the father belong to?"),
    instructionText: "Select as many boxes as you wish to describe the ethnic group(s) the father belongs to.",
    options: ethnicGroupOptions,
    validate: [required],
    onChange: requireHandler,
  },
  'father.ethnicityDescription': {
    name: "father.ethnicityDescription",
    component: renderField,
    type: "text",
    placeholder: "Please describe the father’s ethnicity",
    ariaLabel: makeMandatoryAriaLabel("State other ethnicity"),
    validate: [required, maxLength30, validCharStrict],
  },
  'father.isCitizen': {
    name: 'father.isCitizen',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Is the father a New Zealand citizen?`),
    instructionText: `Please indicate the father's citizenship or immigration status.`,
    options: yesNoOptions,
    validate: [required],
    onChange: requireHandler,
  },
  'father.isPermanentResident': {
    name: 'father.isPermanentResident',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Is the father a New Zealand permanent resident?`),
    options: yesNoOptions,
    validate: [required],
    onChange: requireHandler,
  },
  'father.isNZRealmResident': {
    name: 'father.isNZRealmResident',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Is the father a resident of the Cook Islands, Niue or Tokelau?`),
    options: yesNoOptions,
    validate: [required],
    onChange: requireHandler,
  },
  'father.isAuResidentOrCitizen': {
    name: 'father.isAuResidentOrCitizen',
    component: renderRadioGroup,
    label: makeMandatoryLabel(`Is the father an Australian citizen or permanent resident of Australia?`),
    options: yesNoOptions,
    validate: [required],
    onChange: requireHandler,
  },
  'father.nonCitizenDocNumber': {
    name: 'father.nonCitizenDocNumber',
    component: renderField,
    label: makeMandatoryLabel(`Enter the passport/travel document number the father entered New Zealand on:`),
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
    label: makeMandatoryLabel(`Father is either`),
    instructionText: `Please indicate how the father is a New Zealand citizen`,
    options: citizenshipSourceOptions,
    validate: [required],
  },
  'father.citizenshipPassportNumber': {
    name: 'father.citizenshipPassportNumber',
    component: renderField,
    label: makeMandatoryLabel(`Enter the father's New Zealand passport number`),
    type: "text",
    validate: [required, validCharStrict],
    normalize: maxLength(9),
  },
  'father.daytimePhone': {
    name: "father.daytimePhone",
    component: renderField,
    type: "text",
    label: "Daytime contact phone number",
    instructionText: "Please include the area code or suffix",
    validate: [validCharStrict],
    normalize: maxLength(20),
  },
  'father.alternativePhone': {
    name: "father.alternativePhone",
    component: renderField,
    type: "text",
    label: "Alternative contact phone number",
    instructionText: "Please include the area code or suffix",
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
