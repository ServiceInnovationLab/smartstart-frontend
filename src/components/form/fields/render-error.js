import React, { PropTypes } from 'react'

export const hasError = ({ touched, error }) => {
  return touched && error && (
    typeof error === 'string' ||
    !Array.isArray(error) ||
    error.some(err => err.type === 'error')
  )
}

const renderErrorMessage = (error, key = '') => {
  if (typeof error === 'string' || React.isValidElement(error)) {
    return <span key={key} className="error"><strong>Error:</strong> {error}</span>
  }

  if (typeof error === 'object') {
    if (error.type === 'warning') {
      return <span key={key} className="warning"><strong>Warning:</strong> {error.message}</span>
    } else {
      return <span key={key} className="error"><strong>Error:</strong> {error.message}</span>
    }
  }
}

/**
 * @param {boolean} immediate whether to render the error immediately
 * @param {boolean} error is only rendered when the field is touched
 * @param {string | [ { message: string, type: 'error | warning' } ]} error the error(s) to render
 */
const renderError = ({ immediate,  meta: { touched, error } }) => {
  return <div>
    {
      ((immediate || touched) && (typeof error === 'string' || React.isValidElement(error))) ?
      renderErrorMessage(error):
      null
    }
    {
      ((immediate || touched) && Array.isArray(error)) ?
      error.map((err, idx) => renderErrorMessage(err, idx)) :
      null
    }
  </div>
}

renderError.propTypes = {
  immediate: PropTypes.bool,
  meta: PropTypes.object
}

renderError.defaultProps = {
  immediate: false
}

export default renderError
