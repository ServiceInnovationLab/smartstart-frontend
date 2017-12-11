import React, { PropTypes, Component } from 'react'
import nl2br from 'react-nl2br'

import './provider.scss'

class Provider extends Component {
  constructor (props) {
    super(props)

    this.state = {
    }
  }

  isServiceIndentical (provName, serviceName) {
    if (provName === serviceName) {
      return 'Our Services'
    }
    return serviceName
  }

  render () {
    const { provider } = this.props

    return (
      <div id={provider.FSD_ID} className='provider'>
        <h4>{provider.PROVIDER_NAME}</h4>
        <p><strong>{provider.PHYSICAL_ADDRESS} ({provider.distance/1000} km away) </strong></p>

        <p>{nl2br(provider.ORGANISATION_PURPOSE)}</p>

        <h5>{this.isServiceIndentical(provider.PROVIDER_NAME, provider.SERVICE_NAME)}</h5>
        <p>{nl2br(provider.SERVICE_DETAIL)}</p>

        {provider.otherServices && provider.otherServices.map(service => {
          return [
            <h5>{this.isServiceIndentical(service.PROVIDER_NAME, service.SERVICE_NAME)}</h5>,
            <p>{nl2br(service.SERVICE_DETAIL)}</p>
          ]
        })}

        {provider.PROVIDER_WEBSITE_1 && <p>Website: <a href={provider.PROVIDER_WEBSITE_1} target='_blank' rel='noopener noreferrer'>{provider.PROVIDER_WEBSITE_1}</a></p>}

        {provider.PROVIDER_CONTACT_AVAILABILITY && <p>Opening hours: {nl2br(provider.PROVIDER_CONTACT_AVAILABILITY)}</p>}

        {provider.PUBLISHED_PHONE_1 && <p>Phone: <a href={'tel:' + provider.PUBLISHED_PHONE_1}>{provider.PUBLISHED_PHONE_1}</a></p>}

        {provider.PUBLISHED_CONTACT_EMAIL_1 && <p>Email: <a href={'mailto:' + provider.PUBLISHED_CONTACT_EMAIL_1}>{provider.PUBLISHED_CONTACT_EMAIL_1}</a></p>}
      </div>
    )
  }
}

Provider.propTypes = {
  provider: PropTypes.object.isRequired
}

export default Provider
