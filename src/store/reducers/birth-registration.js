import {
  REQUEST_BIRTH_FACILITIES,
  RECEIVE_BIRTH_FACILITIES,
  FAILURE_BIRTH_FACILITIES,
  REQUEST_COUNTRIES,
  RECEIVE_COUNTRIES,
  FAILURE_COUNTRIES,
  REQUEST_BRO_DATA,
  RECEIVE_BRO_DATA,
  FAILURE_BRO_DATA,
  RECEIVE_CSRF_TOKEN
} from 'actions/birth-registration'

/*
 * If we have a saved state of form, here is where we load that state into upon initialization
 *
 * A saved state should following this structure:
 *
 * {
 *   step: number, // current step at the time of save
 *   data: object  // current form state at the time of save
 * }
 */

 export const initialRegistrationFormState = {
   step: 0,
   data: {
     otherChildren: 0,
     certificateOrder: {
       courierDelivery: 'standard'
     }
   }
 }

export default function birthRegistration (state = {
  birthFacilities: [],
  countries: [],
  csrfToken: '',
  fetchingSavedUserData: false,
  savedRegistrationForm: initialRegistrationFormState
}, action) {
  switch (action.type) {
    case REQUEST_BIRTH_FACILITIES:
      return {
        ...state,
        fetchingBirthFacilities: true
      };
    case RECEIVE_BIRTH_FACILITIES:
      return {
        ...state,
        fetchingBirthFacilities: false,
        birthFacilities: action.payload.response
      };

    case REQUEST_COUNTRIES:
      return {
        ...state,
        fetchingCountries: true
      };
    case RECEIVE_COUNTRIES:
      return {
        ...state,
        fetchingCountries: false,
        countries: action.payload.response
      };

    case REQUEST_BRO_DATA:
      return {
        ...state,
        fetchingSavedUserData: true
      };
    case RECEIVE_BRO_DATA:
      return {
        ...state,
        fetchingSavedUserData: false,
        savedRegistrationForm: Object.keys(action.payload).length ? {...action.payload} : state.savedRegistrationForm
      };

    case FAILURE_BIRTH_FACILITIES:
      return {
        ...state,
        fetchingBirthFacilities: false
      };

    case FAILURE_COUNTRIES:
      return {
        ...state,
        fetchingCountries: false
      };

    case FAILURE_BRO_DATA:
      return {
        ...state,
        fetchingSavedUserData: false
      };

    case RECEIVE_CSRF_TOKEN:
      return {
        ...state,
        csrfToken: action.token
      };
    default:
      return state
  }
}
