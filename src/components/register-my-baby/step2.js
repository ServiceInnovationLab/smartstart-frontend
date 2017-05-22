import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector} from 'redux-form'
import find from 'lodash/find'
import get from 'lodash/get'
import set from 'lodash/set'
import moment from 'moment'
import renderField from './render-field'
import renderDatepicker from './render-datepicker'
import renderRadioGroup from './render-radio-group'
import renderCheckboxGroup from './render-checkbox-group'
import renderPlacesAutocomplete from './render-places-autocomplete'
import { required, requiredWithMessage, number, email, maxLength30 } from './validate'
import {
  REQUIRE_MESSAGE,
  REQUIRE_MESSAGE_STREET,
  REQUIRE_MESSAGE_POSTCODE,
  INVALID_DATE_MESSAGE,
  FUTURE_DATE_MESSAGE,
  WARNING_MOTHER_DATE_OF_BIRTH
} from './validation-messages'

const validate = (values) => {
  const errors = {}

  if (!get(values, 'mother.dateOfBirth')) {
    set(errors, 'mother.dateOfBirth', REQUIRE_MESSAGE)
  } else {
    let dob = get(values, 'mother.dateOfBirth');

    if (typeof dob === 'string') {
      dob = moment(dob)
    }

    if (!dob.isValid()) {
      set(errors, 'mother.dateOfBirth', INVALID_DATE_MESSAGE)
    } else if (dob.isAfter(moment())) {
      set(errors, 'mother.dateOfBirth', FUTURE_DATE_MESSAGE)
    }
  }

  const ethnicGroups = get(values, 'mother.ethnicGroups');

  if (!ethnicGroups || !ethnicGroups.length) {
    set(errors, 'mother.ethnicGroups', REQUIRE_MESSAGE)
  }

  if (!get(values, 'mother.isMaoriDescendant')) {
    set(errors, 'mother.isMaoriDescendant', REQUIRE_MESSAGE)
  }

  return errors
}


const warn = (values) => {
  const warnings = {}

  let dob = get(values, 'mother.dateOfBirth');

  if (dob) {
    if (typeof dob === 'string') {
      dob = moment(dob)
    }

    if (dob.isValid() && moment().diff(dob, 'years') <= 13) {
      set(warnings, 'mother.dateOfBirth', WARNING_MOTHER_DATE_OF_BIRTH)
    }
  }

  return warnings
}

class MotherDetailsForm extends Component {
  constructor(props) {
    super(props)

    this.onEthnicGroupsChange = this.onEthnicGroupsChange.bind(this);
    this.onPlaceSelect = this.onPlaceSelect.bind(this);
  }

  onEthnicGroupsChange(e, newVal, previousVal) {
    if (
      previousVal && previousVal.indexOf('Other') > -1 &&
      newVal && newVal.indexOf('Other') === -1
    ) {
      this.props.change('ethnicityDescription', '')
    }
  }

  onPlaceSelect(placeDetail) {
    const { address_components: addressComponents } = placeDetail

    const streetAddress = get(placeDetail, 'name', '')
    const suburb = get(placeDetail, 'vicinity', '')

    const town = get(
      find(addressComponents, component => component.types.indexOf('locality') > -1),
      'long_name',
      ''
    )
    const postalCode = get(
      find(addressComponents, component => component.types.indexOf('postal_code') > -1),
      'long_name',
      ''
    )

    this.props.change('mother.homeAddress1', streetAddress)
    this.props.change('mother.homeAddress2', suburb)
    this.props.change('mother.homeAddress3', `${town} ${postalCode}`)
  }

