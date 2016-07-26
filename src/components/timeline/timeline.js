import './timeline.scss'

import React from 'react'
import Phase from './phase/phase'
import CardData from '../../store/store'

class Timeline extends React.Component {
  render () {
    return (
      <div className='timeline'>
        {CardData.map((phase, index) =>
          <Phase key={phase.id} title={phase.label} cards={phase.elements} number={index} />
        )}
      </div>
    )
  }
}

export default Timeline
