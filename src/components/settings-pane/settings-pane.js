import './settings-pane.scss'
import './button-set.scss' // used in both child components

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import throttle from 'throttle-debounce/throttle'
import { toggleSettings, OPEN_PROFILE, CLOSE_PROFILE, OPEN_TODO, CLOSE_TODO } from 'actions/timeline'
import { piwikTrackPost } from 'actions/application'
import MyProfile from 'components/settings-pane/my-profile/my-profile'
import TodoList from 'components/settings-pane/todo-list/todo-list'

class SettingsPane extends Component {
  constructor (props) {
    super(props)

    this.state = {
      fixedControls: false,
      scrollFunction: throttle(300, this.checkIfShouldBeFixed).bind(this)
    }

    this.profilePaneClose = this.profilePaneClose.bind(this)
    this.todoPaneClose = this.todoPaneClose.bind(this)
    this.checkIfShouldBeFixed = this.checkIfShouldBeFixed.bind(this)
  }

  componentDidMount () {
    window.addEventListener('scroll', this.state.scrollFunction)
    window.setTimeout(this.checkIfShouldBeFixed, 500) // check if we should display before scroll happens
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.state.scrollFunction)
  }

  checkIfShouldBeFixed () {
    // guard so only runs if settings pane is present
    if (this.settingsElement) {
      const settingsPosition = this.settingsElement.getBoundingClientRect().top

      if (!this.state.fixedControls && settingsPosition < 0) {
        this.setState({
          fixedControls: true
        })
      } else if (this.state.fixedControls && settingsPosition >= 0) {
        this.setState({
          fixedControls: false
        })
      }
    }
  }

  profilePaneToggle () {
    // if opening, close the other pane
    if (this.props.profilePaneOpen === false) {
      this.props.dispatch(toggleSettings(OPEN_PROFILE))
      this.props.dispatch(toggleSettings(CLOSE_TODO))

      // tracking
      let piwikEvent = {
        'category': 'Drawer',
        'action': 'Opened',
        'name': 'Your profile'
      }

      this.props.dispatch(piwikTrackPost('Drawer', piwikEvent))
    } else {
      this.props.dispatch(toggleSettings(CLOSE_PROFILE))
    }
  }

  todoPaneToggle () {
    // if opening, close the other pane
    if (this.props.todoPaneOpen === false) {
      this.props.dispatch(toggleSettings(OPEN_TODO))
      this.props.dispatch(toggleSettings(CLOSE_PROFILE))

      // tracking
      let piwikEvent = {
        'category': 'Drawer',
        'action': 'Opened',
        'name': 'To Do list'
      }

      this.props.dispatch(piwikTrackPost('Drawer', piwikEvent))
    } else {
      this.props.dispatch(toggleSettings(CLOSE_TODO))
    }
  }

  profilePaneClose () {
    this.props.dispatch(toggleSettings(CLOSE_PROFILE))
  }

  todoPaneClose () {
    this.props.dispatch(toggleSettings(CLOSE_TODO))
  }

  render () {
    let paneWrapperClasses = classNames(
      'settings-pane-wrapper',
      { 'is-fixed': this.state.fixedControls }
    )
    let triggersWrapperClasses = classNames(
      'settings-triggers',
      { 'pane-open': this.props.profilePaneOpen || this.props.todoPaneOpen }
    )
    let profileTodoClasses = classNames(
      'settings-trigger',
      'settings-trigger-my-profile',
      { 'is-open': this.props.profilePaneOpen }
    )
    let triggerTodoClasses = classNames(
      'settings-trigger',
      'settings-trigger-todo-list',
      { 'is-open': this.props.todoPaneOpen }
    )

    return (
      <div className='settings' ref={(ref) => { this.settingsElement = ref }} role='form'>
        <div className={paneWrapperClasses}>
          <div className={triggersWrapperClasses}>
            <button
              className={profileTodoClasses}
              aria-controls='my-profile'
              aria-expanded={this.props.profilePaneOpen}
              onClick={this.profilePaneToggle.bind(this)}
            >Your profile</button>
            <button
              className={triggerTodoClasses}
              aria-controls='todo-list'
              aria-expanded={this.props.todoPaneOpen}
              onClick={this.todoPaneToggle.bind(this)}
            >To Do list</button>
          </div>
          <br />
          <MyProfile shown={this.props.profilePaneOpen} profilePaneClose={this.profilePaneClose} />
          <TodoList shown={this.props.todoPaneOpen} todoPaneClose={this.todoPaneClose} />
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const {
    timeline
  } = state
  const {
    profilePaneOpen,
    todoPaneOpen
  } = timeline || {
    profilePaneOpen: false,
    todoPaneOpen: false
  }

  return {
    profilePaneOpen,
    todoPaneOpen
  }
}

SettingsPane.propTypes = {
  profilePaneOpen: PropTypes.bool.isRequired,
  todoPaneOpen: PropTypes.bool.isRequired,
  dispatch: PropTypes.func
}

export default connect(mapStateToProps)(SettingsPane)
