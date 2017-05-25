import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector} from 'redux-form'
import find from 'lodash/find'
import get from 'lodash/get'
import set from 'lodash/set'
import moment from 'moment'
import Accordion from './accordion'
import renderField from './render-field'
import renderDatepicker from './render-datepicker'
import renderRadioGroup from './render-radio-group'
import renderCheckboxGroup from './render-checkbox-group'
import renderCheckbox from './render-checkbox'
import renderPlacesAutocomplete from './render-places-autocomplete'
import CitizenshipQuestions from './citizenship-questions'
import { required, requiredWithMessage, number, email, maxLength30, validDate } from './validate'
import {
  ethnicGroups as ethnicGroupOptions,
  yesNo as yesNoOptions,
  yesNoNotSure as yesNoNotSureOptions
} from './options'
import {
  REQUIRE_MESSAGE,
  REQUIRE_MESSAGE_STREET,
  REQUIRE_MESSAGE_POSTCODE,
  WARNING_CITIZENSHIP,
  WARNING_FATHER_DATE_OF_BIRTH,
  REQUIRE_AT_LEAST_ONE
} from './validation-messages'

const validate = (values) => {
  const errors = {}

  const ethnicGroups = get(values, 'father.ethnicGroups')

  if (!ethnicGroups || !ethnicGroups.length) {
    set(errors, 'father.ethnicGroups', REQUIRE_MESSAGE)
  }

  if (!get(values, 'father.isMaoriDescendant')) {
    set(errors, 'father.isMaoriDescendant', REQUIRE_MESSAGE)
  }

  const assistedHumanReproduction = get(values, 'assistedHumanReproduction')
  const assistedHumanReproductionManConsented = get(values, 'assistedHumanReproductionManConsented')
  const assistedHumanReproductionWomanConsented = get(values, 'assistedHumanReproductionWomanConsented')
  const assistedHumanReproductionSpermDonor = get(values, 'assistedHumanReproductionSpermDonor')

  if (
    assistedHumanReproduction === 'yes' &&
    (
      !assistedHumanReproductionWomanConsented &&
      !assistedHumanReproductionManConsented &&
      !assistedHumanReproductionSpermDonor
    )
  ) {
    set(errors, 'assistedHumanReproductionSpermDonor', REQUIRE_AT_LEAST_ONE)
  }

  return errors
}

const warn = (values) => {
  const warnings = {}

  let dob = get(values, 'father.dateOfBirth')
  let childBirthDate = get(values, 'dateOfBirth')

  if (dob && childBirthDate) {
    if (typeof dob === 'string') {
      dob = moment(dob)
    }

    if (typeof childBirthDate === 'string') {
      childBirthDate = moment(childBirthDate)
    }

    if (dob.isValid() && childBirthDate.diff(dob, 'years') < 13) {
      set(warnings, 'father.dateOfBirth', WARNING_FATHER_DATE_OF_BIRTH)
    }
  }

  const isPermanentResident = get(values, 'father.isPermanentResident')
  const isNZRealmResident = get(values, 'father.isNZRealmResident')
  const isAuResidentOrCitizen = get(values, 'father.isAuResidentOrCitizen')

  if (
    isPermanentResident === 'no' &&
    isNZRealmResident === 'no' &&
    isAuResidentOrCitizen === 'no'
  ) {
    set(warnings, 'father.citizenshipWarning', WARNING_CITIZENSHIP)
  }

  return warnings
}

