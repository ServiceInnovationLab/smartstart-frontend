import React, { PropTypes } from 'react'

const renderSelect = ({ input, label, placeholder, options, meta: { touched, error } }) => (
  <div className={`input-group ${(touched && error) ? 'has-error' : ''}`}>
    <label>{label}</label>
    <div className="styled-select">
      <select {...input}>
        <option value="">{placeholder || 'Please select ...'}</option>
        {
          options.map(val =>
            <option value={val} key={val}>{val}</option>
          )
        }
      </select>
      {touched && error && <span>{error}</span>}
    </div>
  </div>
)

renderSelect.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.array,
  meta: PropTypes.object
}

export default renderSelect
