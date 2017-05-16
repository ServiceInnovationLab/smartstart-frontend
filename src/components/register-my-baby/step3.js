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
import { required, number, email, maxLength30 } from './validate'
import {
  REQUIRE_MESSAGE,
  INVALID_DATE_MESSAGE,
  FUTURE_DATE_MESSAGE
} from './validation-messages'

const validate = (values) => {
  const errors = {}

  if (!get(values, 'father.dateOfBirth')) {
    set(errors, 'father.dateOfBirth', REQUIRE_MESSAGE)
  } else {
    const dob = get(values, 'father.dateOfBirth');
    if (!dob.isValid()) {
      set(errors, 'father.dateOfBirth', INVALID_DATE_MESSAGE)
    } else if (dob.isAfter(moment())) {
      set(errors, 'father.dateOfBirth', FUTURE_DATE_MESSAGE)
    }
  }

  const ethnicGroups = get(values, 'father.ethnicGroups');

  if (!ethnicGroups || !ethnicGroups.length) {
    set(errors, 'father.ethnicGroups', REQUIRE_MESSAGE)
  }

  if (!get(values, 'father.isMaoriDescendant')) {
    set(errors, 'father.isMaoriDescendant', REQUIRE_MESSAGE)
  }

  return errors
}

class FatherDetailsForm extends Component {
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

    this.props.change('father.homeAddress1', streetAddress)
    this.props.change('father.homeAddress2', suburb)
    this.props.change('father.homeAddress3', `${town} ${postalCode}`)
  }

  render() {
    const { ethnicGroups, handleSubmit, submitting } = this.props
    return (
      <div>
        <h2><span className="visuallyhidden">Step</span> <span className="step-number">3</span> Matua <br/> Father/Other parent</h2>
        <div className="informative-text">
          You now need to give details of the child's father, if know. A reminder that it is an offence to provide false information and any person who provides false information is liable, on conviction, to imprisonment for up to 5 years.
        </div>
        <form onSubmit={handleSubmit(this.props.onSubmit)}>
          <Field
            name="father.firstName"
            component={renderField}
            type="text"
            label="All first name(s) father is currently known by"
            instructionText="Enter all current first and given names. If any differ from names given at birth, those names can be entered below."
            validate={[required]}
          />

          <Field
            name="father.lastName"
            component={renderField}
            type="text"
            label="Surname of father (currently known by)"
            instructionText="Enter all current surnames or family names. If any differ from names at birth, those names can be entered below."
            validate={[required]}
          />

          <Field
            name="father.firstNameAtBirth"
            component={renderField}
            type="text"
            label="All first name(s) of father at birth (if different from current name)"
            instructionText="Enter the name given at birth (if it differs from the above). If adopted, please enter the name/s given when adopted not before adoption (if known)"
          />

          <Field
            name="father.lastNameAtBirth"
            component={renderField}
            type="text"
            label="Surname of father at birth (if different from current name)"
            instructionText="Enter the surname or family name at birth (if it differs). If adopted, please enter the surname when adopted not before adoption (if known)"
          />

          <Field
            name="father.ocupation"
            component={renderField}
            type="text"
            label="Usual occupation, profession or job of father"
            placeholder="e.g. Teacher"
            instructionText="Please enter the father's type of occupation not the name of the father's employer"
            validate={[required]}
          />

          <Field
            name="father.dateOfBirth"
            component={renderDatepicker}
            label="Father's date of birth"
          />

          <Field
            name="father.cityOfBirth"
            component={renderField}
            type="text"
            label="Place of Birth - City/town"
            placeholder="e.g. Auckland"
            validate={[required]}
          />

          <Field
            name="father.countryOfBirth"
            component={renderField}
            type="text"
            label="Place of Birth - Country (if born overseas)"
            placeholder="e.g. Australia"
          />

          <fieldset>
            <legend>Home address</legend>
            <div>
              <Field
                name="father.homeAddress1"
                component={renderPlacesAutocomplete}
                type="text"
                label="Street number and Street name"
                onPlaceSelect={this.onPlaceSelect}
                validate={[required]}
              />
              <Field
                name="father.homeAddress2"
                component={renderField}
                type="text"
                label="Suburb"
                validate={[required]}
              />
              <Field
                name="father.homeAddress3"
                component={renderField}
                type="text"
                label="Town/City and Postcode"
                validate={[required]}
              />
            </div>
          </fieldset>


          <Field
            name="father.isMaoriDescendant"
            component={renderRadioGroup}
            label="Is the father a descendant of a New Zealand Māori?"
            instructionText="This will not appear on the birth certificate"
            options={[
              { value: 'yes', display: 'Yes'},
              { value: 'no', display: 'No'},
              { value: 'notsure', display: 'Not sure'}
            ]}
          />

          <Field
            name="father.ethnicGroups"
            component={renderCheckboxGroup}
            label="Which ethnic group(s) does the father belong to?"
            instructionText="Select as many boxes as you wish to describe the ethnic group(s) the father belongs to."
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
                name="father.ethnicityDescription"
                component={renderField}
                type="text"
                placeholder="Please describe the father’s ethnicity"
                validate={[required, maxLength30]}
              />
            </div>
          }

          <Field
            name="father.primaryPhoneNumber"
            component={renderField}
            type="text"
            label="Daytime contact phone number"
            instructionText="Please include the area code or suffix"
            validate={[number]}
          />

          <Field
            name="father.secondaryPhoneNumber"
            component={renderField}
            type="text"
            label="Alternative contact phone number"
            instructionText="Please include the area code or suffix"
            validate={[number]}
          />

          <Field
            name="father.email"
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

FatherDetailsForm.propTypes = {
  ethnicGroups: PropTypes.array,
  onSubmit: PropTypes.func,
  onPrevious: PropTypes.func,
  change: PropTypes.func,     // passed via reduxForm
  handleSubmit: PropTypes.func, // passed via reduxForm
  submitting: PropTypes.bool, // passed via reduxForm
  pristine: PropTypes.bool,   // passed via reduxForm
}

// Decorate the form component
FatherDetailsForm = reduxForm({
  form: 'registration', // same name for all wizard's form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate
})(FatherDetailsForm)

const selector = formValueSelector('registration')
FatherDetailsForm = connect(
  state => ({
    ethnicGroups: selector(state, 'father.ethnicGroups'),
  })
)(FatherDetailsForm)

export default FatherDetailsForm
