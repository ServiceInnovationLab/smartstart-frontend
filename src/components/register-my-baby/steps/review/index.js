import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm, getFormValues } from 'redux-form'
import get from 'lodash/get'
import renderStep1Review from './step1'
import renderStep2Review from './step2'
import renderStep3Review from './step3'
import renderStep4Review from './step4'
import renderStep5Review from './step5'
import renderStep6Review from './step6'
import Spinner from '../../../spinner/spinner'
import { validate } from '../../../../actions/birth-registration'
import './review.scss'

class Review extends Component {
  componentWillMount() {
    const { formState, csrfToken } = this.props
    this.props.validate(formState, csrfToken)
  }
  render() {
    const { isValidating, countries, formState, handleSubmit, submitting, onPrevious, onFieldEdit } = this.props

    if (isValidating) {
      return <Spinner text="Checking your application ..."/>
    }

    return (
      <div id="step-review">
        <h2><span className="visuallyhidden">Step</span> <span className="step-number">7</span> Maori text here <br/> Review</h2>
        <form onSubmit={handleSubmit(this.props.onSubmit)}>
          { renderStep1Review({ formState, onEdit: onFieldEdit }) }
          { renderStep2Review({ formState, onEdit: onFieldEdit }) }
          { renderStep3Review({ formState, onEdit: onFieldEdit }) }
          { renderStep4Review({ formState, onEdit: onFieldEdit }) }
          { renderStep5Review({ formState, onEdit: onFieldEdit }) }
          { renderStep6Review({ formState, onEdit: onFieldEdit, countries}) }
          <div className="form-actions">
            <button type="button" className="previous" onClick={onPrevious}>Back</button>
            <button type="submit" className="next" disabled={submitting}>Register this birth</button>
          </div>
        </form>
      </div>
    )
  }
}

Review.propTypes = {
  csrfToken: PropTypes.string.isRequired,
  isValidating: PropTypes.bool,
  countries: PropTypes.object,
  formState: PropTypes.object,
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func,
  onPrevious: PropTypes.func,
  onFieldEdit: PropTypes.func,
  validate: PropTypes.func
}

Review = reduxForm({
  form: 'registration',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true
})(Review)

Review = connect(
  state => ({
    formState: getFormValues('registration')(state),
    isValidating: get(state, 'birthRegistration.isValidating'),
    countries: get(state, 'birthRegistration.countries'),
    csrfToken: get(state, 'birthRegistration.csrfToken')
  }),
  {
    validate
  }
)(Review)

export default Review
