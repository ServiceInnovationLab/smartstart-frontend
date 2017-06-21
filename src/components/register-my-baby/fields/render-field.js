import React, { PropTypes } from 'react'

const renderField = ({ input, label, placeholder, instructionText, type, meta: { touched, error, warning, form } }) => (
  <div className={`input-group ${(touched && error) ? 'has-error' : ''}`}>
    { label && <label htmlFor={`${form}-${input.name}`}>{label}</label> }
    { instructionText && <div className="instruction-text">{instructionText}</div> }
    <div>
      <input
        id={`${form}-${input.name}`}
        {...input}
        placeholder={placeholder}
        type={type}
        aria-describedby={(touched && error) ? `${form}-${input.name}-error` : null}
      />
      {touched && error && <span id={`${form}-${input.name}-error`} className="error"><strong>Error:</strong> {error}</span>}
      {warning && <span className="warning"><strong>Warning:</strong> {warning}</span>}
    </div>
  </div>
)

renderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.node,
  instructionText: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object
}

export default renderField
