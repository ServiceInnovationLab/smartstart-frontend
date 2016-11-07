import './header.scss'

import React, { PropTypes, Component } from 'react'
import LoginButton from 'components/login-button/login-button'
import LogoutButton from 'components/logout-button/logout-button'
import classNames from 'classnames'

class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      authErrorShown: false,
      authErrorMessage: ''
    }

    this.clearMessage = this.clearMessage.bind(this)
    this.setAuthErrorMessage = this.setAuthErrorMessage.bind(this)
  }

  componentWillMount () {
    if (this.props.authError) {
      this.setAuthErrorMessage(this.props.authError)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.authError) {
      this.setAuthErrorMessage(nextProps.authError)
    }
  }

  setAuthErrorMessage (code) {
    let message = ''

    switch (code) {
      case 'idp-AuthnFailed':
        message = 'You have chosen to leave RealMe.'
        break
      case 'idp-Timeout':
        message = 'Your RealMe session has expired due to inactivity.'
        break
      case 'idp-InternalError':
        message = 'RealMe was unable to process your request due to a RealMe internal error. Please try again. If the problem persists, please contact RealMe Help Desk on 0800 664 774.'
        break
      case 'idp-RequestUnsupported':
      case 'idp-UnsupportedBinding':
      case 'idp-NoPassive':
      case 'idp-RequestDenied':
        message = `RealMe reported a serious application error with the message ${code}. Please try again later. If the problem persists, please contact RealMe Help Desk on 0800 664 774.`
        break
      case 'timeout':
        message = 'Sorry, SmartStart is unable to save your change because your login session has expired.  Please log in again to save your change.'
        break
    }

    this.setState({
      authErrorShown: true,
      authErrorMessage: message
    })
  }

  clearMessage (event) {
    event.preventDefault()
    this.setState({
      authErrorShown: false
    })
  }

  render () {
    const { isLoggedIn, authError } = this.props
    let messageClasses = classNames(
      'page-header-error',
      { 'hidden': !this.state.authErrorShown },
      { 'realme-error': authError && authError.substr(0, 3) === 'idp' }
    )
    let loginClasses = classNames(
      'auth-controls',
      { 'hidden': isLoggedIn }
    )
    let logoutClasses = classNames(
      'auth-controls',
      { 'hidden': !isLoggedIn }
    )

    return (
      <header className='page-header'>
        <div className='page-header-inner'>
          <h1>
            <img src='/assets/img/smartstart-logo-print.svg' alt='logo - parent cradling child' />
            <a href='/'>SmartStart</a>
          </h1>
          <div className={loginClasses}>
            <LoginButton />
          </div>
          <div className={logoutClasses}>
            <LogoutButton />
          </div>
        </div>
        <div className={messageClasses}>
          <div className='page-header-inner'>
            <p>{this.state.authErrorMessage}</p>
            <a className='page-header-error-close' href='#' onClick={this.clearMessage}><span className='visuallyhidden'>Close message</span></a>
          </div>
        </div>
      </header>
    )
  }
}

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  authError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string
  ])
}

export default Header
