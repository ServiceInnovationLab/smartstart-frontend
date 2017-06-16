import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import find from 'lodash/find'
import get from 'lodash/get'
import set from 'lodash/set'
import makeFocusable from './make-focusable'
import Accordion from './accordion'
import renderField from './render-field'
import renderWarning from './render-warning'
import renderCustomSelect from './render-custom-select'
import renderDatepicker from './render-datepicker'
import renderBirthOrderSelector from './render-birth-order-selector'
import renderCheckboxGroup from './render-checkbox-group'
import renderRadioGroup from './render-radio-group'
import renderPlacesAutocomplete from './render-places-autocomplete'
import { required, requiredWithMessage, maxLength30, validName, validDate } from './validate'
import {
  ethnicGroups as ethnicGroupOptions,
  yesNo as yesNoOptions,
  yesNoNotSure as yesNoNotSureOptions
} from './options'
import {
  REQUIRE_MESSAGE,
  REQUIRE_MESSAGE_CHILD_FIRST_NAME,
  REQUIRE_MESSAGE_STREET,
  REQUIRE_MESSAGE_POSTCODE,
  LONG_NAME_WARNING_MESSAGE
} from './validation-messages'

const validate = (values) => {
  const errors = {}

  const oneOfMultiple = get(values, 'child.oneOfMultiple')
  const multipleBirthOrder = get(values, 'child.multipleBirthOrder')

  if (oneOfMultiple === 'yes' && !multipleBirthOrder) {
    set(errors, 'child.multipleBirthOrder', REQUIRE_MESSAGE)
  }

  const ethnicGroups = get(values, 'child.ethnicGroups')
  if (!ethnicGroups || !ethnicGroups.length) {
    set(errors, 'child.ethnicGroups', REQUIRE_MESSAGE)
  }

  return errors
}

const warn = (values) => {
  const warnings = {}
  const firstNames = get(values, 'child.firstNames')

  if (firstNames && firstNames.length > 70) {
    set(warnings, 'child.firstNames', 'Child\'s given name(s) exceeds 70 characters')
  }

  const surname = get(values, 'child.surname')

  if (surname) {
    if (firstNames && firstNames.length + surname.length > 100) {
      set(warnings, 'child.surname', 'Combined names exceed 100 characters')
    } else if (surname.length > 50) {
      set(warnings, 'child.surname', 'Child\'s surname exceeds 50 characters')
    }
  }

  if (get(warnings, 'child.firstNames') || get(warnings, 'child.surname')) {
    set(warnings, 'child.nameAdditionalWarning', LONG_NAME_WARNING_MESSAGE);
  }

  return warnings
}

const renderHospitalOption = option =>
  <div>{option.name}, {option.location}</div>

/**
 * TODO in transformation step:
 *
 * [ ] child.multipleBirthOrder --> birthOrderNumber / birthOrderTotal
 * [ ] remove child.nameAdditionalWarning
 * [ ] normalize birth date to correct format
 * [ ] transform child.ethnicGroups, move child.ethnicityDescription to child.ethnicGroups.other
 */
class ChildDetailsForm extends Component {
  constructor(props) {
    super(props)
    this.onMultipleBirthChange = this.onMultipleBirthChange.bind(this)
    this.onPlaceOfBirthChanged = this.onPlaceOfBirthChanged.bind(this)
    this.onEthnicGroupsChange = this.onEthnicGroupsChange.bind(this)
    this.onPlaceSelect = this.onPlaceSelect.bind(this)
  }

  onMultipleBirthChange(e, newVal) {
    // In case user already select birthOrder, we need to reset the selection when 'No' is selected
    if (newVal === 'no') {
      this.props.change('child.multipleBirthOrder', '')
    }
  }

  onPlaceOfBirthChanged(e, newVal) {
    if (newVal === 'hospital') {
      this.props.change('birthPlace.home', {})
      this.props.change('birthPlace.other', '')
    }
    if (newVal === 'home') {
      this.props.change('birthPlace.hospital', '')
      this.props.change('birthPlace.other', '')
    }
    if (newVal === 'other') {
      this.props.change('birthPlace.hospital', '')
      this.props.change('birthPlace.home', {})
    }
  }

