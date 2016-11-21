import './supplementary.scss'

import React, { PropTypes, Component } from 'react'
import SupplementaryCard from 'components/card/supplementary-card/supplementary-card'

class Supplementary extends Component {
  render () {
    return (
      <div className='supplementary' data-test='supplementary'>
        <h2 id='when-you-need-support'>When you need support</h2>

        {this.props.cards.map((card) => {
          if (!card.elements) { card.elements = [] } // a card can be empty
          return <SupplementaryCard key={card.id} id={card.id} title={card.label} elements={card.elements} />
        })}
      </div>
    )
  }
}

Supplementary.propTypes = {
  cards: PropTypes.array.isRequired
}

export default Supplementary
