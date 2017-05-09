import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import moment from 'moment'
import get from 'lodash/get'
import Accordion from './accordion'
import renderField from './render-field'
import renderSelect from './render-select'
import renderDatepicker from './render-datepicker'
import renderBirthOrderSelector from './render-birth-order-selector'
import renderCheckboxGroup from './render-checkbox-group'
import renderRadioGroup from './render-radio-group'
import { required, maxLength30 } from './validate'
import {
  REQUIRE_MESSAGE,
  INVALID_DATE_MESSAGE,
  FUTURE_DATE_MESSAGE
} from './validation-messages'

const validate = (values) => {
  const errors = {}

  if (!values.sex) {
    errors.sex = REQUIRE_MESSAGE
  }

  if (!values.aliveAtBirth) {
    errors.aliveAtBirth = REQUIRE_MESSAGE
  }

  if (!values.dateOfBirth) {
    errors.dateOfBirth = REQUIRE_MESSAGE
  } else {
    if (!values.dateOfBirth.isValid()) {
      errors.dateOfBirth = INVALID_DATE_MESSAGE
    } else if (values.dateOfBirth.isAfter(moment())) {
      errors.dateOfBirth = FUTURE_DATE_MESSAGE
    }
  }

  if (!values.multipleBirth) {
    errors.multipleBirth = REQUIRE_MESSAGE
  }

  if (values.multipleBirth === 'yes' && !values.multipleBirthOrder) {
    errors.multipleBirthOrder = REQUIRE_MESSAGE
  }

  if (!values.placeOfBirth) {
    errors.placeOfBirth = REQUIRE_MESSAGE
  }

  if (!values.isMaoriDescendant) {
    errors.isMaoriDescendant = REQUIRE_MESSAGE
  }

  if (!values.ethnicGroups || !values.ethnicGroups.length) {
    errors.ethnicGroups = REQUIRE_MESSAGE
  }

  return errors
}

class ChildDetailsForm extends Component {
  constructor(props) {
    super(props)
    this.onMultipleBirthChange = this.onMultipleBirthChange.bind(this)
    this.onPlaceOfBirthChanged = this.onPlaceOfBirthChanged.bind(this)
    this.onEthnicGroupsChange = this.onEthnicGroupsChange.bind(this)
  }

  onMultipleBirthChange(e, newVal) {
    // In case user already select birthOrder, we need to reset the selection when 'No' is selected
    if (newVal === 'no') {
      this.props.change('multipleBirthOrder', '')
    }
  }