  onEthnicGroupsChange(e, newVal, previousVal) {
    if (
      previousVal && previousVal.indexOf('Other') > -1 &&
      newVal && newVal.indexOf('Other') === -1
    ) {
      this.props.change('child.ethnicityDescription', '')
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

    this.props.change('birthPlace.home.line1', streetAddress)
    this.props.change('birthPlace.home.suburb', suburb)
    this.props.change('birthPlace.home.line2', `${town} ${postalCode}`)
  }

  render() {
    const { oneOfMultiple, birthPlaceCategory, ethnicGroups, handleSubmit, submitting } = this.props

    return (
      <div>
        <h2><span className="visuallyhidden">Step</span> <span className="step-number">1</span> Tamaiti <br/> Child</h2>

        <div className="instruction">
          <strong>Birth Registration is when you officially give your child a legal name.</strong><br/>
          <strong>The name should include a family name and one or more given names.</strong><br/>
          <strong>The child’s name will be registered exactly as you describe it here. There is a cost to change the name once it has been registered.</strong>
        </div>

        <div className="expandable-group primary">
          <Accordion>
            <Accordion.Toggle>
              What names are unacceptable?
            </Accordion.Toggle>
            <Accordion.Content>
              <p>The name or combination of names may not be acceptable if:</p>
              <ul>
                <li>It is offensive; or</li>
                <li>it is unreasonably long; or</li>
                <li>it includes or resembles an official title or rank; or</li>
                <li>Is spelt with numbers or symbols (e.g V8)</li>
              </ul>
            </Accordion.Content>
          </Accordion>

          <Accordion>
            <Accordion.Toggle>
              Can I enter names with macrons and international characters?
            </Accordion.Toggle>
            <Accordion.Content>
              <p>You may use macrons and international characters in your child’s name. The child’s name will use these characters on the birth certificate.</p>
            </Accordion.Content>
          </Accordion>

          <Accordion>
            <Accordion.Toggle>
              Can I give my child a single name?
            </Accordion.Toggle>
            <Accordion.Content>
              <p>Your child may have a single name where religious or philosophical beliefs or cultural traditions require the child to have one name. In these cases please describe the reasons for a single name.</p>
            </Accordion.Content>
          </Accordion>
        </div>

        <form onSubmit={handleSubmit}>
          <Field
            name="child.firstNames"
            component={renderField}
            type="text"
            placeholder="First name"
            label="Child's given name(s)"
            instructionText="Enter the child's first name(s) and any middle names. The order you enter the names here is how they will appear on the birth certificate"
            validate={[requiredWithMessage(REQUIRE_MESSAGE_CHILD_FIRST_NAME), validName]}
          />

          <Field
            name="child.surname"
            component={renderField}
            type="text"
            placeholder="E.g Smith"
            label="Child's surname"
            validate={[required, validName]}
          />

          <Field
            name="child.nameAdditionalWarning"
            component={renderWarning}
          />

          <Field
            name="child.sex"
            component={renderRadioGroup}
            label="Child's sex"
            options={[
              { value: 'male', display: 'Male'},
              { value: 'female', display: 'Female'}
            ]}
            validate={[required]}
          />

          <Field
            name="child.stillBorn"
            component={renderRadioGroup}
            label="Was this child alive at birth?"
            options={yesNoOptions}
            validate={[required]}
          />

          <div className="expandable-group secondary">
            <Accordion>
              <Accordion.Toggle>
                What is a stillbirth?
              </Accordion.Toggle>
              <Accordion.Content>
                <p>A baby is stillborn if the baby is not alive at birth when born, and either;</p>
                <ul>
                  <li>weighed 400g or more at birth, or</li>
                  <li>the baby is delivered after the 20th week of the pregnancy</li>
                </ul>
                <p>You still need to register the birth. If you don’t want to give the baby a first name, you can choose to leave that field blank by adding a dash (-) into the field. A pregnancy miscarriage occurs when the baby is not born alive, and the before the 20th week of the pregnancy.</p>
              </Accordion.Content>
            </Accordion>
          </div>

          <Field
            name="child.birthDate"
            component={renderDatepicker}
            label="The child's date of birth"
            validate={[required, validDate]}
          />

          <Field
            name="child.oneOfMultiple"
            component={renderRadioGroup}
            label="Is this child one of a multiple birth (twins, triplets, etc)"
            options={yesNoOptions}
            onChange={this.onMultipleBirthChange}
            validate={[required]}
          />

          { oneOfMultiple === 'yes' &&
            <div className="conditional-field">
              <Field
                name="child.multipleBirthOrder"
                component={renderBirthOrderSelector}
                label="What is the birth order for this child?"
              />
            </div>
          }

          <Field
            name="birthPlace.category"
            component={renderRadioGroup}
            label="Where was the child born?"
            options={[
              { value: 'hospital', display: 'Hospital'},
              { value: 'home', display: 'Home'},
              { value: 'other', display: 'Other'}
            ]}
            onChange={this.onPlaceOfBirthChanged}
            validate={[required]}
          />

          { birthPlaceCategory === 'hospital' &&
            <div className="conditional-field">
              <Field
                name="birthPlace.hospital"
                component={renderCustomSelect}
                options={this.props.birthFacilities}
                valueKey="identifier"
                labelKey="name"
                placeholder="Please select"
                optionRenderer={renderHospitalOption}
                valueRenderer={renderHospitalOption}
                searchable={true}
                label="Hospital name"
                validate={[required]}
              />
            </div>
          }

          { birthPlaceCategory === 'home' &&
            <div className="conditional-field">
              <Field
                name="birthPlace.home.line1"
                component={renderPlacesAutocomplete}
                type="text"
                label="Street number and Street name"
                onPlaceSelect={this.onPlaceSelect}
                validate={[requiredWithMessage(REQUIRE_MESSAGE_STREET)]}
              />
              <Field
                name="birthPlace.home.suburb"
                component={renderField}
                type="text"
                label="Suburb"
              />
              <Field
                name="birthPlace.home.line2"
                component={renderField}
                type="text"
                label="Town/City and Postcode"
                validate={[requiredWithMessage(REQUIRE_MESSAGE_POSTCODE)]}
              />
            </div>
          }

          { birthPlaceCategory === 'other' &&
            <div className="conditional-field">
              <Field
                name="birthPlace.other"
                component={renderField}
                type="text"
                instructionText="Describe the circumstances of the birth. If you went to a hospital please include the name of the hospital."
                validate={[required]}
              />
            </div>
          }

          <Field
            name="child.maoriDescendant"
            component={renderRadioGroup}
            label="Is this child a descendant of a New Zealand Māori?"
            instructionText="This will not appear on the birth certificate"
            options={yesNoNotSureOptions}
            validate={[required]}
          />

          <Field
            name="child.ethnicGroups"
            component={renderCheckboxGroup}
            label="Which ethnic group(s) does this child belong to?"
            instructionText="Select as many boxes as you wish to describe the ethnic group(s) this child belongs to."
            options={ethnicGroupOptions}
            onChange={this.onEthnicGroupsChange}
          />

          { ethnicGroups && ethnicGroups.indexOf('Other') > -1 &&
            <div className="conditional-field">
              <Field
                name="child.ethnicityDescription"
                component={renderField}
                type="text"
                placeholder="Please describe the child’s ethnicity"
                validate={[required, maxLength30]}
              />
            </div>
          }

          <div className="form-actions">
            <div />
            <button type="submit" className="next" disabled={submitting}>Next</button>
          </div>
        </form>
      </div>
    )
  }
}

ChildDetailsForm.propTypes = {
  birthFacilities: PropTypes.array,
  oneOfMultiple: PropTypes.string,
  birthPlaceCategory: PropTypes.string,
  ethnicGroups: PropTypes.array,
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  change: PropTypes.func,     // passed via reduxForm
  submitting: PropTypes.bool, // passed via reduxForm
  pristine: PropTypes.bool,   // passed via reduxForm
}

// Decorate the form component
ChildDetailsForm = reduxForm({
  form: 'registration', // same name for all wizard's form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  warn
})(ChildDetailsForm)

const selector = formValueSelector('registration')

// We need to know these field's value to conditionally render some other fields
// check render method for more detail
ChildDetailsForm = connect(
  state => ({
    birthFacilities: get(state, 'birthRegistration.birthFacilities'),
    initialValues: get(state, 'birthRegistration.savedRegistrationForm'),
    oneOfMultiple: selector(state, 'child.oneOfMultiple'),
    birthPlaceCategory: selector(state, 'birthPlace.category'),
    ethnicGroups: selector(state, 'child.ethnicGroups') || []
  })
)(ChildDetailsForm)

export default makeFocusable(ChildDetailsForm)
