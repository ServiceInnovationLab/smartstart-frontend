import React, { PropTypes } from 'react'

const renderField = ({ input, label, placeholder, instructionText, type, meta: { touched, error, form } }) => (
  <div className={`input-group ${(touched && error) ? 'has-error' : ''}`}>
    { label && <label htmlFor={`${form}-${input.name}`}>{label}</label> }
    { instructionText && <div className="instruction-text">{instructionText}</div> }
    <div>
      <input id={`${form}-${input.name}`} {...input} placeholder={placeholder} type={type}/>
      {touched && error && <span>{error}</span>}
    </div>
  </div>
)

renderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  instructionText: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object
}

export default renderField
