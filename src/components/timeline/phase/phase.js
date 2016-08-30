import './phase.scss'

import React, { PropTypes, Component } from 'react'
import Card from 'components/card/card'
import NonChronologicalCard from 'components/card/non-chronological-card/non-chronological-card'
import classNames from 'classnames'

class Phase extends Component {
  constructor (props) {
    super(props)

    this.state = {
      formattedDate: '1st October 2017' // TODO this should be null normally, hardcoding for testing
    }
  }

  componentWillMount () {
    // TODO check dueDate prop from connect to calculate formatted date
    // and put into state
    // if the phase is not the right one, and due date is not set, they
    // remain null

    // also need to grab the date matrix which is preloaded

    // the three pre-birth phases need a calculated date adding when due date is set

    // the special birth phase needs the due date displayed when due date is set
  }

  render () {
    const { cards, number, title } = this.props
    let normalCards = []
    let nonChronologicalCards = []
    let dateClasses = classNames('phase-date', { 'hidden': !this.state.formattedDate })

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
          <span className='phase-number'>{number}</span>
          {title}
        </h2>
        <p className={dateClasses}>{this.state.formattedDate}</p>

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
