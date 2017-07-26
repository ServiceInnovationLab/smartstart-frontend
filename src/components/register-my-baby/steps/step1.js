import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import find from 'lodash/find'
import get from 'lodash/get'
import makeFocusable from '../hoc/make-focusable'
import Accordion from '../accordion'
import { maxLength } from '../normalize'
import validate from './validation'
import schema from './schemas/step1'
import getFieldProps from './get-field-props'

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
      previousVal && previousVal.indexOf('other') > -1 &&
      newVal && newVal.indexOf('other') === -1
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

    this.props.change('birthPlace.home.line1', maxLength(33)(streetAddress))
    this.props.change('birthPlace.home.suburb', maxLength(20)(suburb))
    this.props.change('birthPlace.home.line2', maxLength(20)(`${town} ${postalCode}`))
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
          <Field {...getFieldProps(schema, 'child.firstNames')} />
          <Field {...getFieldProps(schema, 'child.surname')} />
          <Field {...getFieldProps(schema, 'child.sex')} />
          <Field {...getFieldProps(schema, 'child.stillBorn')} />

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

          <Field {...getFieldProps(schema, 'child.birthDate')} />
          <Field {...getFieldProps(schema, 'child.oneOfMultiple')} onChange={this.onMultipleBirthChange}/>

          { oneOfMultiple === 'yes' &&
            <div className="conditional-field">
              <Field {...getFieldProps(schema, 'child.multipleBirthOrder')} />
            </div>
          }

          <Field {...getFieldProps(schema, 'birthPlace.category')} onChange={this.onPlaceOfBirthChanged} />

          { birthPlaceCategory === 'hospital' &&
            <div className="conditional-field">
              <Field {...getFieldProps(schema, 'birthPlace.hospital')} options={this.props.birthFacilities} />
            </div>
          }

          { birthPlaceCategory === 'home' &&
            <div className="conditional-field">
              <Field {...getFieldProps(schema, 'birthPlace.home.line1')} onPlaceSelect={this.onPlaceSelect} />
              <Field {...getFieldProps(schema, 'birthPlace.home.suburb')} />
              <Field {...getFieldProps(schema, 'birthPlace.home.line2')} />
            </div>
          }

          { birthPlaceCategory === 'other' &&
            <div className="conditional-field">
              <Field {...getFieldProps(schema, 'birthPlace.other')} />
            </div>
          }

          <Field {...getFieldProps(schema, 'child.maoriDescendant')} />
          <Field {...getFieldProps(schema, 'child.ethnicGroups')} onChange={this.onEthnicGroupsChange} />

          { ethnicGroups && ethnicGroups.indexOf('other') > -1 &&
            <div className="conditional-field">
              <Field {...getFieldProps(schema, 'child.ethnicityDescription')} />
            </div>
          }

          <div className="form-actions">
            <div />
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

ChildDetailsForm.propTypes = {
  birthFacilities: PropTypes.array,
  oneOfMultiple: PropTypes.string,
  birthPlaceCategory: PropTypes.string,
  ethnicGroups: PropTypes.array,
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  isReviewing: PropTypes.bool,
  onComebackToReview: PropTypes.func,
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
    birthFacilities: get(state, 'birthRegistration.birthFacilities'),
    initialValues: get(state, 'birthRegistration.savedRegistrationForm'),
    oneOfMultiple: selector(state, 'child.oneOfMultiple'),
    birthPlaceCategory: selector(state, 'birthPlace.category'),
    ethnicGroups: selector(state, 'child.ethnicGroups') || []
  })
)(ChildDetailsForm)

export default makeFocusable(ChildDetailsForm)
