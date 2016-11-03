import './login-button.scss'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { piwikTrackPost } from 'actions/actions'

class LoginButton extends Component {
  constructor (props) {
    super(props)

    this.loginAction = this.loginAction.bind(this)
  }

  loginAction (event) {
    event.preventDefault()
    const piwikEvent = {
      'category': 'Login',
      'action': 'Click',
      'name': 'Secondary login'
    }

    // track the event
    this.props.dispatch(piwikTrackPost('Secondary login', piwikEvent))

    // match standard piwik outlink delay
    window.setTimeout(() => {
      window.location = '/login/'
    }, 200)
  }

  render () {
    return (
      <div className='realme-secondary-widget' data-test='login'>
        <a href='/login/' onClick={this.loginAction} className='ext-link-icon'>Login</a>
        <a href='/login/' onClick={this.loginAction} className='ext-link-icon'>Create</a>
      </div>
    )
  }
}

LoginButton.propTypes = {}

function mapStateToProps (state) {
  return {}
}

export default connect(mapStateToProps)(LoginButton)
