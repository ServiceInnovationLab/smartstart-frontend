import React, { PropTypes } from 'react'

const renderWarning = ({ meta: { warning } }) =>
  warning ? <span className="warning"><strong>Warning:</strong> {warning}</span> : false

renderWarning.propTypes = {
  meta: PropTypes.object
}

export default renderWarning

