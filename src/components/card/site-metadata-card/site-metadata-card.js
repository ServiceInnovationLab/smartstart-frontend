import './site-metadata-card.scss'

import React, { PropTypes } from 'react'
import Card from 'components/card/card' // we subclass this component

class SiteMetadataCard extends Card {
  render () {
    const { id, title, elements } = this.props

    return (
      <div className='site-metadata' data-test='site-metadata' id={id}>
        <h2 data-test='metadataTitle'>{title}</h2>
        {elements.map(element =>
          this.elementType(element)
        )}
      </div>
    )
  }
}

SiteMetadataCard.propTypes = {
  title: PropTypes.string.isRequired,
  elements: PropTypes.array.isRequired,
  id: PropTypes.number.isRequired
}

export default SiteMetadataCard
