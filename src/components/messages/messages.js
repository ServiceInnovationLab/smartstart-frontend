import './messages.scss'
import './realme-login-primary.scss'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

class Messages extends Component {
  constructor (props) {
    super(props)

    this.state = {
      initialLoginMessageShown: true,
      insistentLoginMessageShown: false,
      loggedInMessageShown: false
    }

    this.checkIfRealMeLoginShouldBeShown = this.checkIfRealMeLoginShouldBeShown.bind(this)
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
      this.state = {
        initialLoginMessageShown: false,
        insistentLoginMessageShown: false,
        loggedInMessageShown: true
      }
    } else if (!isLoggedIn && Object.getOwnPropertyNames(personalisationValues).length > 0) {
      this.state = {
        initialLoginMessageShown: false,
        insistentLoginMessageShown: true,
        loggedInMessageShown: false
      }
    } else {
      this.state = {
        initialLoginMessageShown: true,
        insistentLoginMessageShown: false,
        loggedInMessageShown: false
      }
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

    return (
      <div className='messages'>
        <p className={initialLoginMessageClasses}>
          <a href='/login/'>Login with RealMe</a> to access and save your SmartStart profile and To Do list
        </p>

        <div className={insistentLoginMessageClasses}>
          <p>To save your changes for your next visit you need to log in with RealMe.</p>
          <a className='button realme-primary-login-button ext-link-icon' href='/login/'>
            Login
          </a>
          <div>
            <p className='concertina'>What is RealMe?</p>
            <div className='concertina-content'>
              <p>RealMe is a New Zealand government service that lets you use one username and password to access a wide range of services online. To find out more go to www.RealMe.govt.nz</p>
              <p>SmartStart uses RealMe to save and protect your information.</p>
            </div>
          </div>
        </div>

        <div className={loggedInMessageClasses}>
          <h6>You are now logged in.</h6>
          <p>Your changes will be saved. You will be logged out automatically after 30 minutes.</p>
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
