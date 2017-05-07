import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector} from 'redux-form'
import get from 'lodash/get'
import set from 'lodash/set'
import moment from 'moment'
import renderField from './render-field'
import renderError from './render-error'
import renderDatepicker from './render-datepicker'
import renderCheckboxGroup from './render-checkbox-group'
import { required, number, email, maxLength30 } from './validate'
import {
  REQUIRE_MESSAGE,
  INVALID_DATE_MESSAGE,
  FUTURE_DATE_MESSAGE
} from './validation-messages'

const validate = (values) => {
  const errors = {}

  if (!get(values, 'mother.dateOfBirth')) {
    set(errors, 'mother.dateOfBirth', REQUIRE_MESSAGE)
  } else {
    const dob = get(values, 'mother.dateOfBirth');
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

  return errors
}

class MotherDetailsForm extends Component {
  constructor(props) {
    super(props)

    this.onEthnicGroupsChange = this.onEthnicGroupsChange.bind(this);
  }

  onEthnicGroupsChange(e, newVal, previousVal) {
    if (
      previousVal && previousVal.indexOf('Other') > -1 &&
      newVal && newVal.indexOf('Other') === -1
    ) {
      this.props.change('ethnicityDescription', '')
    }
  }

  render() {
    const { ethnicGroups, handleSubmit, submitting } = this.props
    return (
      <div>
        <h4>Mother details</h4>
        <div className="divider" />
        <form onSubmit={handleSubmit(this.props.onSubmit)}>
          <Field
            name="mother.firstName"
            component={renderField}
            type="text"
            label="All first name(s) mother is currently known by (text)"
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
            <div>
              <Field
                name="mother.homeAddress1"
                component={renderField}
                type="text"
                label="Street number, Street Name, Suburb"
                validate={[required]}
              />
              <Field
                name="mother.homeAddress2"
                component={renderField}
                type="text"
                label="Town/City and Postcode"
                validate={[required]}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Is this mother a descendant of a New Zealand Māori?</legend>
            <div className="instruction-text">This will not appear on the birth certificate</div>
            <div className="radio-group">
              <div>
                <div>
                  <label>
                    <Field name="mother.isMaoriDecendant" component="input" type="radio" value="yes" />
                    <span role="button">Yes</span>
                  </label>
                  <label>
                    <Field name="mother.isMaoriDecendant" component="input" type="radio" value="no" />
                    <span role="button">No</span>
                  </label>
                  <label>
                    <Field name="mother.isMaoriDecendant" component="input" type="radio" value="notsure" />
                    <span role="button">Not sure</span>
                  </label>
                </div>
                <Field name="mother.isMaoriDecendant" component={renderError} />
              </div>
            </div>
          </fieldset>

          <Field
            name="mother.ethnicGroups"
            component={renderCheckboxGroup}
            label="Which ethnic group(s) does the mother belong to?"
            instructionText="Select as many boxes as you wish to describe the ethnic group(s) the mother belongs to."
            options={[
              { value: 'NZ Eroupean', display: 'NZ Eroupean'},
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
            <Field
              name="mother.ethnicityDescription"
              component={renderField}
              type="text"
              placeholder="Please describe the mother’s ethnicity"
              validate={[required, maxLength30]}
            />
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
            type="text"
            label="Email address"
            instructionText=""
            validate={[email]}
          />

          <div className="form-actions">
            <button type="button" className="previous" onClick={this.props.onPrevious}>Previous</button>
            <button type="submit" className="button" disabled={submitting}>Next</button>
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
  validate
})(MotherDetailsForm)

const selector = formValueSelector('registration')
MotherDetailsForm = connect(
  state => ({
    ethnicGroups: selector(state, 'mother.ethnicGroups'),
  })
)(MotherDetailsForm)

export default MotherDetailsForm
