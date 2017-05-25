import React, { PropTypes } from 'react'

const renderCheckbox = ({ input, label, disabled, meta: { form, touched, error } }) => (
  <div className={`input-group checkbox ${(touched && error) ? 'has-error' : ''}`}>
    <label>
      <input id={`${form}-${input.name}`} {...input} checked={input.value} disabled={disabled} type="checkbox" />
      <span>{label}</span>
    </label>
    {touched && error && <span className="error"><strong>Error:</strong> {error}</span>}
  </div>
)

renderCheckbox.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  meta: PropTypes.object
}

export default renderCheckbox
