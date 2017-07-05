import React, { PropTypes } from 'react'

/**
 * @param {string | [string]} warning the warning(s) to render
 */
const renderWarning = ({ meta: { error, warning } }) => {

  // Warnings returned from server will be put under `error` prop with the type `warning`
  // and are already rendered in `renderError()`
  //
  // If that is the case, we won't bother render client-side warning for the field
  // because if the server warning is already been mapped to a frontend message, that message be be displayed.
  //
  // Otherwise, it will result in the duplication of warning messages.
  if (Array.isArray(error) && error.some(err => err.type === 'warning')) {
    return null
  }

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

