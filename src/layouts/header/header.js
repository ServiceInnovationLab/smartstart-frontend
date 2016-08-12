import './header.scss'

import Cookie from 'react-cookie'
import React from 'react'
import LoginButton from 'components/login-button/login-button'
import LogoutButton from 'components/logout-button/logout-button'

class Header extends React.Component {

  constructor (props) {
    super(props)

    // TODO this state should probably come in as props from further up the tree
    this.state = {
      isLoggedIn: Cookie.load('is_authenticated')
    }
  }

  render () {
    let loggedIn = ''
    let loggedOut = ''

    if (this.state.isLoggedIn) {
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
            <a href="/">Bundle</a>
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

export default Header
