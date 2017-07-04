import React from 'react'
import { Link } from 'react-router'

export const REQUIRE_MESSAGE = 'This is a required field, please provide an answer'
export const REQUIRE_MESSAGE_STREET = 'This is a required field, please enter a street address'
export const REQUIRE_MESSAGE_POSTCODE = 'This is a required field, please enter a town or city and a postcode'
export const REQUIRE_MESSAGE_CHILD_FIRST_NAME = 'This is a required field, please provide an answer. If you want your child to have a single name enter a dash (-) in the given names field'
export const REQUIRE_IRD_ADDRESS = 'This is a required field, please choose an address to post your child\'s IRD number to.'
export const REQUIRE_AT_LEAST_ONE = 'You have to select at least one of the above'
export const REQUIRE_AT_LEAST_ONE_MSD = 'Please provide the MSD client number for at least one parent'
export const REQUIRE_EXPLAINATION = 'Please provide an explanation'
export const REQUIRE_DECLARATION = 'You must agree to the declaration above'

export const INVALID_DATE_MESSAGE = 'The selected date is not valid, please try again'
export const INVALID_EMAIL_MESSAGE = 'This is not a valid email address, please re-enter the email address'
export const INVALID_NUMBER_MESSAGE = 'This is not a valid number, please try again'
export const INVALID_IRD_MESSAGE = 'Please enter a valid IRD number'
export const INVALID_MSD_MESSAGE = 'Please enter a valid MSD client number'

export const FUTURE_DATE_MESSAGE = 'This date is in the future, please provide a valid date'
export const EXCEED_MAXLENGTH_MESSAGE = 'This field does not allow more than {max} characters'
export const INVALID_NAME_MESSAGE = 'A name cannot contain, punctuation or symbols, please remove all punctuation or symbols'
export const LONG_NAME_WARNING_MESSAGE = 'The child\'s name appears to be very long. If the child\'s combined first names and surname are more than 100 characters long including spaces it may be undesirable in the public interest and you may want to consider changing this now. With a very long name - and before the birth registration is allowed - a Registrar will have to review the combined first names and surname to ensure it is not undesirable in the public interest for the person to bear a name or combination of names that are excessively long'

export const WARNING_MOTHER_DATE_OF_BIRTH = 'You have indicated that the mother was less than 13 years old when the child was born. If this is a mistake please adjust the date, or continue'
export const WARNING_FATHER_DATE_OF_BIRTH = 'You have indicated that the father was less than 13 years old when the child was born. If this is a mistake please adjust the date, or continue'
export const WARNING_CITIZENSHIP = 'Note - If both the mother and father (or other parent) of the child being registered are not New Zealand citizens or entitled under the Immigration Act 2009 to be in New Zealand indefinitely or entitled to reside indefinitely in the Cook Islands, Niue or Tokelau, the child is not a New Zealand citizen by birth.'
export const WARNING_NAME_CONTAINS_RANK = 'The name looks like it may include an official title or rank. If you wish your child to have a name that includes or resembles an official title or rank you must include your reasons in the box below. Prior to registration, a Registrar will review the name(s) and your reasoning to ensure it is not undesirable in the public interest for the person to bear a name or combination of names.'
export const WARNING_NAME_CONTAINS_OFFENSIVE = 'The name appears to contain a word or words that may cause offence to a reasonable person. The name may not be accepted for registration as it is, but you do have the opportunity to explain below your reasons for wanting your child to have a name that may contain an offensive term. Prior to registration, a Registrar will review the name(s) and your reasoning to ensure it is not undesirable in the public interest for the person to bear a name or combination of names.'
export const WARNING_PARENT_SURNAME_MATCH = 'It appears that you have only entered the Mother\'s married surname. If the mother had a different surname at birth please enter that surname in the birth surname field. If, however, the mother\'s birth surname and current surname are the same then proceed with submitting the birth registration as it is.'

export const REQUIRE_MOTHER_EMAIL_IRD = <span>
  You have not supplied mother's email address, please add one to the contact details on
  &nbsp;<Link to={'/register-my-baby/mother-details?focus=mother.email'}>this step <span className="visuallyhidden">on the Mother details page</span></Link>
</span>

export const REQUIRE_FATHER_EMAIL_IRD = <span>
  You have not supplied father's email address, please add one to the contact details on
  &nbsp;<Link to={'/register-my-baby/father-details?focus=father.email'}>this step <span className="visuallyhidden">on the Father details page</span></Link>
</span>

const EMPTY = ''

export const frontendMessageByErrorCode = {
  'wdatet_parent_young': { message: EMPTY, type: 'warning' }, // parent relationship marriage date
  '10010': { message: EMPTY, type: 'warning' }, // title case

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
  '10015': { message: FUTURE_DATE_MESSAGE, type: 'error' },
  '10025': { message: EXCEED_MAXLENGTH_MESSAGE, type: 'error' },
  '10066': { message: INVALID_NAME_MESSAGE, type: 'error' },

  'name_contains_rank:child.firstNames': { message: WARNING_NAME_CONTAINS_RANK, type: 'warning' },
  'name_contains_rank:child.surname': { message: WARNING_NAME_CONTAINS_RANK, type: 'warning' },
  'obscene_name:child.firstNames': { message: WARNING_NAME_CONTAINS_OFFENSIVE, type: 'warning' },
  'obscene_name:child.surname': { message: WARNING_NAME_CONTAINS_OFFENSIVE, type: 'warning' },
  'surname_match:mother.surname': { message: WARNING_PARENT_SURNAME_MATCH, type: 'warning' },
  'surname_match:father.surname': { message: WARNING_PARENT_SURNAME_MATCH, type: 'warning' },
  '10014:mother.dateOfBirth': { message: WARNING_MOTHER_DATE_OF_BIRTH, type: 'warning' },
  '10014:father.dateOfBirth': { message: WARNING_FATHER_DATE_OF_BIRTH, type: 'warning' }
}
