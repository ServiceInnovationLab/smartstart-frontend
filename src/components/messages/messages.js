import './messages.scss'
import './realme-login-primary.scss'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { piwikTrackPost } from 'actions/actions'

class Messages extends Component {
  constructor (props) {
    super(props)

    this.state = {
      initialLoginMessageShown: true,
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
    this.checkIfRealMeLoginShouldBeShown(this.props.isLoggedIn, this.props.personalisationValues)
  }

  componentWillReceiveProps (nextProps) {
    this.checkIfRealMeLoginShouldBeShown(nextProps.isLoggedIn, nextProps.personalisationValues)
  }

  checkIfRealMeLoginShouldBeShown (isLoggedIn, personalisationValues) {
    // to know which message to show, we just need to know if a) user is logged in and b) if there is any state
    if (isLoggedIn) {
      this.setState({
        initialLoginMessageShown: false,
        insistentLoginMessageShown: false,
        loggedInMessageShown: true
      })
    } else if (!isLoggedIn && Object.getOwnPropertyNames(personalisationValues).length > 0) {
      this.setState({
        initialLoginMessageShown: false,
        insistentLoginMessageShown: true,
        loggedInMessageShown: false
      })
    } else {
      this.setState({
        initialLoginMessageShown: true,
        insistentLoginMessageShown: false,
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
    let initialLoginMessageClasses = classNames(
      'message',
      { 'hidden': !this.state.initialLoginMessageShown }
    )
    let insistentLoginMessageClasses = classNames(
      'message',
      { 'hidden': !this.state.insistentLoginMessageShown }
    )
    let loggedInMessageClasses = classNames(
      'message',
      { 'hidden': !this.state.loggedInMessageShown }
    )
    let realmeHelpClasses = classNames(
      'concertina',
      { 'is-expanded': this.state.realmeHelpShown }
    )
    let realmeHelpContentClasses = classNames(
      'concertina-content',
      { 'hidden': !this.state.realmeHelpShown }
    )
    let messageContainerClasses = classNames(
      'messages',
      { 'hidden': !(this.state.insistentLoginMessageShown || this.state.loggedInMessageShown) }
    )

    return (
      <div>
        <p className={initialLoginMessageClasses}>
          <a href='/login/'>Login with RealMe</a> to access and save your SmartStart profile and To Do list.
        </p>

        <div className={messageContainerClasses}>
          <div className={insistentLoginMessageClasses}>
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
                <p>SmartStart uses RealMe to save and protect your information. 
                  If you have a RealMe login <a href='/login/'>use it here</a>.</p>
                <p>If you don’t have a RealMe login you can <a href='/login/'>create one now</a>.</p>
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

function mapStateToProps (state) {
  const {
    personalisationActions
  } = state
  const {
    isLoggedIn,
    personalisationValues
  } = personalisationActions || {
    isLoggedIn: false,
    personalisationValues: {}
  }

  return {
    isLoggedIn,
    personalisationValues
  }
}

Messages.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  personalisationValues: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(Messages)
