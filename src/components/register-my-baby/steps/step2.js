import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector} from 'redux-form'
import find from 'lodash/find'
import get from 'lodash/get'
import makeFocusable from '../hoc/make-focusable'
import Accordion from '../accordion'
import SaveAsDraftButton from '../save-as-draft-button'
import CitizenshipQuestions from '../citizenship-questions'
import { maxLength } from '../normalize'
import validate from './validation'
import warn from '../warn'
import schema from './schemas/step2'
import getFieldProps from './get-field-props'

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
      this.props.change('mother.ethnicityDescription', '')
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
        <h2 className="step-heading">
          <span className="visuallyhidden">Step</span>
          <span className="step-number">2</span>
          Whaea <br/>
          <span className="english">Mother</span>
        </h2>
        <SaveAsDraftButton step="2" />

        <div className="instruction">
          <strong>This section is where you give the details of the child's mother.</strong>
        </div>

        <form onSubmit={handleSubmit(this.props.onSubmit)}>
          <Field {...getFieldProps(schema, 'mother.firstNames')} />
          <Field {...getFieldProps(schema, 'mother.surname')} />
          <Field {...getFieldProps(schema, 'mother.firstNamesAtBirth')} />
          <Field {...getFieldProps(schema, 'mother.surnameAtBirth')} />
          <Field {...getFieldProps(schema, 'mother.occupation')} />


          <div className="expandable-group secondary">
            <Accordion>
              <Accordion.Toggle>
                What if the mother doesn’t have an occupation?
              </Accordion.Toggle>
              <Accordion.Content>
                <p>If the mother isn't currently employed, you can enter something like 'mother', 'home-maker', or 'unemployed'.</p>
              </Accordion.Content>
            </Accordion>
          </div>

          <Field {...getFieldProps(schema, 'mother.dateOfBirth')} />
          <Field {...getFieldProps(schema, 'mother.placeOfBirth')} />
          <Field {...getFieldProps(schema, 'mother.countryOfBirth')} />

          <fieldset>
            <legend>Home address</legend>
            <div className="input-groups">
              <Field {...getFieldProps(schema, 'mother.homeAddress.line1')} onPlaceSelect={this.onPlaceSelect}/>
              <Field {...getFieldProps(schema, 'mother.homeAddress.suburb')} />
              <Field {...getFieldProps(schema, 'mother.homeAddress.line2')} />
            </div>
          </fieldset>


          <Field {...getFieldProps(schema, 'mother.maoriDescendant')} />
          <Field {...getFieldProps(schema, 'mother.ethnicGroups')} onChange={this.onEthnicGroupsChange} />

          { ethnicGroups && ethnicGroups.indexOf('other') > -1 &&
            <div className="conditional-field">
              <Field {...getFieldProps(schema, 'mother.ethnicityDescription')} />
            </div>
          }

          <CitizenshipQuestions
            target="mother"
            schema={schema}
            {...this.props}
          />

          <Field {...getFieldProps(schema, 'mother.daytimePhone')} />
          <Field {...getFieldProps(schema, 'mother.alternativePhone')} />
          <Field {...getFieldProps(schema, 'mother.email')} />

          <div className="form-actions">
            { this.props.isReviewing &&
              <div className="review-btn-positioner">
                <button type="button" className="review" onClick={handleSubmit(this.props.onComebackToReview)}>Return to review</button>
              </div>
            }
            { this.props.isReviewing ?
              <button type="button" className="previous" onClick={handleSubmit(this.props.onPrevious)}>Back</button>:
              <button type="button" className="previous" onClick={this.props.onPrevious}>Back</button>
            }
            <button type="submit" className="next" disabled={submitting}>Next</button>
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
    initialValues: get(state, 'birthRegistration.savedRegistrationForm'),
    ethnicGroups: selector(state, 'mother.ethnicGroups'),
    isCitizen: selector(state, 'mother.isCitizen'),
    isPermanentResident: selector(state, 'mother.isPermanentResident'),
    isNZRealmResident: selector(state, 'mother.isNZRealmResident'),
    isAuResidentOrCitizen: selector(state, 'mother.isAuResidentOrCitizen'),
    citizenshipSource: selector(state, 'mother.citizenshipSource'),
  })
)(MotherDetailsForm)

export default makeFocusable(MotherDetailsForm)
