import './header.scss'

import React, { PropTypes, Component } from 'react'
import LoginButton from 'components/login-button/login-button'
import LogoutButton from 'components/logout-button/logout-button'

class Header extends Component {
  render () {
    const { isLoggedIn } = this.props

    let loggedIn = 'auth-controls'
    let loggedOut = 'auth-controls'

    if (isLoggedIn) {
      loggedIn = 'auth-controls'
      loggedOut = 'hidden auth-controls'
    } else {
      loggedIn = 'hidden auth-controls'
      loggedOut = 'auth-controls'
    }

    return (
      <header className='page-header'>
        <div className='page-header-inner'>
          <h1>
            <img src='/assets/img/smartstart-logo-print.svg' alt='logo - parent cradling child' />
            <a href='/'>SmartStart</a>
          </h1>
          <div className={loggedOut}>
            <LoginButton />
          </div>
          <div className={loggedIn}>
            <LogoutButton />
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
