import React from 'react'
import { Link } from 'react-router'

export const REQUIRE_MESSAGE = 'This is a required field, please provide an answer'
export const REQUIRE_MESSAGE_STREET = 'This is a required field, please enter a street address'
export const REQUIRE_MESSAGE_POSTCODE = 'This is a required field, please enter a town or city and a postcode'
export const REQUIRE_MESSAGE_CHILD_FIRST_NAME = 'This is a required field, please provide an answer. If you want your child to have a single name enter a dash (-) in the given names field'
export const REQUIRE_IRD_ADDRESS = 'This is a required field, please choose an address to post your child\'s IRD number to.'
export const REQUIRE_AT_LEAST_ONE = 'You have to select at least one of the above'
export const REQUIRE_AT_LEAST_ONE_MSD = 'Please provide the MSD client number for at least one parent'

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

export const REQUIRE_MOTHER_EMAIL_IRD = <span>
  You have not supplied mother's email address, please add one to the contact details on
  &nbsp;<Link to={'/register-my-baby/mother-details?focus=mother.email'}>this step <span className="visuallyhidden">on the Mother details page</span></Link>
</span>

export const REQUIRE_FATHER_EMAIL_IRD = <span>
  You have not supplied father's email address, please add one to the contact details on
  &nbsp;<Link to={'/register-my-baby/father-details?focus=father.email'}>this step <span className="visuallyhidden">on the Father details page</span></Link>
</span>
