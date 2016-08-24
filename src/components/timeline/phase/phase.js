import './phase.scss'

import React, { PropTypes, Component } from 'react'
import Card from 'components/card/card'
import NonChronologicalCard from 'components/card/non-chronological-card/non-chronological-card'

class Phase extends Component {
  render () {
    const { cards, number, title } = this.props
    let normalCards = []
    let nonChronologicalCards = []

    cards.map((card) => {
      if (!card.elements) { card.elements = [] } // a card can be empty

      // some cards need to be moved up to the top of the phase
      if (card.tags.indexOf('boac_presentation::non-chronological') >= 0) {
        nonChronologicalCards.push(<NonChronologicalCard key={card.id} id={card.id} title={card.label} elements={card.elements} />)
      } else {
        normalCards.push(<Card key={card.id} title={card.label} elements={card.elements} />)
      }
    })

    return (
      <div className='phase' data-test='phase'>
        <h2 data-test='phaseTitle'>
          <span className='phase-number'>{number + 1}</span>
          {title}
        </h2>

        {normalCards}
        {nonChronologicalCards}
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
