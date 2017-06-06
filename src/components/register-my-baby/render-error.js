import React, { PropTypes } from 'react'

const renderError = ({ immediate,  meta: { touched, error } }) =>
  ((immediate || touched) && error) ? <span className="error"><strong>Error:</strong> {error}</span> : false

renderError.propTypes = {
  immediate: PropTypes.bool,
  meta: PropTypes.object
}

renderError.defaultProps = {
  immediate: false
}

export default renderError
