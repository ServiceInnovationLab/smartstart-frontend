import React, { PropTypes } from 'react'
import renderError from './render-error'
import renderWarning from './render-warning'

const renderFieldReview = ({ input, label, valueRenderer, onEdit, section, meta: { error, warning } }) => {
  let valueDisplay;

  if (typeof valueRenderer === 'function') {
    valueDisplay = valueRenderer(input.value)
  } else {
    valueDisplay = input.value
  }

  return <div className="review-field">
    <div className="review-field-content">
      <div>
        <strong>{label}</strong>
        { valueDisplay ?
          <span>{valueDisplay}</span> :
          <em>Not applicable</em>
        }
      </div>
      <button type="button"
        className="field-edit-btn"
        onClick={() => onEdit(section, input.name)}
        aria-label={`Edit ${label}`}
      >
        Edit
      </button>
    </div>

    { renderError({ meta: { touched: true, error } }) }
    { renderWarning({ meta: { error, warning } }) }
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
