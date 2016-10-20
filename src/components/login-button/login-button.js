import './login-button.scss'

import React, { Component } from 'react'

class LoginButton extends Component {
  render () {
    return (
      <div className='realme-secondary-widget' data-test='login'>
        <a href='/login/' className='ext-link-icon'>Login</a>
        <a href='/login/' className='ext-link-icon'>Create</a>
      </div>
    )
  }
}

LoginButton.propTypes = {}

export default LoginButton
