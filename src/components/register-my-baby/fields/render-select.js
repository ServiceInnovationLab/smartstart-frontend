import React, { PropTypes } from 'react'
import get from 'lodash/get'

const renderSelect = ({ input, label, placeholder, instructionText, options, renderEmptyOption = true, className, meta: { touched, error, warning, form } }) => (
  <div className={`input-group ${className} ${(touched && error) ? 'has-error' : ''}`}>
    { label && <label htmlFor={`${form}-${input.name}`}>{label}</label> }
    { instructionText && <div className="instruction-text">{instructionText}</div> }
    <div className="styled-select">
      <select
        id={`${form}-${input.name}`}
        {...input}
        aria-describedby={`${form}-${input.name}-desc`}
      >
        { renderEmptyOption && <option value="">{placeholder || 'Please select ...'}</option> }
        {
          options.map((option, idx) => {
            if (typeof option === 'string' || typeof option === 'number') {
              return <option value={option} key={`${input.name}-${idx}`}>{option}</option>
            } else {
              const value = get(option, 'value', '')
              const display = get(option, 'display', '')
              return <option value={value} key={`${input.name}-${idx}`}>{display}</option>
            }
          })
        }
      </select>
      <div id={`${form}-${input.name}-desc`}>
        {touched && error && <span className="error"><strong>Error:</strong> {error}</span>}
        {warning && <span className="warning"><strong>Warning:</strong> {warning}</span>}
      </div>
    </div>
  </div>
)

renderSelect.propTypes = {
  input: PropTypes.object,
  label: PropTypes.node,
  instructionText: PropTypes.string,
  placeholder: PropTypes.string,
  renderEmptyOption: PropTypes.bool,
  options: PropTypes.array,
  className: PropTypes.string,
  meta: PropTypes.object
}

export default renderSelect
