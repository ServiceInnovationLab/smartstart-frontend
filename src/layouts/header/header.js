import './header.scss'

import React, { PropTypes, Component } from 'react'
import LoginButton from 'components/login-button/login-button'
import LogoutButton from 'components/logout-button/logout-button'

class Header extends Component {
  render () {
    const { isLoggedIn } = this.props

    let loggedIn = ''
    let loggedOut = ''

    if (isLoggedIn) {
      loggedIn = ''
      loggedOut = 'hidden'
    } else {
      loggedIn = 'hidden'
      loggedOut = ''
    }

    return (
      <header className='page-header'>
        <div className='page-header-inner'>
          <h1>
            <a href='/'>Bundle</a>
          </h1>
          <div className={loggedOut}>
            <LoginButton />
          </div>
          <div className={loggedIn}>
            Login was successful. <LogoutButton />
          </div>
        </div>
      </header>
    )
  }
}

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired
}

export default Header
