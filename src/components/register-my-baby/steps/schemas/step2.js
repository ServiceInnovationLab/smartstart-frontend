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
    instructionText: "Enter all the mother's current first and middle names. If the names were different at birth, you can enter them later in this form.",
    placeholder: "e.g. Janet Mary",
    validate: [required, validAlpha],
    normalize: maxLength(75),
  },
  'mother.surname': {
    name: "mother.surname",
    component: renderField,
    type: "text",
    label: makeMandatoryLabel("Surname mother is currently known by"),
    instructionText: "Enter all current surnames or family names. If the names were different at birth, you can enter them below.",
    placeholder: "e.g. Smith",
    validate: [required, validAlpha],
    normalize: maxLength(75),
  },
  'mother.firstNamesAtBirth': {
    name: "mother.firstNamesAtBirth",
    component: renderField,
    type: "text",
    label: "All first name(s) of mother at birth",
    instructionText: "You only need to complete this section if the mother's first names at birth are different from her current names (as above). If the mother was adopted, please enter the names given after adoption.",
    placeholder: "e.g. Sarah Jane",
    validate: [validAlpha],
  },
  'mother.surnameAtBirth': {
    name: "mother.surnameAtBirth",
    component: renderField,
    type: "text",
    label: "Surname of mother at birth",
    instructionText: "You only need to complete this section if the mother's surname at birth is different to her current name. If she is using a married name, enter her maiden name here. If the mother was adopted, please enter the surname given after adoption.",
    placeholder: "e.g. Jones",
    validate: [validAlpha],
    normalize: maxLength(75),
  },
  'mother.occupation': {
    name: "mother.occupation",
    component: renderField,
    type: "text",
    label: makeMandatoryLabel("Usual occupation, profession or job of mother"),
    placeholder: "e.g. Teacher",
    instructionText: "Enter the occupation or job title. You don't need to include the name of the employer.",
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
    label: makeMandatoryLabel("Place of Birth - City/Town"),
    placeholder: "e.g. Auckland",
    validate: [required, validAlpha],
    normalize: combine(maxLength(40), titleCase),
  },
  'mother.countryOfBirth': {
    name: "mother.countryOfBirth",
    component: renderField,
    type: "text",
    label: "Country of birth, if born overseas",
    placeholder: "e.g. Australia",
    validate: [validAlpha],
    normalize: combine(maxLength(19), titleCase),
  },
  'mother.homeAddress.line1': {
    name: "mother.homeAddress.line1",
    component: renderPlacesAutocomplete,
    type: "text",
    label: makeMandatoryLabel("Street number and Street name"),
    instructionText: "Begin typing your home address, and select it from the options that appear.",
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
    label: makeMandatoryLabel("Is the mother the descendant of a New Zealand Māori?"),
    instructionText: "This information won't appear on the birth certificate, it's just for statistical purposes.",
    options: yesNoNotSureOptions,
    validate: [required],
  },
  'mother.ethnicGroups': {
    name: "mother.ethnicGroups",
    component: renderCheckboxGroup,
    label: makeMandatoryLabel("Which ethnic group or groups does the mother belong to?"),
    instructionText: "You may select as many boxes as you like to describe the mother's ethnicity.",
    options: ethnicGroupOptions,
    validate: [required],
    onChange: requireHandler,
  },
  'mother.ethnicityDescription': {
    name: "mother.ethnicityDescription",
    component: renderField,
    type: "text",
    placeholder: "eg. Somali, Thai",
    instructionText: "Please describe the mother's ethnicity. This information helps other government agencies to get a clearer picture of our society so that health, education and other needs in your area can be planned for.",
    ariaLabel: makeMandatoryAriaLabel("Please describe the mother's ethnicity."),
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
    label: "Daytime contact number",
    instructionText: "Please include the area code or suffix, but don't use brackets or spaces.",
    placeholder: "e.g. 041234567",
    validate: [validCharStrict],
    normalize: maxLength(20),
  },
  'mother.alternativePhone': {
    name: "mother.alternativePhone",
    component: renderField,
    type: "text",
    label: "Alternative contact number",
    instructionText: "Please include the area code or suffix, but don't use brackets or spaces.",
    placeholder: "e.g. 0211234567",
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
