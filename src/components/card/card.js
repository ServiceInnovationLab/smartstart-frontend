import './card.scss'

import React from 'react'
import Richtext from 'components/richtext/richtext'
import Url from 'components/url/url'

class Card extends React.Component {
  elementType (element) {
    if (element.type === 'richtext') {
      return (<Richtext key={element.id} text={element.text} />)
    } else if (element.type === 'url') {
      return (<Url key={element.id} url={element.url} linkLabel={element.linkLabel} />)
    }
  }

  render () {
    return (
      <div className='card'>
        <h3>{this.props.title}</h3>
        {this.props.elements.map(element =>
          this.elementType(element)
        )}
      </div>
    )
  }
}

export default Card
