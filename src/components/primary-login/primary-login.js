import './primary-login.scss'
import './realme-login-primary.scss'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { piwikTrackPost } from 'actions/actions'

class PrimaryLogin extends Component {
  constructor (props) {
    super(props)

    this.state = {
      insistentLoginMessageShown: false,
      loggedInMessageShown: false,
      realmeHelpShown: false,
      concertinaVerb: 'expand'
    }

    this.checkIfRealMeLoginShouldBeShown = this.checkIfRealMeLoginShouldBeShown.bind(this)
    this.concertinaToggle = this.concertinaToggle.bind(this)
    this.loginAction = this.loginAction.bind(this)
  }

  componentWillMount () {
    this.checkIfRealMeLoginShouldBeShown(this.props.isLoggedIn)
  }

  componentWillReceiveProps (nextProps) {
    this.checkIfRealMeLoginShouldBeShown(nextProps.isLoggedIn)
  }

  checkIfRealMeLoginShouldBeShown (isLoggedIn) {
    if (isLoggedIn) {
      this.setState({
        insistentLoginMessageShown: false,
        loggedInMessageShown: true
      })
    } else {
      this.setState({
        insistentLoginMessageShown: true,
        loggedInMessageShown: false
      })
    }
  }

  loginAction (event) {
    event.preventDefault()
    const piwikEvent = {
      'category': 'Login',
      'action': 'Click',
      'name': 'Primary login'
    }

    // track the event
    this.props.dispatch(piwikTrackPost('Primary login', piwikEvent))

    // match standard piwik outlink delay
    window.setTimeout(() => {
      window.location = '/login/'
    }, 200)
  }

  concertinaToggle () {
    this.setState({
      realmeHelpShown: !this.state.realmeHelpShown,
      concertinaVerb: this.state.concertinaVerb !== 'expand' ? 'expand' : 'collapse'
    })
  }

  concertinaKeyPress (event) {
    if (event.key === 'Enter') {
      this.concertinaToggle()
    }
  }

  render () {
    const insistentLoginMessageClasses = classNames(
      'message',
      { 'hidden': !this.state.insistentLoginMessageShown }
    )
    const loggedInMessageClasses = classNames(
      'message',
      { 'hidden': !this.state.loggedInMessageShown }
    )
    const realmeHelpClasses = classNames(
      'concertina',
      { 'is-expanded': this.state.realmeHelpShown }
    )
    const realmeHelpContentClasses = classNames(
      'concertina-content',
      { 'hidden': !this.state.realmeHelpShown }
    )
    const messageContainerClasses = classNames(
      'primary-login',
      { 'hidden': !(this.state.insistentLoginMessageShown || this.state.loggedInMessageShown) }
    )

    return (
      <div>
        <div className={messageContainerClasses}>
          <div className={insistentLoginMessageClasses}>
            <h5>Log in with RealMe.</h5>
            <p>To save your changes for your next visit you need to log in with RealMe.</p>
            <a className='button realme-primary-login-button ext-link-icon' href='/login/' onClick={this.loginAction}>
              Login
            </a>
            <div>
              <p
                className={realmeHelpClasses}
                onClick={this.concertinaToggle}
                tabIndex='0'
                onKeyPress={this.concertinaKeyPress.bind(this)}
                aria-controls='realme-help'
                aria-expanded={this.state.realmeHelpShown}
              >
                What is RealMe?
                <span className='visuallyhidden'> - {this.state.concertinaVerb} this content</span>
              </p>
              <div id='realme-help' className={realmeHelpContentClasses}>
                <p>SmartStart uses RealMe to save and protect your information.  If you have a RealMe login you can use it to login to your SmartStart profile and To Do list.</p>
                <p>If you don’t have a RealMe login you can select login and create one.</p>
                <p>RealMe is a New Zealand government service that lets you use one username and password to access a wide range of services online. To find out more go to www.RealMe.govt.nz.</p>
              </div>
            </div>
          </div>

          <div className={loggedInMessageClasses}>
            <h6>You are now logged in.</h6>
            <p>Your changes will be saved. You will be logged out automatically after 30 minutes.</p>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
    isLoggedIn: state.personalisationActions.isLoggedIn || false
})

PrimaryLogin.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  dispatch: PropTypes.func
}

export default connect(mapStateToProps)(PrimaryLogin)
