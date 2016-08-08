import React from 'react'

class LogoutButton extends React.Component {
  render () {
    return (
      <a className='button' href='/logout/' data-test='logout'>
        Logout
      </a>
    )
  }
}

export default LogoutButton
