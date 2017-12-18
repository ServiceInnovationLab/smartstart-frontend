import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import {
  Field, reduxForm, getFormValues, getFormSyncErrors,
  getFormSubmitErrors, getFormSyncWarnings, SubmissionError
} from 'redux-form'
import get from 'lodash/get'
import renderStep1Review from './step1'
import renderStep2Review from './step2'
import renderStep3Review from './step3'
import renderStep4Review from './step4'
import renderStep5Review from './step5'
import renderStep6Review from './step6'
import renderTextarea from '../../fields/render-textarea'
import renderCheckbox from '../../fields/render-checkbox'
import renderError from '../../fields/render-error'
import {
  REQUIRE_DECLARATION
} from '../../validation-messages'
import { validCharRelax } from '../../validate'
import { maxLength } from '../../normalize'
import Spinner from '../../../spinner/spinner'
import { validateOnly } from '../../submit'
import { fetchCountries } from '../../../../actions/birth-registration'
import './review.scss'

class Review extends Component {
  constructor(props) {
    super(props)
    this.state = {
      validating: true,
      genericError: null,
      connectionError: null
    }
    this.retryConnection = this.retryConnection.bind(this)
    this.onValidate = this.onValidate.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidUpdate(prevProps) {
    // send validation request only after
    // form has been initialized
    // we need to initialize the form because it might be automatically populated
    // with a saved data from the user
    if (Object.keys(prevProps.formState).length === 0 && Object.keys(this.props.formState).length > 0) {
      this.props.handleSubmit(this.onValidate)();
    }
  }

  retryConnection() {
    this.props.handleSubmit(this.onValidate)();
  }

  onValidate() {
    return validateOnly(this.props.formState, this.props.csrfToken)
      .then(() => {
        this.setState({
          validating: false,
          genericError: null,
          connectionError: null
        })
      })
      .catch((err) => {
        this.setState({
          validating: false,
          genericError: err.errors._error,
          connectionError: err.errors._connection_error
        })

        throw err
      })
  }

  onSubmit() {
    if (!this.props.formState.declarationMade) {
      throw new SubmissionError({
        declarationMade: REQUIRE_DECLARATION
      });
    }

    return this.props.onSubmit();
  }

  render() {
    const {
      countries, formState, submitErrors, syncWarnings,
      handleSubmit, submitting, error, onPrevious, onFieldEdit
    } = this.props

    const { genericError, connectionError } = this.state

    if (connectionError) {
      return <div className="unavailable-notice">
        <h2>Sorry!</h2>
        <div className="informative-text">
          It looks like we are unable to connect right now. We're working on getting back online as soon as possible. Wait a couple of minutes and <Link to={'/register-my-baby/review'} onClick={this.retryConnection}>retry</Link> the connection.
        </div>
      </div>
    }

    let declarationText = 'We, as the parents named on this notification, jointly submit this true and correct notification of the birth of our child for registration we both understand that it is an offence to provide false information – that every person who commits such an offence is liable on conviction to imprisonment for a term not exceeding 5 years.'

    if (
      formState.fatherKnown === 'no' ||
      (formState.assistedHumanReproduction === 'yes' && formState.assistedHumanReproductionSpermDonor)
    ) {
      declarationText = 'I, as the parent named on this notification, submit this true and correct notification of the birth of my child for registration and I understand that it is an offence to provide false information – that every person who commits such an offence is liable on conviction to imprisonment for a term not exceeding 5 years.'
    }

    return (
      <div id="step-review">
        <h2 className="step-heading">
          <span className="visuallyhidden">Step</span>
          <span className="step-number">7</span>
          Arotake <br/>
          <span className="english">Review</span>
        </h2>
        <div className="instruction">
          Before you send the baby's details in to us for registration, take a minute to check that all the details you've put in are correct.
        </div>
        <div className="informative-text intro">
          Clicking the 'Register this birth' button at the bottom of this page will send the information through to the Registry of Births, Deaths and Marriages for registration.<br/><br/>
          Check the information you're sending carefully. The Registry may make enquiries to be sure that the details provided are correct, and you may have to provide further information.
        </div>
        { (this.state.validating || submitting) ?
          <Spinner text="Checking your application ..."/> :
          <form onSubmit={handleSubmit(this.onSubmit)}>
            { (error || genericError) &&
              <div className="general-error">
                { renderError({ meta: { touched: true, error: error || genericError }}) }
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
              label={declarationText}
              component={renderCheckbox}
            />

            <Field
              label="Any other information you want to advise us of? (600 characters)"
              name="otherInformation"
              component={renderTextarea}
              validate={[validCharRelax]}
              normalize={maxLength(600)}
            />

            { error &&
              <div className="general-error">
                { renderError({ meta: { touched: true, error }}) }
              </div>
            }

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
  countries: PropTypes.array,
  formState: PropTypes.object.isRequired,
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
  fetchCountries: PropTypes.func
}

Review = reduxForm({
  form: 'registration',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true
})(Review)

Review = connect(
  state => ({
    initialValues: get(state, 'birthRegistration.savedRegistrationForm.data'),
    formState: getFormValues('registration')(state) || {},
    csrfToken: get(state, 'birthRegistration.csrfToken'),
    syncErrors: getFormSyncErrors('registration')(state),
    submitErrors: getFormSubmitErrors('registration')(state),
    syncWarnings: getFormSyncWarnings('registration')(state),
    isValidating: get(state, 'birthRegistration.isValidating'),
    countries: get(state, 'birthRegistration.countries')
  }),
  {
    fetchCountries
  }
)(Review)

export default Review
