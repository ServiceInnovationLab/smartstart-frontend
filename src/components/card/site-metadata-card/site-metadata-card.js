import './site-metadata-card.scss'

import React, { PropTypes } from 'react'
import Card from 'components/card/card' // we subclass this component

class SiteMetadataCard extends Card {
  render () {
    const { id, title, elements, tags } = this.props
    let logos = []

    if (tags.indexOf('boac_presentation::contact') > -1) {
      logos.push(
        <div className='contact-logos'>
          <img src='/assets/img/dia-logo.png' className="dia-logo" alt='Department of Internal Affairs' />
          <img src='/assets/img/msd-logo.svg' alt='Ministry of Social Development' />
          <img src='/assets/img/ird-logo.png' className="ird-logo" alt='Inland Revenue' />
          <img src='/assets/img/moh-logo.svg' alt='Ministry of Health' />
        </div>
      )
    }

    return (
      <div className='site-metadata' data-test='site-metadata' id={id}>
        <h2 data-test='metadataTitle'>{title}</h2>
        {logos}
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
  id: PropTypes.number.isRequired,
  tags: PropTypes.array
}

export default SiteMetadataCard
