import './welcome.scss'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toggleSettings, OPEN_PROFILE, CLOSE_PROFILE, OPEN_TODO, CLOSE_TODO } from 'actions/actions'

class Welcome extends Component {
  constructor (props) {
    super(props)

    this.profileClick = this.profileClick.bind(this)
    this.todoClick = this.todoClick.bind(this)
  }

  profileClick (event) {
    event.preventDefault()
    this.props.dispatch(toggleSettings(OPEN_PROFILE))
    this.props.dispatch(toggleSettings(CLOSE_TODO))
  }

  todoClick (event) {
    event.preventDefault()
    this.props.dispatch(toggleSettings(OPEN_TODO))
    this.props.dispatch(toggleSettings(CLOSE_PROFILE))
  }

  render () {
    return (
      <div className='welcome'>
        <div className='welcome-pane-wrapper'>

          <div className='welcome-intro'>
            <h2>Welcome to SmartStart</h2>
            <p>SmartStart provides step-by-step information and support to help you access the right government services for you and your baby.</p>
          </div>

          <a href='#' onClick={this.profileClick} className='welcome-action welcome-action-personalise'>Add your due date</a>
          <a href='#timeline' className='welcome-action welcome-action-timeline'>Find out about services</a>
          <a href='#' onClick={this.todoClick} className='welcome-action welcome-action-todo-list'>Check your To Do list</a>
          <p className='realme-login-message realme-login-message-initial'><a href='/login/'>Login with RealMe</a> to access and save your SmartStart profile and To Do list</p>

        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {}
}

export default connect(mapStateToProps)(Welcome)