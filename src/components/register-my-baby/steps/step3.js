import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector} from 'redux-form'
import find from 'lodash/find'
import get from 'lodash/get'
import makeFocusable from '../hoc/make-focusable'
import Accordion from '../accordion'
import CitizenshipQuestions from '../citizenship-questions'
import { maxLength } from '../normalize'
import warn from '../warn'
import validate from './validation'
import schema from './schemas/step3'
import getFieldProps from './get-field-props'

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
      this.props.change('ethnicityDescription', '')
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
          <Field {...getFieldProps(schema, 'father.ethnicityDescription')} />
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
        <h2><span className="visuallyhidden">Step</span> <span className="step-number">3</span> Matua <br/> Father/Other parent</h2>

        <div className="informative-text">
          In this section you provide the details of the father or other parent of the child. If you don't know who the father is you can still register the child online - just read and answer the first question below.
        </div>

        <form onSubmit={handleSubmit(this.props.onSubmit)}>
          <Field {...getFieldProps(schema, 'assistedHumanReproduction')} onChange={this.handleAssistedHumanReproductionChange}/>

          { assistedHumanReproduction === 'yes' &&
            <div className="conditional-field">
              <div className="informative-text">
                If the mother married, or entered into a civil union or de facto relationship with a man who consented to the mother undergoing the procedure, that man's details should be entered under the father/other parent details. Note: The Donor is generally not the father on the birth certificate.
              </div>
              <Field
                {...getFieldProps(schema, 'assistedHumanReproductionManConsented')}
                disabled={assistedHumanReproductionWomanConsented || assistedHumanReproductionSpermDonor}
              />
            </div>
          }

          { assistedHumanReproduction === 'yes' &&
            <div className="conditional-field">
              <div className="informative-text">
                If the mother married or entered into a civil union or de facto relationship with a woman who consented to the mother undergoing the procedure, that woman's details should be entered under the father/other parent details. When you tick the box below all references to 'father' will be changed to 'other parent'.
              </div>
              <Field
                {...getFieldProps(schema, 'assistedHumanReproductionWomanConsented')}
                disabled={assistedHumanReproductionManConsented || assistedHumanReproductionSpermDonor}
              />
            </div>
          }

          { assistedHumanReproduction === 'yes' &&
            <div className="conditional-field">
              <div className="informative-text">
                If the mother isn't in a relationship with a partner that consented to the mother undergoing the procedure, then you don't need to complete the father/other parent section - you will be able to skip this step and the next step.
              </div>
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
            <div className="component-grouping">
              <Field {...getFieldProps(schema, 'fatherKnown')} />

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
