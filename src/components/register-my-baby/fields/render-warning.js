import React, { PropTypes } from 'react'

/**
 * @param {string | [string]} warning the warning(s) to render
 */
const renderWarning = ({ meta: { warning } }) => {
  return <div>
    { typeof warning === 'string' ?
      <span className="warning"><strong>Warning:</strong> {warning}</span> : false
    }
    { Array.isArray(warning) ?
      warning.map((msg, idx) =>
        <span key={idx} className="warning"><strong>Warning:</strong> {msg}</span>
      )
      : false
    }
  </div>
}

renderWarning.propTypes = {
  meta: PropTypes.object
}

export default renderWarning

