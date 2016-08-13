import './logout-button.scss'

import React, { Component } from 'react'

class LogoutButton extends Component {
  render () {
    return (
      <a href='/logout/' className='logout' data-test='logout'>
        Logout
      </a>
    )
  }
}

LogoutButton.propTypes = {}

export default LogoutButton
