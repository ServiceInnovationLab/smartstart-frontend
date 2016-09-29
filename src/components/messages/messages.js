import './messages.scss'
import './realme-login-primary.scss'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

class Messages extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loginMessageShown: false
    }
  }

  componentWillMount () {
    this.checkIfRealMeLoginShouldBeShown.bind(this)(this.props.isLoggedIn, this.props.personalisationValues)
  }

  componentWillReceiveProps (nextProps) {
    this.checkIfRealMeLoginShouldBeShown.bind(this)(nextProps.isLoggedIn, nextProps.personalisationValues)
  }

  checkIfRealMeLoginShouldBeShown (isLoggedIn, personalisationValues) {
    // to know if we should show the message, we just need to know if a) user is logged in and b) if there is any state
    if (!isLoggedIn && Object.getOwnPropertyNames(personalisationValues).length > 0) {
      this.state = {
        loginMessageShown: true
      }
    } else {
      this.state = {
        loginMessageShown: false
      }
    }
  }

  render () {
    let loginMessageClasses = classNames(
      'message',
      { 'hidden': !this.state.loginMessageShown }
    )

    return (
      <div className='settings-messages'>
        <div className={loginMessageClasses}>
          <h6>To save your profile for your next visit you need to log in with RealMe.</h6>
          <a className='button realme-primary-login-button ext-link-icon' href='/login/'>
            Login
          </a>
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
