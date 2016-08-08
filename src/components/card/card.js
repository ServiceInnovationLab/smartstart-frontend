import './card.scss'

import React from 'react'
import Richtext from 'components/richtext/richtext'
import Url from 'components/url/url'

class Card extends React.Component {
  elementType (element) {
    if (element.type === 'richtext' && element.content) {
      return (<Richtext key={element.id} id={element.id} text={element.content} tags={element.tags} title={element.label} />)
    } else if (element.type === 'url' && element.externalURL) {
      return (<Url key={element.id} url={element.externalURL} linkLabel={element.linkText} label={element.label} tags={element.tags} />)
    }
  }

  render () {
    return (
      <div className='card' data-test='card'>
        <h3 data-test='cardTitle'>{this.props.title}</h3>
        {this.props.elements.map(element =>
          this.elementType(element)
        )}
      </div>
    )
  }
}

export default Card
