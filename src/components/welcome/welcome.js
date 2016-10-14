import './welcome.scss'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toggleSettings, OPEN_PROFILE, CLOSE_PROFILE, OPEN_TODO, CLOSE_TODO } from 'actions/actions'
import Messages from 'components/messages/messages'

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
      <div className='welcome' role='banner'>
        <div className='welcome-pane-wrapper'>

          <div className='welcome-intro'>
            <h2>Welcome to SmartStart</h2>
            <p>SmartStart provides step-by-step information and support to help you access the right government services for you and your baby.</p>
          </div>

          <div role='navigation'>
            <a href='#' onClick={this.profileClick} aria-controls='my-profile' role='button' className='welcome-action welcome-action-personalise'>Add your due date</a>
            <a href='#timeline' className='welcome-action welcome-action-timeline'>Find out about services</a>
            <a href='#' onClick={this.todoClick} aria-controls='todo-list' role='button' className='welcome-action welcome-action-todo-list'>Check your To Do list</a>

            <Messages />
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {}
}

export default connect(mapStateToProps)(Welcome)
