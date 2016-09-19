import './card.scss'

import React, { PropTypes, Component } from 'react'
import Richtext from 'components/richtext/richtext'
import Task from 'components/task/task'
import Url from 'components/url/url'

class Card extends Component {
  elementType (element) {
    if (element.tags.indexOf('boac_presentation::task') >= 0) {
      return (<Task key={element.id} id={element.id} type={element.type} label={element.label} text={element.content} />)
    } else if (element.type === 'richtext' && element.content) {
      return (<Richtext key={element.id} id={element.id} text={element.content} tags={element.tags} title={element.label} />)
    } else if (element.type === 'url' && element.externalURL) {
      return (<Url key={element.id} url={element.externalURL} linkLabel={element.linkText} label={element.label} tags={element.tags} />)
    }
  }

  render () {
    return (
      <div className='card' data-test='card' id={this.props.id}>
        <h3 data-test='cardTitle'>{this.props.title}</h3>
        {this.props.elements.map(element =>
          this.elementType(element)
        )}
      </div>
    )
  }
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  elements: PropTypes.array.isRequired,
  id: PropTypes.number.isRequired
}

export default Card
