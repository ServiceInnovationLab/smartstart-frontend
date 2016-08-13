import './phase.scss'

import React, { PropTypes, Component } from 'react'
import Card from 'components/card/card'

class Phase extends Component {
  render () {
    return (
      <div className='phase' data-test='phase'>
        <h2 data-test='phaseTitle'>
          <span className='phase-number'>{this.props.number + 1}</span>
          {this.props.title}
        </h2>

        {this.props.cards.map((card) => {
          if (!card.elements) { card.elements = [] } // a card can be empty
          return <Card key={card.id} title={card.label} elements={card.elements} />
        })}
      </div>
    )
  }
}

Phase.propTypes = {
  title: PropTypes.string.isRequired,
  cards: PropTypes.array.isRequired,
  number: PropTypes.number.isRequired
}

export default Phase
