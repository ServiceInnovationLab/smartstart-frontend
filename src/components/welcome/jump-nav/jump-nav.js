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

    this.navToggle = this.navToggle.bind(this)
    this.navKeyPress = this.navKeyPress.bind(this)
    this.goToSection = this.goToSection.bind(this)
  }

  navToggle (event) {
    event.preventDefault()

    this.setState({
      linkListOpen: !this.state.linkListOpen
    }, () => {
      let piwikEvent = {
        'category': 'Welcome',
        'action': 'Opened nav list',
        'name': 'Go to stage'
      }
      // track the event
      if (this.state.linkListOpen) {
        this.props.dispatch(piwikTrackPost('Welcome', piwikEvent))
      }
    })
  }

  navKeyPress (event) {
    if (event.key === 'Enter') {
      this.navToggle()
    }
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
      <nav className='jump-nav' data-test='jump-navigation' role='navigation'>
        <a
          href='#timeline'
          onClick={this.navToggle}
          className={navTriggerClasses}
          onKeyPress={this.navKeyPress.bind(this)}
          aria-controls='jump-nav-list'
          aria-expanded={this.state.linkListOpen}
        >
          <span className='visuallyhidden'>Toggle the quick nav menu to </span>Go to stage
        </a>
        <ol id='jump-nav-list' className={navLinksClasses} aria-hidden={!this.state.linkListOpen}>{navLinks}</ol>
      </nav>
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
  supplementary: PropTypes.array,
  dispatch: PropTypes.func
}

export default connect(mapStateToProps)(JumpNav)
