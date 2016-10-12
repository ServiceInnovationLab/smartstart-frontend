/* globals DocumentTouch  */
import './login-button.scss'

import React, { Component } from 'react'
import classNames from 'classnames'

class LoginButton extends Component {
  render () {
    return (
      <div className='realme_widget realme_secondary_login realme_theme_dark' data-test='login'>
        <a href='/login/' className='realme_login realme_pipe ext-link-icon'>Login</a>
        <a href='/login/' className='realme_create_account realme_pipe ext-link-icon'>Create</a>
      </div>
    )
  }
}

LoginButton.propTypes = {}

export default LoginButton
