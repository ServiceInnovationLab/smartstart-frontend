import React from 'react'
import { Link } from 'react-router'
import FatherText from './steps/schemas/father-text'

export const REQUIRE_AT_LEAST_ONE = 'You have to select at least one of the above.'
export const REQUIRE_EXPLAINATION = 'Please provide an explanation.'
export const INVALID_DATE_MESSAGE = 'The selected date is not valid, please try again.'
export const INVALID_NUMBER_MESSAGE = 'This is not a valid number, please try again.'
export const WARNING_CITIZENSHIP = 'Note - If both the mother and father (or other parent) of the child being registered are not New Zealand citizens or entitled under the Immigration Act 2009 to be in New Zealand indefinitely or entitled to reside indefinitely in the Cook Islands, Niue or Tokelau, the child is not a New Zealand citizen by birth.'

export const REQUIRE_MESSAGE = 'This is a required field, please provide an answer.'
export const REQUIRE_MESSAGE_STREET = 'This is a required field, please enter a street address.'
export const REQUIRE_MESSAGE_POSTCODE = 'This is a required field, please enter a town or city and a postcode.'
export const REQUIRE_MESSAGE_CHILD_FIRST_NAME = 'This is a required field, please provide an answer. If you want your child to have a single name enter a dash (-) in the given names field.'
export const REQUIRE_IRD_ADDRESS = 'This is a required field, please choose an address to post your child\'s IRD number to.'
export const REQUIRE_AT_LEAST_ONE_MSD = 'Please provide the MSD client number for at least one parent.'
export const REQUIRE_EMAIL_ADDRESS = 'Please supply an email address.'
export const REQUIRE_DECLARATION = 'You must agree to the declaration above.'

export const INVALID_EMAIL_MESSAGE = 'This is not a valid email address, please re-enter the email address.'
export const INVALID_IRD_MESSAGE = 'Please enter a valid IRD number.'
export const INVALID_MSD_MESSAGE = 'Please enter a valid MSD client number.'

export const FUTURE_DATE_MESSAGE = 'This date is in the future, please provide a valid date.'
export const INVALID_CHAR_MESSAGE = 'Some punctuation or special characters cannot be accepted - please remove any {invalid_matches} from your answer.'

export const MIN_AGE_MESSAGE = 'Parent\'s age cannot be less than {min_age} years, please check the date entered.'
export const MAX_AGE_MESSAGE = 'Parent\'s age cannot be greater than {max_age} years, please check the date entered.'
export const MIN_10_AGE_MOTHER_MESSAGE = 'Mother\'s age cannot be less than 10 years when the child was born, please check the date entered.'
export const MIN_10_AGE_FATHER_MESSAGE = <span>
  <FatherText capitalize />'s age cannot be less than 10 years when the child was born, please check the date entered.
</span>
export const MAX_100_AGE_MESSAGE = 'Parent\'s age cannot be greater than 100 years, please check the date entered.'
export const MIN_16_AGE_RELATIONSHIP_DATE_MESSAGE = 'Date of event must be at least sixteen years after parent\'s dates of birth.'

export const WARNING_NAME_CONTAINS_RANK = 'The name may includes an official title or rank. If you wish your child to have this name you should include your reasons in the box below.'
export const WARNING_NAME_CONTAINS_OFFENSIVE = 'The name may be undesirable in the public interest as it might cause offence to a reasonable person. The name may not be accepted for registration as it is. A Registrar will review the name(s). If you wish your child to have this name you should include your reasons in the box below.'
export const WARNING_PARENT_SURNAME_MATCH = 'Both parents have the same surname. If the mother is using a married name please provide your birth names.'

export const DUPLICATE_APPLICATION_MESSAGE = <span>
  It looks like you may have already submitted an application for this child. Please call us on <a href="tel:0800225225">0800 225 225</a> to discuss it further.
</span>

