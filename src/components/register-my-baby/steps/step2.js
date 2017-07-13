import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector} from 'redux-form'
import find from 'lodash/find'
import get from 'lodash/get'
import set from 'lodash/set'
import makeFocusable from '../hoc/make-focusable'
import makeMandatoryLabel, { makeMandatoryAriaLabel } from '../hoc/make-mandatory-label'
import renderField from '../fields/render-field'
import renderDatepicker from '../fields/render-datepicker'
import renderRadioGroup from '../fields/render-radio-group'
import renderCheckboxGroup from '../fields/render-checkbox-group'
import renderPlacesAutocomplete from '../fields/render-places-autocomplete'
import CitizenshipQuestions from '../citizenship-questions'
import { required, requiredWithMessage, email, maxLength30, validDate, validAlpha, validCharStrict } from '../validate'
import { maxLength } from '../normalize'
import {
  ethnicGroups as ethnicGroupOptions,
  yesNoNotSure as yesNoNotSureOptions
} from '../options'
import warn from '../warn'
import {
  REQUIRE_MESSAGE,
  REQUIRE_MESSAGE_STREET,
  REQUIRE_MESSAGE_POSTCODE
} from '../validation-messages'

const validate = (values) => {
  const errors = {}

  const ethnicGroups = get(values, 'mother.ethnicGroups')

  if (!ethnicGroups || !ethnicGroups.length) {
    set(errors, 'mother.ethnicGroups', REQUIRE_MESSAGE)
  }

  return errors
}

class MotherDetailsForm extends Component {
  constructor(props) {
    super(props)

    this.onEthnicGroupsChange = this.onEthnicGroupsChange.bind(this)
    this.onPlaceSelect = this.onPlaceSelect.bind(this)
  }

