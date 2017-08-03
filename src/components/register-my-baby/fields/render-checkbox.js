import React, { PropTypes } from 'react'
import renderError, { hasError } from './render-error'
import renderWarning from './render-warning'

const renderCheckbox = ({ input, label, instructionText, disabled, meta: { form, touched, error, warning } }) => (
  <div className={`input-group checkbox ${hasError({ touched, error }) ? 'has-error' : ''}`}>
    <label>
      <input
        type="checkbox"
        id={`${form}-${input.name}`}
        {...input}
        checked={input.value}
        disabled={disabled}
        aria-describedby={`${form}-${input.name}-desc`}
      />
      <span>{label}</span>
    </label>
    { instructionText && <div className="instruction-text">{instructionText}</div> }

    <div id={`${form}-${input.name}-desc`}>
      { renderError({ meta: { touched, error } }) }
      { renderWarning({ meta: { error, warning } }) }
    </div>
  </div>
)

renderCheckbox.propTypes = {
  input: PropTypes.object,
  label: PropTypes.node,
  instructionText: PropTypes.string,
  disabled: PropTypes.bool,
  meta: PropTypes.object
}

export default renderCheckbox
