import React, { PropTypes } from 'react'
import renderError, { hasError } from './render-error'
import renderWarning from './render-warning'

const renderTextarea = ({ input, label, ariaLabel, placeholder, instructionText, rows = 5, meta: { touched, error, warning, form } }) => (
  <div className={`input-group ${hasError({ touched, error }) ? 'has-error' : ''}`}>
    { label && <label htmlFor={`${form}-${input.name}`}>{label}</label> }
    { instructionText && <div className="instruction-text">{instructionText}</div> }
    <div>
      <textarea
        id={`${form}-${input.name}`}
        {...input}
        rows={rows}
        placeholder={placeholder}
        aria-label={ariaLabel ? ariaLabel : null}
        aria-describedby={`${form}-${input.name}-desc`}
      />
      <div id={`${form}-${input.name}-desc`}>
        { renderError({ meta: { touched, error } }) }
        { renderWarning({ meta: { warning } }) }
      </div>
    </div>
  </div>
)

renderTextarea.propTypes = {
  input: PropTypes.object,
  label: PropTypes.node,
  ariaLabel: PropTypes.string,
  instructionText: PropTypes.string,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  meta: PropTypes.object
}

export default renderTextarea
