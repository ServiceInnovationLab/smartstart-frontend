import './error.scss'

import React, { Component } from 'react'

class Error extends Component {
  render () {
    return (
      <div className='app-error'>
        <h4>Sorry, we are unable to retrieve the content at the moment.<br />Please try again shortly.</h4>
      </div>
    )
  }
}

Error.propTypes = {}

export default Error
