import './card.scss'

import React from 'react'

class Card extends React.Component {
  render () {
    const markup = {
      __html: this.props.text
    }

    return (
      <div className='card'>
        <h3>{this.props.title}</h3>
        <div className='card-text' dangerouslySetInnerHTML={markup} />
      </div>
    )
  }
}

export default Card
