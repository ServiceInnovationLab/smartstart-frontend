import React, { PropTypes } from 'react'

const renderCheckbox = ({ input, label, disabled, meta: { form, touched, error } }) => (
  <div className={`input-group checkbox ${(touched && error) ? 'has-error' : ''}`}>
    <label>
      <input
        type="checkbox"
        id={`${form}-${input.name}`}
        {...input}
        checked={input.value}
        disabled={disabled}
        aria-describedby={(touched && error) ? `${form}-${input.name}-error` : null}
      />
      <span>{label}</span>
    </label>
    {touched && error && <span id={`${form}-${input.name}-error`} className="error"><strong>Error:</strong> {error}</span>}
  </div>
)

renderCheckbox.propTypes = {
  input: PropTypes.object,
  label: PropTypes.node,
  disabled: PropTypes.bool,
  meta: PropTypes.object
}

export default renderCheckbox
