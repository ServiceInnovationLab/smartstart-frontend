import './card.scss'

import React, { PropTypes, Component } from 'react'
import Richtext from 'components/richtext/richtext'
import Url from 'components/url/url'
import ScrollableAnchor from 'react-scrollable-anchor'

export class Card extends Component {
  elementType (element) {
    if (element.type === 'richtext' && element.content) {
      return (<Richtext key={element.id} id={element.id} text={element.content} tags={element.tags} title={element.label} />)
    } else if (element.type === 'url' && element.externalURL) {
      return (<Url key={element.id} url={element.externalURL} linkLabel={element.linkText} label={element.label} tags={element.tags} />)
    }
  }

  render () {
    let titleDisplay = this.props.title

    if (this.props.maoriTitle) {
      titleDisplay = (
        <span>{this.props.maoriTitle}<br /><span className='english'>{this.props.title}</span></span>
      )
    }

    return (
      <ScrollableAnchor id={this.props.id.toString()} >
        <div className='card' data-test='card'>
          <h3 data-test='cardTitle'>
            {titleDisplay}
          </h3>
          {this.props.elements.map(element =>
            this.elementType(element)
          )}
        </div>
      </ScrollableAnchor>
    )
  }
}

Card.propTypes = {
  maoriTitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  elements: PropTypes.array.isRequired,
  id: PropTypes.number.isRequired
}

export default Card
