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

  componentDidMount () {
    // TODO use whatwg-fetch to get api
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
        <div className={loggedOut}>
          <LoginButton />
        </div>
        <div className={loggedIn}>
          Login was successful. <LogoutButton />
        </div>
      </header>
    )
  }
}

export default Header
