import React, { PropTypes } from 'react'
import get from 'lodash/get'
import renderError, { hasError } from './render-error'
import renderWarning from './render-warning'

const renderSelect = ({ input, label, placeholder, instructionText, options, renderEmptyOption = true, className, meta: { touched, error, warning, form } }) => (
  <div className={`input-group ${className} ${hasError({ touched, error }) ? 'has-error' : ''}`}>
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
        { renderError({ meta: { touched, error } }) }
        { renderWarning({ meta: { error, warning } }) }
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
