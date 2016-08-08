import React from 'react'

class LoginButton extends React.Component {
  render () {
    return (
      <a className='button' href='/login/' data-test='login'>
        Login
      </a>
    )
  }
}

export default LoginButton
