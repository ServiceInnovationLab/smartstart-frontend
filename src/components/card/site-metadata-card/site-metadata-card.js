import './site-metadata-card.scss'

import React, { PropTypes } from 'react'
import Card from 'components/card/card' // we subclass this component

class SiteMetadataCard extends Card {
  render () {
    const { id, title, elements, tags } = this.props
    let logos = []

    if (tags.indexOf('boac_presentation::contact') > -1) {
      logos.push(<img key='logo-dia' src='/assets/img/dia-logo.png' className="logo-png" alt='Department of Internal Affairs' />)
      logos.push(<img key='logo-msd' src='/assets/img/msd-logo.svg' alt='Ministry of Social Development' />)
      logos.push(<img key='logo-ird' src='/assets/img/ird-logo.png' className="logo-png" alt='Inland Revenue' />)
      logos.push(<img key='logo-moh' src='/assets/img/moh-logo.svg' alt='Ministry of Health' />)
    }

    return (
      <div className='site-metadata' data-test='site-metadata' id={id}>
        <h2 data-test='metadataTitle'>{title}</h2>
        <div className='contact-logos'>{logos}</div>
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
