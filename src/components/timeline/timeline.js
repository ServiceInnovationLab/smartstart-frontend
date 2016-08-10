import './timeline.scss'

import React from 'react'
import Phase from 'components/timeline/phase/phase'

class Timeline extends React.Component {
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

export default Timeline
