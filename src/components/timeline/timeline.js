import './timeline.scss'

import React from 'react'
import Phase from './phase/phase'
import CardData from '../../store/store'

class Timeline extends React.Component {
  render () {
    return (
      <div className='timeline'>
        {CardData.map(function (phase, index) {
          return <Phase key={phase.id} title={phase.title} cards={phase.cards} number={index} />
        })}
      </div>
    )
  }
}

export default Timeline
