import React, { PropTypes } from 'react'

const renderError = ({ meta: { touched, error } }) =>
  (touched && error) ? <span className="error"><strong>Error:</strong> {error}</span> : false

renderError.propTypes = {
  meta: PropTypes.object
}

export default renderError
