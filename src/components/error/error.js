import './error.scss'

import React, { Component } from 'react'

class Error extends Component {
  render () {
    return (
      <div className='app-error'>
        <h3>Sorry, we are unable to retrieve the content at the moment. Please try again shortly.</h3>
      </div>
    )
  }
}

Error.propTypes = {}

export default Error
