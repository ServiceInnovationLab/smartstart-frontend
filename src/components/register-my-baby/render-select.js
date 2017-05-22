import React, { PropTypes } from 'react'

const renderSelect = ({ input, label, placeholder, instructionText, options, meta: { touched, error, form } }) => (
  <div className={`input-group ${(touched && error) ? 'has-error' : ''}`}>
    { label && <label htmlFor={`${form}-${input.name}`}>{label}</label> }
    { instructionText && <div className="instruction-text">{instructionText}</div> }
    <div className="styled-select">
      <select id={`${form}-${input.name}`} {...input}>
        <option value="">{placeholder || 'Please select ...'}</option>
        {
          options.map(val =>
            <option value={val} key={val}>{val}</option>
          )
        }
      </select>
      {touched && error && <span className="error"><strong>Error:</strong> {error}</span>}
    </div>
  </div>
)

renderSelect.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  instructionText: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.array,
  meta: PropTypes.object
}

export default renderSelect
