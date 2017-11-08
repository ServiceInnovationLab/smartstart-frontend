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
import warn from '../warn'
import validate from './validation'
import schema from './schemas/step3'
import getFieldProps from './get-field-props'
import FatherText from './schemas/father-text'

class FatherDetailsForm extends Component {
  constructor(props) {
    super(props)

    this.onEthnicGroupsChange = this.onEthnicGroupsChange.bind(this)
    this.onPlaceSelect = this.onPlaceSelect.bind(this)
    this.onParentSameAddressChange = this.onParentSameAddressChange.bind(this)
    this.handleAssistedHumanReproductionChange = this.handleAssistedHumanReproductionChange.bind(this)
  }

  onEthnicGroupsChange(e, newVal, previousVal) {
    if (
      previousVal && previousVal.indexOf('other') > -1 &&
      newVal && newVal.indexOf('Other') === -1
    ) {
      this.props.change('father.ethnicityDescription', '')
    }
  }

  onParentSameAddressChange(e, newVal) {
    if (newVal) {
      const { motherHomeAddress } = this.props;
      this.props.change('father.homeAddress.line1', motherHomeAddress.line1)
      this.props.change('father.homeAddress.suburb', motherHomeAddress.suburb)
      this.props.change('father.homeAddress.line2', motherHomeAddress.line2)
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

    this.props.change('father.homeAddress.line1', maxLength(50)(streetAddress))
    this.props.change('father.homeAddress.suburb', maxLength(25)(suburb))
    this.props.change('father.homeAddress.line2', maxLength(75)(`${town} ${postalCode}`))
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
        <Field {...getFieldProps(schema, 'father.firstNames')} />
        <Field {...getFieldProps(schema, 'father.surname')} />
        <Field {...getFieldProps(schema, 'father.firstNamesAtBirth')} />
        <Field {...getFieldProps(schema, 'father.surnameAtBirth')} />
        <Field {...getFieldProps(schema, 'father.occupation')} />

        <div className="expandable-group secondary">
          <Accordion>
            <Accordion.Toggle>
              <div>
                What if the <FatherText /> doesn’t have an occupation?
              </div>
            </Accordion.Toggle>
            <Accordion.Content>
              <p>If the <FatherText /> isn't currently employed, you can enter something like '<FatherText />', 'home-maker', or 'unemployed'.</p>
            </Accordion.Content>
          </Accordion>
        </div>

        <Field {...getFieldProps(schema, 'father.dateOfBirth')} />
        <Field {...getFieldProps(schema, 'father.placeOfBirth')} />
        <Field {...getFieldProps(schema, 'father.countryOfBirth')} />

        <fieldset>
          <legend>Home address</legend>
          <div className="input-groups">
            <Field {...getFieldProps(schema, 'parentSameAddress')} onChange={this.onParentSameAddressChange}/>
            <Field {...getFieldProps(schema, 'father.homeAddress.line1')} onPlaceSelect={this.onPlaceSelect}/>
            <Field {...getFieldProps(schema, 'father.homeAddress.suburb')} />
            <Field {...getFieldProps(schema, 'father.homeAddress.line2')} />
          </div>
        </fieldset>


        <Field {...getFieldProps(schema, 'father.maoriDescendant')} />
        <Field {...getFieldProps(schema, 'father.ethnicGroups')} onChange={this.onEthnicGroupsChange} />

        { ethnicGroups && ethnicGroups.indexOf('other') > -1 &&
          <div className="conditional-field">
            <Field {...getFieldProps(schema, 'father.ethnicityDescription')} />
          </div>
        }

        <CitizenshipQuestions
          target="father"
          schema={schema}
          {...this.props}
        />

        <Field {...getFieldProps(schema, 'father.daytimePhone')} />
        <Field {...getFieldProps(schema, 'father.alternativePhone')} />
        <Field {...getFieldProps(schema, 'father.email')} />
      </div>
    )
  }

  render() {
    const {
      assistedHumanReproduction,
      assistedHumanReproductionManConsented,
      assistedHumanReproductionWomanConsented,
      assistedHumanReproductionSpermDonor,
      assistedHumanReproductionTouched,
      fatherKnown, handleSubmit, submitting
    } = this.props

    return (
      <div>
        <h2 className="step-heading">
          <span className="visuallyhidden">Step</span>
          <span className="step-number">3</span>
          Matua/Tētahi Atu Matua <br/>
          <span className="english">Father/Other parent</span>
        </h2>
        <SaveAsDraftButton step="3" />

        <div className="informative-text intro">
          This section is where you give the details of the child's Father (if known), or the other parent of the child.<br/>
          If you don’t know who the father is you must still register the child – just read and answer the questions below.
        </div>

        <form onSubmit={handleSubmit(this.props.onSubmit)}>
          <Field {...getFieldProps(schema, 'assistedHumanReproduction')} onChange={this.handleAssistedHumanReproductionChange}/>

          { assistedHumanReproduction === 'yes' &&
            <div className="conditional-field">
              <div className="instruction-text">
                Select one of the following to describe your relationship.  The option you select will change how the father/other parent details are completed.
              </div>
              <Field
                {...getFieldProps(schema, 'assistedHumanReproductionManConsented')}
                disabled={assistedHumanReproductionWomanConsented || assistedHumanReproductionSpermDonor}
              />
              <Field
                {...getFieldProps(schema, 'assistedHumanReproductionWomanConsented')}
                disabled={assistedHumanReproductionManConsented || assistedHumanReproductionSpermDonor}
              />
              <Field
                {...getFieldProps(schema, 'assistedHumanReproductionSpermDonor')}
                disabled={assistedHumanReproductionManConsented || assistedHumanReproductionWomanConsented}
              />
            </div>
          }

          { assistedHumanReproductionTouched &&
            <Field {...getFieldProps(schema, 'assistedHumanReproductionError')} />
          }

          { assistedHumanReproduction === 'no' &&
            <Field {...getFieldProps(schema, 'fatherKnown')} />
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

FatherDetailsForm.propTypes = {
  motherHomeAddress: PropTypes.object,
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
  assistedHumanReproductionTouched: PropTypes.bool,
  fatherKnown: PropTypes.string,
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
    initialValues: get(state, 'birthRegistration.savedRegistrationForm'),
    motherHomeAddress: selector(state, 'mother.homeAddress'),
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
    fatherKnown: selector(state, 'fatherKnown'),
    assistedHumanReproductionTouched: get(state, 'form.registration.fields.assistedHumanReproductionManConsented.touched') ||
                                      get(state, 'form.registration.fields.assistedHumanReproductionWomanConsented.touched') ||
                                      get(state, 'form.registration.fields.assistedHumanReproductionSpermDonor.touched')
  })
)(FatherDetailsForm)

export default makeFocusable(FatherDetailsForm)
