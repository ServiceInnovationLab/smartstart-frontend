import './welcome.scss'

import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { toggleSettings, OPEN_PROFILE, CLOSE_PROFILE, OPEN_TODO, CLOSE_TODO, piwikTrackPost } from 'actions/actions'
import PrimaryLogin from 'components/primary-login/primary-login'
import JumpNav from 'components/welcome/jump-nav/jump-nav'

class Welcome extends Component {
  constructor (props) {
    super(props)

    this.profileClick = this.profileClick.bind(this)
    this.todoClick = this.todoClick.bind(this)
    this.registerClick = this.registerClick.bind(this)
  }

  profileClick (event) {
    event.preventDefault()
    this.props.dispatch(toggleSettings(OPEN_PROFILE))
    this.props.dispatch(toggleSettings(CLOSE_TODO))

    let piwikEvent = {
      'category': 'Welcome',
      'action': 'Click button',
      'name': 'Add your due date'
    }
    // track the event
    this.props.dispatch(piwikTrackPost('Welcome', piwikEvent))
  }

  todoClick (event) {
    event.preventDefault()
    this.props.dispatch(toggleSettings(OPEN_TODO))
    this.props.dispatch(toggleSettings(CLOSE_PROFILE))

    let piwikEvent = {
      'category': 'Welcome',
      'action': 'Click button',
      'name': 'Check your To Do list'
    }
    // track the event
    this.props.dispatch(piwikTrackPost('Welcome', piwikEvent))
  }

  registerClick () {
    let piwikEvent = {
      'category': 'Welcome',
      'action': 'Click button',
      'name': 'Register birth online'
    }
    // track the event
    this.props.dispatch(piwikTrackPost('Welcome', piwikEvent))
  }

  render () {
    return (
      <div className='welcome' role='banner'>
        <div className='welcome-pane-wrapper'>

          <div className='welcome-intro'>
            <h2>Nau mai ki SmartStart<br /><span className='english'>Welcome to SmartStart</span></h2>
            <p>SmartStart provides step-by-step information and support to help you access the right services for you and your baby.</p>
          </div>

          <div className='welcome-content' role='navigation'>
            <div className='welcome-actions'>
              <a href='#' onClick={this.profileClick} aria-controls='my-profile' role='button' className='welcome-action welcome-action-personalise'>Add your due date</a>
              <JumpNav />
              <a href='#' onClick={this.todoClick} aria-controls='todo-list' role='button' className='welcome-action welcome-action-todo-list'>Check your To Do list</a>
              <Link onClick={this.registerClick} to={'register-my-baby'} className='welcome-action welcome-action-register-birth'>Register birth online</Link>
            </div>

            {Object.getOwnPropertyNames(this.props.personalisationValues).length > 0 ? <PrimaryLogin /> :
              <p className="message">
                Login with RealMe to access and save your SmartStart profile and To Do list.
              </p>}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  personalisationValues: state.personalisationActions.personalisationValues || {}
})

Welcome.propTypes = {
  personalisationValues: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(mapStateToProps)(Welcome)
