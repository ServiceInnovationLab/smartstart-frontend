import React, { PropTypes } from 'react'

const renderError = ({ meta: { touched, error } }) =>
  (touched && error) ? <span>{error}</span> : false

renderError.propTypes = {
  meta: PropTypes.object
}

export default renderError