  onEthnicGroupsChange(e, newVal, previousVal) {
    if (
      previousVal && previousVal.indexOf('other') > -1 &&
      newVal && newVal.indexOf('other') === -1
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

    this.props.change('mother.homeAddress.line1', maxLength(50)(streetAddress))
    this.props.change('mother.homeAddress.suburb', maxLength(25)(suburb))
    this.props.change('mother.homeAddress.line2', maxLength(75)(`${town} ${postalCode}`))
  }

  render() {
    const { ethnicGroups, handleSubmit, submitting } = this.props
    return (
      <div>
        <h2><span className="visuallyhidden">Step</span> <span className="step-number">2</span> Whaea <br/> Mother</h2>
        <form onSubmit={handleSubmit(this.props.onSubmit)}>
          <Field
            name="mother.firstNames"
            component={renderField}
            type="text"
            label={makeMandatoryLabel("All first name(s) mother is currently known by")}
            instructionText="Enter all current first and given names. If any differ from names given at birth, those names can be entered below."
            validate={[required, validAlpha]}
            normalize={maxLength(75)}
          />

          <Field
            name="mother.surname"
            component={renderField}
            type="text"
            label={makeMandatoryLabel("Surname of mother (currently known by)")}
            instructionText="Enter all current surnames or family names. If any differ from names at birth, those names can be entered below."
            validate={[required, validAlpha]}
            normalize={maxLength(75)}
          />

          <Field
            name="mother.firstNamesAtBirth"
            component={renderField}
            type="text"
            label="All first name(s) of mother at birth (if different from current name)"
            instructionText="Enter the name given at birth (if it differs from the above). If adopted, please enter the name/s given when adopted not before adoption (if known)"
            validate={[validAlpha]}
            normalize={maxLength(75)}
          />

          <Field
            name="mother.surnameAtBirth"
            component={renderField}
            type="text"
            label="Surname of mother at birth (if different from current name)"
            instructionText="Enter the surname or family name at birth (if it differs). If adopted, please enter the surname when adopted not before adoption (if known)"
            validate={[validAlpha]}
            normalize={maxLength(75)}
          />

          <Field
            name="mother.occupation"
            component={renderField}
            type="text"
            label={makeMandatoryLabel("Usual occupation, profession or job of mother")}
            placeholder="e.g. Teacher"
            instructionText="Please enter the mother's type of occupation not the name of the mother's employer"
            validate={[required, validCharStrict]}
            normalize={maxLength(60)}
          />

          <Field
            name="mother.dateOfBirth"
            component={renderDatepicker}
            label={makeMandatoryLabel("Mother's date of birth")}
            validate={[required, validDate]}
          />

          <Field
            name="mother.placeOfBirth"
            component={renderField}
            type="text"
            label={makeMandatoryLabel("Place of Birth - City/town")}
            placeholder="e.g. Auckland"
            validate={[required, validAlpha]}
            normalize={maxLength(40)}
          />

          <Field
            name="mother.countryOfBirth"
            component={renderField}
            type="text"
            label="Place of Birth - Country (if born overseas)"
            placeholder="e.g. Australia"
            validate={[validAlpha]}
            normalize={maxLength(19)}
          />

          <fieldset>
            <legend>Home address</legend>
            <div className="input-groups">
              <Field
                name="mother.homeAddress.line1"
                component={renderPlacesAutocomplete}
                type="text"
                label={makeMandatoryLabel("Street number and Street name")}
                onPlaceSelect={this.onPlaceSelect}
                validate={[requiredWithMessage(REQUIRE_MESSAGE_STREET)]}
                normalize={maxLength(50)}
              />
              <Field
                name="mother.homeAddress.suburb"
                component={renderField}
                type="text"
                label="Suburb"
                normalize={maxLength(25)}
              />
              <Field
                name="mother.homeAddress.line2"
                component={renderField}
                type="text"
                label={makeMandatoryLabel("Town/City and Postcode")}
                validate={[requiredWithMessage(REQUIRE_MESSAGE_POSTCODE)]}
                normalize={maxLength(75)}
              />
            </div>
          </fieldset>


          <Field
            name="mother.maoriDescendant"
            component={renderRadioGroup}
            label={makeMandatoryLabel("Is the mother a descendant of a New Zealand Māori?")}
            instructionText="This will not appear on the birth certificate"
            options={yesNoNotSureOptions}
            validate={[required]}
          />

          <Field
            name="mother.ethnicGroups"
            component={renderCheckboxGroup}
            label={makeMandatoryLabel("Which ethnic group(s) does the mother belong to?")}
            instructionText="Select as many boxes as you wish to describe the ethnic group(s) the mother belongs to."
            options={ethnicGroupOptions}
            onChange={this.onEthnicGroupsChange}
          />

          { ethnicGroups && ethnicGroups.indexOf('other') > -1 &&
            <div className="conditional-field">
              <Field
                name="mother.ethnicityDescription"
                component={renderField}
                type="text"
                placeholder="Please describe the mother’s ethnicity"
                ariaLabel={makeMandatoryAriaLabel("State other ethnicity")}
                validate={[required, maxLength30, validCharStrict]}
              />
            </div>
          }

          <CitizenshipQuestions
            target="mother"
            {...this.props}
          />

          <Field
            name="mother.daytimePhone"
            component={renderField}
            type="text"
            label="Daytime contact phone number"
            instructionText="Please include the area code or suffix"
            validate={[validCharStrict]}
            normalize={maxLength(20)}
          />

          <Field
            name="mother.alternativePhone"
            component={renderField}
            type="text"
            label="Alternative contact phone number"
            instructionText="Please include the area code or suffix"
            validate={[validCharStrict]}
            normalize={maxLength(20)}
          />

          <Field
            name="mother.email"
            component={renderField}
            type="email"
            label="Email address"
            instructionText=""
            validate={[email]}
            normalize={maxLength(60)}
          />

          <div className="form-actions">
            <button type="button" className="previous" onClick={this.props.onPrevious}>Back</button>
            <div>
              { this.props.isReviewing &&
                <button type="button" className="review" onClick={handleSubmit(this.props.onComebackToReview)}>Return to review</button>
              }
              <button type="submit" className="next" disabled={submitting}>Next</button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

MotherDetailsForm.propTypes = {
  ethnicGroups: PropTypes.array,
  isCitizen: PropTypes.string,
  isNZRealmResident: PropTypes.string,
  isAuResidentOrCitizen: PropTypes.string,
  isPermanentResident: PropTypes.string,
  citizenshipSource: PropTypes.string,
  onSubmit: PropTypes.func,
  onPrevious: PropTypes.func,
  isReviewing: PropTypes.bool,
  onComebackToReview: PropTypes.func,
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
    isCitizen: selector(state, 'mother.isCitizen'),
    isPermanentResident: selector(state, 'mother.isPermanentResident'),
    isNZRealmResident: selector(state, 'mother.isNZRealmResident'),
    isAuResidentOrCitizen: selector(state, 'mother.isAuResidentOrCitizen'),
    citizenshipSource: selector(state, 'mother.citizenshipSource'),
  })
)(MotherDetailsForm)

export default makeFocusable(MotherDetailsForm)