  render() {
    const { ethnicGroups, handleSubmit, submitting } = this.props
    return (
      <div>
        <h2><span className="visuallyhidden">Step</span> <span className="step-number">2</span> Whaea <br/> Mother</h2>
        <form onSubmit={handleSubmit(this.props.onSubmit)}>
          <Field
            name="mother.firstName"
            component={renderField}
            type="text"
            label="All first name(s) mother is currently known by"
            instructionText="Enter all current first and given names. If any differ from names given at birth, those names can be entered below."
            validate={[required]}
          />

          <Field
            name="mother.lastName"
            component={renderField}
            type="text"
            label="Surname of mother (currently known by)"
            instructionText="Enter all current surnames or family names. If any differ from names at birth, those names can be entered below."
            validate={[required]}
          />

          <Field
            name="mother.firstNameAtBirth"
            component={renderField}
            type="text"
            label="All first name(s) of mother at birth (if different from current name)"
            instructionText="Enter the name given at birth (if it differs from the above). If adopted, please enter the name/s given when adopted not before adoption (if known)"
          />

          <Field
            name="mother.lastNameAtBirth"
            component={renderField}
            type="text"
            label="Surname of mother at birth (if different from current name)"
            instructionText="Enter the surname or family name at birth (if it differs). If adopted, please enter the surname when adopted not before adoption (if known)"
          />

          <Field
            name="mother.ocupation"
            component={renderField}
            type="text"
            label="Usual occupation, profession or job of mother"
            placeholder="e.g. Teacher"
            instructionText="Please enter the mother's type of occupation not the name of the mother's employer"
            validate={[required]}
          />

          <Field
            name="mother.dateOfBirth"
            component={renderDatepicker}
            label="Mother's date of birth"
          />

          <Field
            name="mother.cityOfBirth"
            component={renderField}
            type="text"
            label="Place of Birth - City/town"
            placeholder="e.g. Auckland"
            validate={[required]}
          />

          <Field
            name="mother.countryOfBirth"
            component={renderField}
            type="text"
            label="Place of Birth - Country (if born overseas)"
            placeholder="e.g. Australia"
          />

          <fieldset>
            <legend>Home address</legend>
            <div className="input-groups">
              <Field
                name="mother.homeAddress1"
                component={renderPlacesAutocomplete}
                type="text"
                label="Street number and Street name"
                onPlaceSelect={this.onPlaceSelect}
                validate={[requiredWithMessage(REQUIRE_MESSAGE_STREET)]}
              />
              <Field
                name="mother.homeAddress2"
                component={renderField}
                type="text"
                label="Suburb"
              />
              <Field
                name="mother.homeAddress3"
                component={renderField}
                type="text"
                label="Town/City and Postcode"
                validate={[requiredWithMessage(REQUIRE_MESSAGE_POSTCODE)]}
              />
            </div>
          </fieldset>


          <Field
            name="mother.isMaoriDescendant"
            component={renderRadioGroup}
            label="Is the mother a descendant of a New Zealand Māori?"
            instructionText="This will not appear on the birth certificate"
            options={[
              { value: 'yes', display: 'Yes'},
              { value: 'no', display: 'No'},
              { value: 'notsure', display: 'Not sure'}
            ]}
          />

          <Field
            name="mother.ethnicGroups"
            component={renderCheckboxGroup}
            label="Which ethnic group(s) does the mother belong to?"
            instructionText="Select as many boxes as you wish to describe the ethnic group(s) the mother belongs to."
            options={[
              { value: 'NZ European', display: 'NZ European'},
              { value: 'Māori', display: 'Māori'},
              { value: 'Samoan', display: 'Samoan'},
              { value: 'Cook Island Māori', display: 'Cook Island Māori'},
              { value: 'Tongan', display: 'Tongan'},
              { value: 'Niuean', display: 'Niuean'},
              { value: 'Chinese', display: 'Chinese'},
              { value: 'Indian', display: 'Indian'},
              { value: 'Other', display: 'Other'}
            ]}
            onChange={this.onEthnicGroupsChange}
          />

          { ethnicGroups && ethnicGroups.indexOf('Other') > -1 &&
            <div className="conditional-field">
              <Field
                name="mother.ethnicityDescription"
                component={renderField}
                type="text"
                placeholder="Please describe the mother’s ethnicity"
                validate={[required, maxLength30]}
              />
            </div>
          }

          <Field
            name="mother.primaryPhoneNumber"
            component={renderField}
            type="text"
            label="Daytime contact phone number"
            instructionText="Please include the area code or suffix"
            validate={[number]}
          />

          <Field
            name="mother.secondaryPhoneNumber"
            component={renderField}
            type="text"
            label="Alternative contact phone number"
            instructionText="Please include the area code or suffix"
            validate={[number]}
          />

          <Field
            name="mother.email"
            component={renderField}
            type="email"
            label="Email address"
            instructionText=""
            validate={[email]}
          />

          <div className="form-actions">
            <button type="button" className="previous" onClick={this.props.onPrevious}>Back</button>
            <button type="submit" className="next" disabled={submitting}>Next</button>
          </div>
        </form>
      </div>
    )
  }
}

MotherDetailsForm.propTypes = {
  ethnicGroups: PropTypes.array,
  onSubmit: PropTypes.func,
  onPrevious: PropTypes.func,
  change: PropTypes.func,     // passed via reduxForm
  handleSubmit: PropTypes.func, // passed via reduxForm
  submitting: PropTypes.bool, // passed via reduxForm
  pristine: PropTypes.bool,   // passed via reduxForm
}

// Decorate the form component
MotherDetailsForm = reduxForm({
  form: 'registration', // same name for all wizard's form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  warn
})(MotherDetailsForm)

const selector = formValueSelector('registration')
MotherDetailsForm = connect(
  state => ({
    ethnicGroups: selector(state, 'mother.ethnicGroups'),
  })
)(MotherDetailsForm)

export default MotherDetailsForm
