import React, { PropTypes } from 'react'

const renderSubFieldReview = ({ input, valueRenderer, label, meta: { error, warning } }) => {
  let valueDisplay;

  if (typeof valueRenderer === 'function') {
    valueDisplay = valueRenderer(input.value)
  } else {
    valueDisplay = input.value
  }

  return <div className="review-subfield">
    <div>
      <strong>{label}</strong>
      { valueDisplay ?
        <span>{valueDisplay}</span> :
        <em>Not applicable</em>
      }
    </div>
    {error && <span className="error"><strong>Error:</strong> {error}</span>}
    {warning && <span className="warning"><strong>Warning:</strong> {warning}</span>}
  </div>
}

renderSubFieldReview.propTypes = {
  input: PropTypes.object,
  valueRenderer: PropTypes.func,
  label: PropTypes.node,
  meta: PropTypes.object
}

export default renderSubFieldReview

