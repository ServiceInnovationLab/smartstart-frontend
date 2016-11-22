import './timeline.scss'

import React, { PropTypes, Component } from 'react'
import Phase from 'components/timeline/phase/phase'

class Timeline extends Component {
  render () {
    const { phases } = this.props

    return (
      <div id='timeline' className='timeline' data-test='timeline'>
        <div className='phase-number-container'>
          <span className='phase-number'>
            <a href='#' className='phase-number-prev'>
              <span className='visuallyhidden'>Jump to the previous section</span>
            </a>
            <span className='phase-number-number'>1</span>
            <a href='#' className='phase-number-next'>
              <span className='visuallyhidden'>Jump to the next section</span>
            </a>
          </span>
        </div>
        {phases.map((phase, index) => {
          if (!phase.elements) { phase.elements = [] } // a phase can be empty
          return <Phase key={phase.id} id={phase.id} title={phase.label} cards={phase.elements} number={index + 1} />
        })}
      </div>
    )
  }
}

Timeline.propTypes = {
  phases: PropTypes.array.isRequired
}

export default Timeline
