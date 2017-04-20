import React, { PropTypes, Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import renderField from './render-field'
import get from 'lodash/get'
import set from 'lodash/set'

const validate = (values) => {
  const errors = {}

  if (!get(values, 'father.firstName')) {
    set(errors, 'father.firstName', 'First name is required')
  }

  return errors
}

class FatherDetailsForm extends Component {
  render() {
    const { handleSubmit, submitting } = this.props
    return (
      <div>
        <h4>Father details</h4>
        <div className="divider" />
        <form onSubmit={handleSubmit(this.props.onSubmit)}>
          <Field
            name="father.firstName"
            component={renderField}
            type="text"
            label="Father first name"
          />
          <div className="form-actions">
            <button type="submit" className="button" disabled={submitting}>Next</button>
            <button type="button" className="previous" onClick={this.props.onPrevious}>Previous</button>
          </div>
        </form>
      </div>
    )
  }
}

FatherDetailsForm.propTypes = {
  onSubmit: PropTypes.func,
  onPrevious: PropTypes.func,
  handleSubmit: PropTypes.func, // passed via reduxForm
  submitting: PropTypes.bool, // passed via reduxForm
  pristine: PropTypes.bool,   // passed via reduxForm
}

// Decorate the form component
FatherDetailsForm = reduxForm({
  form: 'registration', // same name for all wizard's form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate
})(FatherDetailsForm)

export default FatherDetailsForm

