import './card.scss'

import React from 'react'
import Richtext from '../richtext/richtext'

class Card extends React.Component {
  render () {
    return (
      <div className='card'>
        <h3>{this.props.title}</h3>
        {this.props.elements.map(element =>
          <Richtext key={element.id} text={element.text} />
        )}
      </div>
    )
  }
}

export default Card
