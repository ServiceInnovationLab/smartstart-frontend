import React, { Component } from 'react'

class LoginButton extends Component {
  render () {
    return (
      <a className='button' href='/login/' data-test='login'>
        Login
      </a>
    )
  }
}

LoginButton.propTypes = {}

export default LoginButton
