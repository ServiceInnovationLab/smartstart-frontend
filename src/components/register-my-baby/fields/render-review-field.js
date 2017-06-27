import React, { PropTypes } from 'react'

const renderFieldReview = ({ input, label, valueRenderer, onEdit, section, meta: { error, warning } }) => {
  let valueDisplay;

  if (typeof valueRenderer === 'function') {
    valueDisplay = valueRenderer(input.value)
  } else {
    valueDisplay = input.value
  }

  return <div className="review-field">
    <div>
      <div>
        <strong>{label}</strong>
        { valueDisplay ?
          <span>{valueDisplay}</span> :
          <em>Not applicable</em>
        }
      </div>
      <button type="button" onClick={() => onEdit(section, input.name)} className="field-edit-btn">Edit</button>
    </div>
    {error && <span className="error"><strong>Error:</strong> {error}</span>}
    {warning && <span className="warning"><strong>Warning:</strong> {warning}</span>}
  </div>
}

renderFieldReview.propTypes = {
  input: PropTypes.object,
  label: PropTypes.node,
  valueRenderer: PropTypes.func,
  onEdit: PropTypes.func,
  section: PropTypes.string,
  meta: PropTypes.object
}

export default renderFieldReview
