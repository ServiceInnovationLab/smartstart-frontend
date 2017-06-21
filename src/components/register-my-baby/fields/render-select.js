import React, { PropTypes } from 'react'
import get from 'lodash/get'

const renderSelect = ({ input, label, placeholder, instructionText, options, renderEmptyOption = true, className, meta: { touched, error, form } }) => (
  <div className={`input-group ${className} ${(touched && error) ? 'has-error' : ''}`}>
    { label && <label htmlFor={`${form}-${input.name}`}>{label}</label> }
    { instructionText && <div className="instruction-text">{instructionText}</div> }
    <div className="styled-select">
      <select
        id={`${form}-${input.name}`}
        {...input}
        aria-describedby={(touched && error) ? `${form}-${input.name}-error` : null}
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
      {touched && error && <span id={`${form}-${input.name}-error`} className="error"><strong>Error:</strong> {error}</span>}
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