export const REQUIRE_MOTHER_EMAIL_IRD = <span>
  You have not supplied mother's email address, please add one to the contact details on
  &nbsp;<Link to={'/register-my-baby/mother-details?focus=mother.email'}>this step <span className="visuallyhidden">on the Mother details page.</span></Link>
</span>

export const REQUIRE_FATHER_EMAIL_IRD = <span>
  You have not supplied <FatherText />'s email address, please add one to the contact details on
  &nbsp;<Link to={'/register-my-baby/father-details?focus=father.email'}>this step <span className="visuallyhidden">on the <FatherText /> details page.</span></Link>
</span>

export const REQUIRE_BIRTH_CERTIFICATE_ORDER = <span>
  You have indicated that you want us to send your IR number to your birth certificate order address. Please change your address choice for your child's IR
  number <Link to={'/register-my-baby/other-services?focus=ird.deliveryAddress'}>here <span className="visuallyhidden">on the Other Services page</span></Link>.
</span>

const EMPTY = ''

export const frontendMessageByErrorCode = {
  'wdatet_parent_young': { message: MIN_10_AGE_MOTHER_MESSAGE, type: 'error' }, // parent relationship marriage date
  '10010': { message: EMPTY, type: 'warning' }, // title case
  '10025': { message: EMPTY, type: 'error' },

  'ethnic:child.ethnicGroups': { message: REQUIRE_MESSAGE, type: 'error' },
  'ethnic:mother.ethnicGroups': { message: REQUIRE_MESSAGE, type: 'error' },
  'ethnic:father.ethnicGroups': { message: REQUIRE_MESSAGE, type: 'error' },
  'ird_fathers_email': { message: REQUIRE_FATHER_EMAIL_IRD, type: 'error' },
  'ird_mothers_email': { message: REQUIRE_MOTHER_EMAIL_IRD, type: 'error' },
  'msd_invalid:msd.mothersClientNumber': { message: INVALID_MSD_MESSAGE, type: 'error' },
  'msd_invalid:msd.fathersClientNumber': { message: INVALID_MSD_MESSAGE, type: 'error' },
  'msd_mandatory:msd.mothersClientNumber': { message: REQUIRE_AT_LEAST_ONE_MSD, type: 'error' },
  'msd_mandatory:msd.fathersClientNumber': { message: REQUIRE_AT_LEAST_ONE_MSD, type: 'error' },
  '10001': { message: REQUIRE_MESSAGE, type: 'error' },
  '10002': { message: REQUIRE_MESSAGE, type: 'error' },
  '10003': { message: INVALID_CHAR_MESSAGE, type: 'error' },
  '10004': { message: INVALID_CHAR_MESSAGE, type: 'error' },
  '10066': { message: INVALID_CHAR_MESSAGE, type: 'error' },
  '10015': { message: FUTURE_DATE_MESSAGE, type: 'error' },

  'name_contains_rank:child.firstNames': { message: WARNING_NAME_CONTAINS_RANK, type: 'warning' },
  'name_contains_rank:child.surname': { message: WARNING_NAME_CONTAINS_RANK, type: 'warning' },
  'obscene_name:child.firstNames': { message: WARNING_NAME_CONTAINS_OFFENSIVE, type: 'warning' },
  'obscene_name:child.surname': { message: WARNING_NAME_CONTAINS_OFFENSIVE, type: 'warning' },
  'surname_match:mother.surname': { message: WARNING_PARENT_SURNAME_MATCH, type: 'warning' },
  'surname_match:father.surname': { message: WARNING_PARENT_SURNAME_MATCH, type: 'warning' },
  'mdob_young:mother.dateOfBirth': { message: MIN_10_AGE_MOTHER_MESSAGE, type: 'error' },
  'fdob_young:father.dateOfBirth': { message: MIN_10_AGE_FATHER_MESSAGE, type: 'error' },
  '10014:mother.dateOfBirth': { message: MAX_100_AGE_MESSAGE, type: 'error' },
  '10014:father.dateOfBirth': { message: MAX_100_AGE_MESSAGE, type: 'error' }
}
