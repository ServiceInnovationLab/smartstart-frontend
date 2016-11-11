import './jump-nav.scss'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { piwikTrackPost } from 'actions/actions'

class JumpNav extends Component {
  constructor (props) {
    super(props)

    this.state = {
      linkListOpen: false
    }

    this.triggerClick = this.triggerClick.bind(this)
    this.goToSection = this.goToSection.bind(this)
  }

  triggerClick (event) {
    event.preventDefault()

    this.setState({
      linkListOpen: !this.state.linkListOpen
    }, () => {
      let piwikEvent = {
        'category': 'Welcome',
        'action': 'Opened nav list',
        'name': 'Show me services for'
      }
      // track the event
      if (this.state.linkListOpen) {
        this.props.dispatch(piwikTrackPost('Welcome', piwikEvent))
      }
    })
  }

  goToSection (location, label) {
    // chrome won't honour the anchor link if the todo list is scrolled down
    // so in addition to the normal link click we also manually set the location
    window.location = '/#' + location

    this.setState({
      linkListOpen: false
    })

    // tracking
    let piwikEvent = {
      'category': 'Welcome',
      'action': 'Jump to phase',
      'name': label
    }

    this.props.dispatch(piwikTrackPost('Jump to phase', piwikEvent))
  }

  render () {
    const { phases, supplementary } = this.props
    let navLinks = []
    let navLinksClasses = classNames(
      'jump-nav-list',
      { 'is-open': this.state.linkListOpen }
    )
    let navTriggerClasses = classNames(
      'welcome-action',
      'welcome-action-timeline',
      'jump-nav-trigger',
      { 'is-active': this.state.linkListOpen }
    )

    phases.forEach(phase => {
      if (phase.elements && phase.elements.length) {
        navLinks.push(
          <li key={'jump-nav-phase-' + phase.id}><a href={'#' + phase.id} onClick={() => this.goToSection(phase.id, phase.label)}>{phase.label}</a></li>
        )
      }
    })
    if (supplementary.length) {
      navLinks.push(
        <li key={'jump-nav-supplementary'}><a href='#when-you-need-support' onClick={() => this.goToSection('#when-you-need-support', 'When you need support')}>When you need support</a></li>
      )
    }

    return (
      <div className='jump-nav'>
        <a href='#timeline' onClick={this.triggerClick} className={navTriggerClasses}>Show me services for&hellip;</a>
        <ol className={navLinksClasses}>{navLinks}</ol>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const {
    contentActions
  } = state
  const {
    phases,
    supplementary
  } = contentActions || {
    phases: [],
    supplementary: []
  }

  return {
    phases,
    supplementary
  }
}

JumpNav.propTypes = {
  phases: PropTypes.array.isRequired,
  supplementary: PropTypes.array
}

export default connect(mapStateToProps)(JumpNav)
