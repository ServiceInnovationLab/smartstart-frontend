import './timeline.scss'

import React, { PropTypes, Component } from 'react'
import { findDOMNode } from 'react-dom'
import throttle from 'throttle-debounce/throttle'
import classNames from 'classnames'
import Phase from 'components/timeline/phase/phase'

class Timeline extends Component {
  constructor (props) {
    super(props)

    this.phaseRefs = new Map()

    this.state = {
      fixedControls: false,
      phaseScrollFunction: throttle(300, this.setupPhaseNumber).bind(this),
      currentPhase: 1,
      prevPhaseID: null,
      nextPhaseID: null
    }

    this.setupPhaseNumber = this.setupPhaseNumber.bind(this)
  }

  componentDidMount () {
    window.addEventListener('scroll', this.state.phaseScrollFunction)
    window.setTimeout(this.setupPhaseNumber, 500) // check if we should display before scroll happens
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.state.phaseScrollFunction)
  }

  setupPhaseNumber () {
    // guard so only runs if phase number is present
    if (this.phaseNumberElement) {
      const numberPosition = this.phaseNumberElement.getBoundingClientRect().top
      let highestSectionReached = 1
      let prevPhaseID = 'app'
      let nextPhaseID = 'bottom'
      let currentScrollPos = window.pageYOffset

      // set number to be fixed or not
      if (!this.state.fixedControls && numberPosition < 0) {
        this.setState({
          fixedControls: true
        })
      } else if (this.state.fixedControls && numberPosition >= 0) {
        this.setState({
          fixedControls: false
        })
      }

      // set the number to the right section
      Array.from(this.phaseRefs.values())
        .filter(phase => phase !== null)
        .forEach((phase, index) => {
          let phaseTop = findDOMNode(phase).getBoundingClientRect().top + currentScrollPos

          // TODO does this need a manual offset to get the change to happen at the right point?

          if (currentScrollPos >= phaseTop) {
            highestSectionReached = index + 1
            prevPhaseID = phase.props.prevPhaseID
            nextPhaseID = phase.props.nextPhaseID
          }
        })

      // TODO check which section in and update links / text accordingly via ref on phase component
      this.setState({
        currentPhase: highestSectionReached,
        prevPhaseID: prevPhaseID,
        nextPhaseID: nextPhaseID
      })

      // TODO check within bottom bound too - timeline top plus height of timeline?
    }
  }

  render () {
    const { phases } = this.props
    let phaseNumberClasses = classNames(
      'phase-number',
      { 'is-fixed': this.state.fixedControls }
    )

    return (
      <div id='timeline' className='timeline' data-test='timeline'>
        <div className='phase-number-container' ref={(ref) => { this.phaseNumberElement = ref }}>
          <span className={phaseNumberClasses}>
            <a href={'#' + this.state.prevPhaseID} className='phase-number-prev'>
              <span className='visuallyhidden'>Jump to the previous section</span>
            </a>
            <span className='phase-number-number'>{this.state.currentPhase}</span>
            <a href={'#' + this.state.nextPhaseID} className='phase-number-next'>
              <span className='visuallyhidden'>Jump to the next section</span>
            </a>
          </span>
        </div>
        {phases.map((phase, index) => {
          let prevPhaseID = phases[index - 1] ? phases[index - 1].id : 'app'
          let nextPhaseID = phases[index + 1] ? phases[index + 1].id : 'bottom'

          if (!phase.elements) { phase.elements = [] } // a phase can be empty
          return <Phase key={phase.id} id={phase.id} title={phase.label} cards={phase.elements} number={index + 1} prevPhaseID={prevPhaseID} nextPhaseID={nextPhaseID} ref={(ref) => { this.phaseRefs.set(index, ref) }} />
        })}
      </div>
    )
  }
}

Timeline.propTypes = {
  phases: PropTypes.array.isRequired
}

export default Timeline
