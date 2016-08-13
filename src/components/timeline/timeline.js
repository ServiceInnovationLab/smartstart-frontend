import './timeline.scss'

import React, { PropTypes, Component } from 'react'
import Phase from 'components/timeline/phase/phase'

class Timeline extends Component {
  render () {
    const { phases } = this.props

    return (
      <div className='timeline' data-test='timeline'>
        {phases.map((phase, index) => {
          if (!phase.elements) { phase.elements = [] } // a phase can be empty
          return <Phase key={phase.id} title={phase.label} cards={phase.elements} number={index} />
        })}
      </div>
    )
  }
}

Timeline.propTypes = {
  phases: PropTypes.array.isRequired
}

export default Timeline
