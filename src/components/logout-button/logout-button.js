import React, { Component } from 'react'

class LogoutButton extends Component {
  render () {
    return (
      <a className='button' href='/logout/' data-test='logout'>
        Logout
      </a>
    )
  }
}

LogoutButton.propTypes = {}

export default LogoutButton
