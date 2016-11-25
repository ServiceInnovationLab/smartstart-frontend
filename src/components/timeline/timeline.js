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
      endReached: false,
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
    if (this.phaseNumberContainerElement) {
      const numberPosition = this.phaseNumberContainerElement.getBoundingClientRect().top
      const numberHeight = this.phaseNumberElement.getBoundingClientRect().height
      const timelineStart = this.timelineElement.offsetTop
      const timelineEnd = this.timelineElement.getBoundingClientRect().height + timelineStart
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

      // check if the end of timeline has been reached
      if (currentScrollPos >= ((timelineEnd - numberHeight) - 30)) {
        this.setState({
          endReached: true
        })
      } else if (this.state.endReached) {
        this.setState({
          endReached: false
        })
      }

      // set the number to the right section
      Array.from(this.phaseRefs.values())
        .filter(phase => phase !== null)
        .some((phase, index) => {
          let phaseTop = findDOMNode(phase).getBoundingClientRect().top + currentScrollPos

          if (currentScrollPos >= Math.floor(phaseTop)) {
            highestSectionReached = index + 1
            prevPhaseID = phase.props.prevPhaseID
            nextPhaseID = phase.props.nextPhaseID
          } else if (currentScrollPos < timelineStart) {
            // if we're before the timeline, the next link should be to the second phase
            nextPhaseID = phase.props.nextPhaseID
            return true
          } else {
            // we haven't gotten as far as this phase yet, don't bother checking the rest
            return true
          }
        })

      this.setState({
        currentPhase: highestSectionReached,
        prevPhaseID: prevPhaseID,
        nextPhaseID: nextPhaseID
      })
    }
  }

  render () {
    const { phases } = this.props
    let phaseNumberClasses = classNames(
      'phase-number',
      { 'is-fixed': this.state.fixedControls },
      { 'end-reached': this.state.endReached }
    )

    return (
      <div id='timeline' className='timeline' data-test='timeline' ref={(ref) => { this.timelineElement = ref }}>
        <div className='phase-number-container' ref={(ref) => { this.phaseNumberContainerElement = ref }}>
          <span className={phaseNumberClasses} ref={(ref) => { this.phaseNumberElement = ref }}>
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
