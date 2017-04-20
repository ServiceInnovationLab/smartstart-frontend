import React, { PropTypes, Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import renderField from './render-field'

const validate = () => {
  const errors = {}
  return errors
}

class OtherDetailsForm extends Component {
  render() {
    const { handleSubmit, submitting } = this.props
    return (
      <div>
        <h4>Other details</h4>
        <div className="divider" />
        <form onSubmit={handleSubmit(this.props.onSubmit)}>
          <Field
            name="notes"
            component={renderField}
            type="text"
            label="Notes"
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

OtherDetailsForm.propTypes = {
  onSubmit: PropTypes.func,
  onPrevious: PropTypes.func,
  handleSubmit: PropTypes.func, // passed via reduxForm
  submitting: PropTypes.bool, // passed via reduxForm
  pristine: PropTypes.bool,   // passed via reduxForm
}

// Decorate the form component
OtherDetailsForm = reduxForm({
  form: 'registration', // same name for all wizard's form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate
})(OtherDetailsForm)

export default OtherDetailsForm

