import React, { PropTypes, Component } from 'react'
import nl2br from 'react-nl2br'
import ReadMore from 'components/services/read-more'

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

        <ReadMore text={provider.ORGANISATION_PURPOSE} />

        <h5>{this.isServiceIndentical(provider.PROVIDER_NAME, provider.SERVICE_NAME)}</h5>
        <ReadMore text={provider.SERVICE_DETAIL} />

        {provider.otherServices && provider.otherServices.map(service => {
          return [
            <h5>{this.isServiceIndentical(service.PROVIDER_NAME, service.SERVICE_NAME)}</h5>,
            <ReadMore text={service.SERVICE_DETAIL} />
          ]
        })}

        <div className='details'>
          {provider.PROVIDER_WEBSITE_1 &&
            <p>
              <span className='details-title'>Website:</span>
              <a href={provider.PROVIDER_WEBSITE_1} target='_blank' rel='noopener noreferrer'>{provider.PROVIDER_WEBSITE_1}</a>
            </p>
          }
          {provider.PUBLISHED_PHONE_1 &&
            <p>
              <span className='details-title'>Phone:</span>
              <a href={'tel:' + provider.PUBLISHED_PHONE_1}>{provider.PUBLISHED_PHONE_1}</a>
            </p>
          }
          {provider.PUBLISHED_CONTACT_EMAIL_1 &&
            <p>
              <span className='details-title'>Email:</span>
              <a href={'mailto:' + provider.PUBLISHED_CONTACT_EMAIL_1}>{provider.PUBLISHED_CONTACT_EMAIL_1}</a>
            </p>
          }
          {provider.PROVIDER_CONTACT_AVAILABILITY &&
            <p>
              <span className='details-title'>Opening hours:</span>
              {nl2br(provider.PROVIDER_CONTACT_AVAILABILITY)}
            </p>
          }
        </div>
      </div>
    )
  }
}

Provider.propTypes = {
  provider: PropTypes.object.isRequired
}

export default Provider
