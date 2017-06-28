import React, { PropTypes } from 'react'

const renderField = ({ input, label, ariaLabel, placeholder, instructionText, type, meta: { touched, error, warning, form } }) => (
  <div className={`input-group ${(touched && error) ? 'has-error' : ''}`}>
    { label && <label htmlFor={`${form}-${input.name}`}>{label}</label> }
    { instructionText && <div className="instruction-text">{instructionText}</div> }
    <div>
      <input
        id={`${form}-${input.name}`}
        {...input}
        placeholder={placeholder}
        type={type}
        aria-label={ariaLabel ? ariaLabel : null}
        aria-describedby={`${form}-${input.name}-desc`}
      />
      <div id={`${form}-${input.name}-desc`}>
        {touched && error && <span className="error"><strong>Error:</strong> {error}</span>}
        {warning && <span className="warning"><strong>Warning:</strong> {warning}</span>}
      </div>
    </div>
  </div>
)

renderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.node,
  ariaLabel: PropTypes.string,
  instructionText: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object
}

export default renderField
