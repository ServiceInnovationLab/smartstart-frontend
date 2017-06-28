import React, { PropTypes } from 'react'

const renderCheckbox = ({ input, label, disabled, meta: { form, touched, error, warning } }) => (
  <div className={`input-group checkbox ${(touched && error) ? 'has-error' : ''}`}>
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

    <div id={`${form}-${input.name}-desc`}>
      {touched && error && <span className="error"><strong>Error:</strong> {error}</span>}
      {warning && <span className="warning"><strong>Warning:</strong> {warning}</span>}
    </div>
  </div>
)

renderCheckbox.propTypes = {
  input: PropTypes.object,
  label: PropTypes.node,
  disabled: PropTypes.bool,
  meta: PropTypes.object
}

export default renderCheckbox
