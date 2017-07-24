import './logout-button.scss'

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Cookie from 'react-cookie'

class LogoutButton extends Component {
  constructor (props) {
    super(props)

    this.logoutAction = this.logoutAction.bind(this)
  }

  logoutAction(event) {
    event.preventDefault()
    // clear the savedValues cookie

    Cookie.remove('savedValues', { path: '/' })

    window.location = '/logout/'
  }

  render () {
    return (
      <a href='/logout/' onClick={this.logoutAction} className='logout' data-test='logout'>
        Logout
      </a>
    )
  }
}

function mapStateToProps () {
  return {}
}

LogoutButton.propTypes = {
  dispatch: PropTypes.func
}

export default connect(mapStateToProps)(LogoutButton)