class FatherDetailsForm extends Component {
  constructor(props) {
    super(props)

    this.onEthnicGroupsChange = this.onEthnicGroupsChange.bind(this)
    this.onPlaceSelect = this.onPlaceSelect.bind(this)
    this.handleAssistedHumanReproductionChange = this.handleAssistedHumanReproductionChange.bind(this)
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

  handleAssistedHumanReproductionChange(e, newVal) {
    if (newVal === 'yes') {
      this.props.change('fatherKnown', '')
    } else {
      this.props.change('assistedHumanReproductionManConsented', false)
      this.props.change('assistedHumanReproductionWomanConsented', false)
      this.props.change('assistedHumanReproductionSpermDonor', false)
    }
  }

  renderFather() {
    const { ethnicGroups } = this.props
    return (
      <div className="component-grouping">
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
          validate={[required, validDate]}
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
          <div className="input-groups">
            <Field
              name="father.homeAddress1"
              component={renderPlacesAutocomplete}
              type="text"
              label="Street number and Street name"
              onPlaceSelect={this.onPlaceSelect}
              validate={[requiredWithMessage(REQUIRE_MESSAGE_STREET)]}
            />
            <Field
              name="father.homeAddress2"
              component={renderField}
              type="text"
              label="Suburb"
            />
            <Field
              name="father.homeAddress3"
              component={renderField}
              type="text"
              label="Town/City and Postcode"
              validate={[requiredWithMessage(REQUIRE_MESSAGE_POSTCODE)]}
            />
          </div>
        </fieldset>


        <Field
          name="father.isMaoriDescendant"
          component={renderRadioGroup}
          label="Is the father a descendant of a New Zealand Māori?"
          instructionText="This will not appear on the birth certificate"
          options={yesNoNotSureOptions}
        />

        <Field
          name="father.ethnicGroups"
          component={renderCheckboxGroup}
          label="Which ethnic group(s) does the father belong to?"
          instructionText="Select as many boxes as you wish to describe the ethnic group(s) the father belongs to."
          options={ethnicGroupOptions}
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

        <CitizenshipQuestions
          target="father"
          {...this.props}
        />

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
      </div>
    )
  }

  render() {
    const {
      assistedHumanReproduction,
      assistedHumanReproductionManConsented,
      assistedHumanReproductionWomanConsented,
      assistedHumanReproductionSpermDonor,
      fatherKnown, handleSubmit, submitting
    } = this.props

    return (
      <div>
        <h2><span className="visuallyhidden">Step</span> <span className="step-number">3</span> Matua <br/> Father/Other parent</h2>
        <div className="informative-text">
          You now need to give details of the child's father, if know. A reminder that it is an offence to provide false information and any person who provides false information is liable, on conviction, to imprisonment for up to 5 years.
        </div>
        <form onSubmit={handleSubmit(this.props.onSubmit)}>

          <Field
            name="assistedHumanReproduction"
            component={renderRadioGroup}
            label="Is the child born as a result of an assisted human reproduction procedure (such as artificial insemination)?"
            options={yesNoNotSureOptions}
            onChange={this.handleAssistedHumanReproductionChange}
            validate={[required]}
          />

          <div className="informative-text">
            <span>How to answer this section:</span>
            <br />
            <span>If the mother married, or entered into a civil union or de facto relationship with a man who consented to the mother undergoing the procedure, that man's details should be entered under the Father/other parent details. Note: The Donor is generally not the father on the birth certificate.</span>
          </div>

          { assistedHumanReproduction === 'yes' &&
            <div className="component-grouping">
              <Field
                name="assistedHumanReproductionManConsented"
                label="I am in a relationship with a man who consented to the procedure. I will name him as the child's father"
                component={renderCheckbox}
                disabled={assistedHumanReproductionWomanConsented || assistedHumanReproductionSpermDonor}
              />
              <div className="informative-text">
                If the mother married or entered into a civil union or de facto relationship with a woman who consented to the mother undergoing the procedure, that woman's details should be entered under the Father/other parent details. When you tick the box below all references to 'father' will be changed to 'other parent'.
              </div>
              <Field
                name="assistedHumanReproductionWomanConsented"
                label="I am in a relationship with a woman who consented to the procedure. I will name her as the child's other parent"
                component={renderCheckbox}
                disabled={assistedHumanReproductionManConsented || assistedHumanReproductionSpermDonor}
              />
              <div className="informative-text">
                If the mother isn't in a relationship with a partner that consented to the mother undergoing the procedure, then you don't need to complete the father/other parent section - you will be able to skip this step and the next step.
              </div>
              <Field
                name="assistedHumanReproductionSpermDonor"
                label="I used a sperm donor on my own without a consenting partner. I do not know who the father of the child is"
                component={renderCheckbox}
                disabled={assistedHumanReproductionManConsented || assistedHumanReproductionWomanConsented}
              />
            </div>
          }

          { (assistedHumanReproduction && assistedHumanReproduction !== 'yes') &&
            <div className="component-grouping">
              <Field
                name="fatherKnown"
                component={renderRadioGroup}
                label="Is the father known?"
                instructionText="The mother does not need to be in a relationship with the father for him to be named on the birth certificate"
                options={yesNoOptions}
                validate={[required]}
              />

              <div className="expandable-group secondary">
                <Accordion>
                  <Accordion.Toggle>
                    What if I don't want to name the child's father or other parent?
                  </Accordion.Toggle>
                  <Accordion.Content>
                    <p>If you know who the father is it may make it easier for you in the long term if you declare this now, especially if you want some financial support from the other parent. However there can be reasons why you may be reluctant to include them in the registration of birth. These could include:</p>
                    <ul>
                      <li>You're in a different relationship now</li>
                      <li>You're in a relationship with a woman and you want her to be the child's other parent</li>
                      <li>Naming the father may put you in danger</li>
                      <li>You can't be sure this person is definitely the father</li>
                    </ul>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec facilisis urna imperdiet sollicitudin pretium. Pellentesque non luctus nisi. Cras et leo vitae ligula interdum ultrices ac nec ligula. Donec dictum eleifend efficitur. Donec pharetra leo sit amet risus egestas ultrices. Praesent et ex cursus sem sodales mattis. Visit the <a href="https://www.govt.nz/browse/family-and-whanau/having-a-baby/registering-a-new-baby-and-getting-a-birth-certificate/#how-to-register-your-baby" target='_blank' rel='noreferrer noopener'>govt.nz site</a> for more information.</p>
                  </Accordion.Content>
                </Accordion>
              </div>
            </div>
          }

          {
            (
              fatherKnown === 'yes' ||
              (
                assistedHumanReproduction === 'yes' &&
                (assistedHumanReproductionManConsented || assistedHumanReproductionWomanConsented)
              )
            )
            && this.renderFather()
          }

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
  isCitizen: PropTypes.string,
  isNZRealmResident: PropTypes.string,
  isAuResidentOrCitizen: PropTypes.string,
  isPermanentResident: PropTypes.string,
  citizenshipSource: PropTypes.string,
  assistedHumanReproduction: PropTypes.string,
  assistedHumanReproductionManConsented: PropTypes.bool,
  assistedHumanReproductionWomanConsented: PropTypes.bool,
  assistedHumanReproductionSpermDonor: PropTypes.bool,
  fatherKnown: PropTypes.string,
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
  validate,
  warn
})(FatherDetailsForm)

const selector = formValueSelector('registration')
FatherDetailsForm = connect(
  state => ({
    ethnicGroups: selector(state, 'father.ethnicGroups'),
    isCitizen: selector(state, 'father.isCitizen'),
    isPermanentResident: selector(state, 'father.isPermanentResident'),
    isNZRealmResident: selector(state, 'father.isNZRealmResident'),
    isAuResidentOrCitizen: selector(state, 'father.isAuResidentOrCitizen'),
    citizenshipSource: selector(state, 'father.citizenshipSource'),
    assistedHumanReproduction: selector(state, 'assistedHumanReproduction'),
    assistedHumanReproductionManConsented: selector(state, 'assistedHumanReproductionManConsented'),
    assistedHumanReproductionWomanConsented: selector(state, 'assistedHumanReproductionWomanConsented'),
    assistedHumanReproductionSpermDonor: selector(state, 'assistedHumanReproductionSpermDonor'),
    fatherKnown: selector(state, 'fatherKnown')
  })
)(FatherDetailsForm)

export default FatherDetailsForm