  onPlaceOfBirthChanged(e, newVal) {
    if (newVal === 'hospital') {
      this.props.change('birthPlaceAddress1', '')
      this.props.change('birthPlaceAddress2', '')
      this.props.change('birthPlaceOther', '')
    }
    if (newVal === 'home') {
      this.props.change('hospitalName', '')
      this.props.change('birthPlaceOther', '')
    }
    if (newVal === 'other') {
      this.props.change('hospitalName', '')
      this.props.change('birthPlaceAddress1', '')
      this.props.change('birthPlaceAddress2', '')
    }
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
    const { multipleBirth, placeOfBirth, ethnicGroups, handleSubmit, submitting } = this.props

    return (
      <div>
        <h2>Tamaiti <br/> Child</h2>

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

        <form onSubmit={handleSubmit(this.props.onSubmit)}>
          <Field
            name="firstName"
            component={renderField}
            type="text"
            placeholder="First name"
            label="Child's given names"
            validate={[required]}
          />

          <Field
            name="lastName"
            component={renderField}
            type="text"
            placeholder="E.g Williscroft"
            label="Child's family name"
            validate={[required]}
          />

          <Field
            name="sex"
            component={renderRadioGroup}
            label="Child's sex"
            options={[
              { value: 'male', display: 'Male'},
              { value: 'female', display: 'Female'}
            ]}
          />

          <Field
            name="aliveAtBirth"
            component={renderRadioGroup}
            label="Was this child alive at birth?"
            options={[
              { value: 'yes', display: 'Yes'},
              { value: 'no', display: 'No'}
            ]}
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
            name="dateOfBirth"
            component={renderDatepicker}
            label="The child's date of birth"
          />

          <Field
            name="multipleBirth"
            component={renderRadioGroup}
            label="Is this child one of a multiple birth (twins, triplets, etc)"
            options={[
              { value: 'yes', display: 'Yes'},
              { value: 'no', display: 'No'}
            ]}
            onChange={this.onMultipleBirthChange}
          />

          { multipleBirth === 'yes' &&
            <div className="conditional-field">
              <Field
                name="multipleBirthOrder"
                component={renderBirthOrderSelector}
                label="What is the birth order for this child?"
              />
            </div>
          }

          <Field
            name="placeOfBirth"
            component={renderRadioGroup}
            label="Where was the child born?"
            options={[
              { value: 'hospital', display: 'Hospital'},
              { value: 'home', display: 'Home'},
              { value: 'other', display: 'Other'}
            ]}
            onChange={this.onPlaceOfBirthChanged}
          />

          { placeOfBirth === 'hospital' &&
            <div className="conditional-field">
              <Field
                name="hospitalName"
                component={renderSelect}
                options={['Hospital One', 'Hospital Two', 'Hospital Three']}
                label="Hospital name"
                validate={[required]}
              />
            </div>
          }

          { placeOfBirth === 'home' &&
            <div className="conditional-field">
              <Field
                name="birthPlaceAddress1"
                component={renderField}
                type="text"
                label="Street number, Street Name, Suburb"
                validate={[required]}
              />
              <Field
                name="birthPlaceAddress2"
                component={renderField}
                type="text"
                label="Town/City and Postcode"
                validate={[required]}
              />
            </div>
          }

          { placeOfBirth === 'other' &&
            <div className="conditional-field">
              <Field
                name="birthPlaceOther"
                component={renderField}
                type="text"
                instructionText="Describe the circumstances of the birth. If you went to a hospital please include the name of the hospital."
                validate={[required]}
              />
            </div>
          }

          <Field
            name="isMaoriDescendant"
            component={renderRadioGroup}
            label="Is this child a descendant of a New Zealand Māori?"
            options={[
              { value: 'yes', display: 'Yes'},
              { value: 'no', display: 'No'},
              { value: 'notsure', display: 'Not sure'}
            ]}
          />

          <Field
            name="ethnicGroups"
            component={renderCheckboxGroup}
            label="Which ethnic group(s) does this child belong to?"
            instructionText="Select as many boxes as you wish to describe the ethnic group(s) this child belongs to."
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
                name="ethnicityDescription"
                component={renderField}
                type="text"
                placeholder="Please describe the child’s ethnicity"
                validate={[required, maxLength30]}
              />
            </div>
          }

          <div className="form-actions">
            <button type="submit" className="button" disabled={submitting}>Next</button>
          </div>
        </form>
      </div>
    )
  }
}

ChildDetailsForm.propTypes = {
  multipleBirth: PropTypes.string,
  placeOfBirth: PropTypes.string,
  ethnicGroups: PropTypes.array,
  onSubmit: PropTypes.func,
  handleSubmit: PropTypes.func,
  change: PropTypes.func,     // passed via reduxForm
  submitting: PropTypes.bool, // passed via reduxForm
  pristine: PropTypes.bool,   // passed via reduxForm
}

// Decorate the form component
ChildDetailsForm = reduxForm({
  form: 'registration', // same name for all wizard's form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate
})(ChildDetailsForm)

const selector = formValueSelector('registration')

// We need to know these field's value to conditionally render some other fields
// check render method for more detail
ChildDetailsForm = connect(
  state => ({
    initialValues: get(state, 'savedRegistrationForm.data'),
    multipleBirth: selector(state, 'multipleBirth'),
    placeOfBirth: selector(state, 'placeOfBirth'),
    ethnicGroups: selector(state, 'ethnicGroups')
  })
)(ChildDetailsForm)

export default ChildDetailsForm
