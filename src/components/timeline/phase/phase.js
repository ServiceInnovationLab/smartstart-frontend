import './phase.scss'

import React from 'react'
import Card from 'components/card/card'

class Phase extends React.Component {
  render () {
    return (
      <div className='phase'>
        <h2>
          <span className='phase-number'>{this.props.number + 1}</span>
          {this.props.title}
        </h2>

        {this.props.cards.map(function (card) { // TODO what if there aren't any?
          return <Card key={card.id} title={card.label} elements={card.elements} />
        })}
      </div>
    )
  }
}

export default Phase
