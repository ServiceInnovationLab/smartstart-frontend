import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, getFormValues, getFormSyncErrors, getFormSubmitErrors, getFormSyncWarnings } from 'redux-form'
import get from 'lodash/get'
import renderStep1Review from './step1'
import renderStep2Review from './step2'
import renderStep3Review from './step3'
import renderStep4Review from './step4'
import renderStep5Review from './step5'
import renderStep6Review from './step6'
import renderTextarea from '../../fields/render-textarea'
import renderRadioGroup from '../../fields/render-radio-group'
import makeMandatoryLabel from '../../hoc/make-mandatory-label'
import renderError from '../../fields/render-error'
import {
  yesNo as yesNoOptions
} from '../../options'
import { required } from '../../validate'
import { maxLength } from '../../normalize'
import Spinner from '../../../spinner/spinner'
import { validateOnly } from '../../submit'
import { fetchCountries, requestValidationResult, receiveValidationResult  } from '../../../../actions/birth-registration'
import './review.scss'

class Review extends Component {
  constructor(props) {
    super(props)
    this.onValidate = this.onValidate.bind(this)
  }

  componentWillMount() {
    this.props.handleSubmit(this.onValidate)();
  }

  onValidate() {
    this.props.dispatch(requestValidationResult())
    return validateOnly(this.props.formState, this.props.csrfToken)
      .then(() => this.props.dispatch(receiveValidationResult()))
      .catch((err) => {
        this.props.dispatch(receiveValidationResult())
        throw err
      })
  }

  render() {
    const {
      isValidating, countries, formState, submitErrors, syncWarnings,
      handleSubmit, submitting, error, onPrevious, onFieldEdit
    } = this.props

    let declarationText = 'We, as the parents named on this notification, jointly submit this true and correct notification of the birth of our child for registration we both understand that it is an offence to provide false information – that every person who commits such an offence is liable on conviction to imprisonment for a term not exceeding 5 years.'

    if (
      formState.fatherKnown === 'no' ||
      (formState.assistedHumanReproduction === 'yes' && formState.assistedHumanReproductionSpermDonor)
    ) {
      declarationText = 'I, as the parent named on this notification, submit this true and correct notification of the birth of my child for registration and I understand that it is an offence to provide false information – that every person who commits such an offence is liable on conviction to imprisonment for a term not exceeding 5 years.'
    }

    return (
      <div id="step-review">
        <h2><span className="visuallyhidden">Step</span> <span className="step-number">7</span> Maori text here <br/> Review</h2>
        <div className="instruction">
          Please take this opportunity to review the information you are providing - and make any changes you want to - before it is sent to the Registry of Births, Deaths and Marriages. If you are happy with all your answers then review and accept the legal declaration and click on the 'Register this birth' button at the bottom of the page to submit your child's birth registration.
        </div>
        <div className="informative-text">
          In a small number of cases Registry staff may need to make contact regarding a registration and you may need to provide further information and/or a statutory declaration.
        </div>
        { isValidating ?
          <Spinner text="Checking your application ..."/> :
          <form onSubmit={handleSubmit(this.props.onSubmit)}>
            { error &&
              <div className="general-error">
                { renderError({ meta: { touched: true, error }}) }
              </div>
            }

            { renderStep1Review({ formState, submitErrors, warnings: syncWarnings, onEdit: onFieldEdit }) }
            { renderStep2Review({ formState, submitErrors, warnings: syncWarnings, onEdit: onFieldEdit }) }
            { renderStep3Review({ formState, submitErrors, warnings: syncWarnings, onEdit: onFieldEdit }) }
            { renderStep4Review({ formState, submitErrors, warnings: syncWarnings, onEdit: onFieldEdit }) }
            { renderStep5Review({ formState, submitErrors, warnings: syncWarnings, onEdit: onFieldEdit }) }
            { renderStep6Review({ formState, submitErrors, warnings: syncWarnings, onEdit: onFieldEdit, countries}) }

            <Field
              name="declarationMade"
              component={renderRadioGroup}
              label={makeMandatoryLabel("Declaration")}
              instructionText={declarationText}
              options={yesNoOptions}
              validate={[required]}
            />

            <Field
              label="Any other information you want to advise us of? (600 Characters)"
              name="otherInformation"
              component={renderTextarea}
              normalize={maxLength(600)}
            />

            <div className="form-actions">
              <button type="button" className="previous" onClick={onPrevious}>Back</button>
              <button type="submit" className="next" disabled={submitting}>Register this birth</button>
            </div>
          </form>
        }
      </div>
    )
  }
}

Review.propTypes = {
  countries: PropTypes.object,
  formState: PropTypes.object,
  syncErrors: PropTypes.object,
  submitErrors: PropTypes.object,
  syncWarnings: PropTypes.object,
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.string,
  onSubmit: PropTypes.func,
  onValidate: PropTypes.func,
  onPrevious: PropTypes.func,
  onFieldEdit: PropTypes.func,
  dispatch: PropTypes.func,

  csrfToken: PropTypes.string.isRequired,
  isValidating: PropTypes.bool,
  validationResult: PropTypes.object,
  fetchCountries: PropTypes.func
}

Review = reduxForm({
  form: 'registration',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true
})(Review)

Review = connect(
  state => ({
    formState: getFormValues('registration')(state),
    csrfToken: get(state, 'birthRegistration.csrfToken'),
    syncErrors: getFormSyncErrors('registration')(state),
    submitErrors: getFormSubmitErrors('registration')(state),
    syncWarnings: getFormSyncWarnings('registration')(state),
    isValidating: get(state, 'birthRegistration.isValidating'),
    countries: get(state, 'birthRegistration.countries'),
    validationResult: get(state, 'birthRegistration.validationResult')
  }),
  {
    fetchCountries
  }
)(Review)

export default Review
