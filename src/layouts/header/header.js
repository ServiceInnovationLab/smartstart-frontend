import './header.scss'

import React, { PropTypes, Component } from 'react'
import { Link, IndexLink } from 'react-router'
import LoginButton from 'components/login-button/login-button'
import LogoutButton from 'components/logout-button/logout-button'
import classNames from 'classnames'

class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      authErrorShown: false,
      authErrorMessage: '',
      authErrorIsFromIDP: false
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
    let isIDP = false

    switch (code) {
      case 'AuthnFailed':
        message = 'You have chosen to leave RealMe.'
        isIDP = true
        break
      case 'Timeout':
        message = 'Your RealMe session has expired due to inactivity.'
        isIDP = true
        break
      case 'InternalError':
        message = 'RealMe was unable to process your request due to a RealMe internal error. Please try again. If the problem persists, please contact RealMe Help Desk on 0800 664 774.'
        isIDP = true
        break
      case 'RequestUnsupported':
      case 'UnsupportedBinding':
      case 'NoPassive':
      case 'RequestDenied':
        message = `RealMe reported a serious application error with the message ${code}. Please try again later. If the problem persists, please contact RealMe Help Desk on 0800 664 774.`
        isIDP = true
        break
      case 'local-timeout':
        message = 'Sorry, SmartStart is unable to save your change because your login session has expired.  Please log in again to save your change.'
        window.scrollTo(0, 0)
        break
      default:
        message = 'RealMe was unable to log you in. Please try again. If the problem persists, contact RealMe Help Desk on 0800 664 774.'
        isIDP = true
    }

    this.setState({
      authErrorShown: true,
      authErrorMessage: message,
      authErrorIsFromIDP: isIDP
    })
  }

  clearMessage (event) {
    event.preventDefault()
    this.setState({
      authErrorShown: false
    })
  }

  render () {
    const { isLoggedIn } = this.props
    let messageClasses = classNames(
      'page-header-error',
      { 'hidden': !this.state.authErrorShown },
      { 'realme-error': this.state.authErrorIsFromIDP }
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
            <IndexLink to={'/'}>SmartStart</IndexLink>
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
        <nav className='main-nav' data-test='main-navigation' role='navigation'>
          <div className='page-header-inner'>
            <IndexLink to={'/'} activeClassName='active'>Home</IndexLink>
            <Link to={'register-my-baby'} activeClassName='active'>Register your baby</Link>
            <Link to={'news/baby-names'} activeClassName='active'>Top baby names</Link>
          </div>
        </nav>
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
