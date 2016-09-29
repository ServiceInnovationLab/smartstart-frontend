import './settings-pane.scss'
import './button-set.scss' // used in both child components

import React, { Component } from 'react'
import classNames from 'classnames'
import MyProfile from 'components/settings-pane/my-profile/my-profile'
import TodoList from 'components/settings-pane/todo-list/todo-list'
import Messages from 'components/messages/messages'

class SettingsPane extends Component {
  constructor (props) {
    super(props)

    this.state = {
      fixedControls: false,
      profilePaneOpen: false,
      todoPaneOpen: false
    }

    this.profilePaneClose = this.profilePaneClose.bind(this)
    this.todoPaneClose = this.todoPaneClose.bind(this)
  }

  componentDidMount () {
    window.addEventListener('scroll', this.checkIfShouldBeFixed.bind(this))
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.checkIfShouldBeFixed.bind(this))
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
    if (this.state.profilePaneOpen === false) {
      this.setState({
        profilePaneOpen: true,
        todoPaneOpen: false
      })
    } else {
      this.setState({
        profilePaneOpen: false
      })
    }
  }

  todoPaneToggle () {
    // if opening, close the other pane
    if (this.state.todoPaneOpen === false) {
      this.setState({
        todoPaneOpen: true,
        profilePaneOpen: false
      })
    } else {
      this.setState({
        todoPaneOpen: false
      })
    }
  }

  profilePaneClose () {
    this.setState({
      profilePaneOpen: false
    })
  }

  todoPaneClose () {
    this.setState({
      todoPaneOpen: false
    })
  }

  render () {
    let paneWrapperClasses = classNames(
      'settings-pane-wrapper',
      { 'is-fixed': this.state.fixedControls }
    )
    let triggersWrapperClasses = classNames(
      'settings-triggers',
      { 'pane-open': this.state.profilePaneOpen || this.state.todoPaneOpen }
    )
    let profileTodoClasses = classNames(
      'settings-trigger',
      'settings-trigger-my-profile',
      { 'is-open': this.state.profilePaneOpen }
    )
    let triggerTodoClasses = classNames(
      'settings-trigger',
      'settings-trigger-todo-list',
      { 'is-open': this.state.todoPaneOpen }
    )

    return (
      <div className='settings' ref={(ref) => { this.settingsElement = ref }}>
        <div className={paneWrapperClasses}>
          <div className={triggersWrapperClasses}>
            <button
              className={profileTodoClasses}
              aria-controls='my-profile'
              aria-expanded={this.state.profilePaneOpen}
              onClick={this.profilePaneToggle.bind(this)}
            >Your profile</button>
            <button
              className={triggerTodoClasses}
              aria-controls='todo-list'
              aria-expanded={this.state.todoPaneOpen}
              onClick={this.todoPaneToggle.bind(this)}
            >To do list</button>
          </div>
          <MyProfile shown={this.state.profilePaneOpen} profilePaneClose={this.profilePaneClose} />
          <TodoList shown={this.state.todoPaneOpen} todoPaneClose={this.todoPaneClose} />
        </div>
        <Messages />
      </div>
    )
  }
}

export default SettingsPane
