import './card.scss'

import React from 'react'
import Richtext from 'components/richtext/richtext'
import Url from 'components/url/url'

class Card extends React.Component {
  elementType (element) {
    if (element.type === 'richtext') {
      return (<Richtext key={element.id} id={element.id} text={element.content} tags={element.tags} title={element.label} />)
    } else if (element.type === 'url') {
      return (<Url key={element.id} url={element.externalURL} linkLabel={element.linkText} label={element.label} tags={element.tags} />)
    }
  }

  render () {
    return (
      <div className='card'>
        <h3>{this.props.title}</h3>
        {this.props.elements.map(element => // TODO what if there aren't any?
          this.elementType(element)
        )}
      </div>
    )
  }
}

export default Card
