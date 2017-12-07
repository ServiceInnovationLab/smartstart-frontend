import React, { PropTypes, Component } from 'react'
import classNames from 'classnames'
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
      <div className='provider'>
        <h3>{provider.PROVIDER_NAME}</h3>
        <h5>{provider.distance/1000} km &mdash; {provider.PHYSICAL_ADDRESS}</h5>

        <p>{nl2br(provider.ORGANISATION_PURPOSE)}</p>

        <p><a href={'tel:' + provider.PUBLISHED_PHONE_1}>{provider.PUBLISHED_PHONE_1}</a></p>
        <p><a href={'mailto:' + provider.PUBLISHED_CONTACT_EMAIL_1}>{provider.PUBLISHED_CONTACT_EMAIL_1}</a></p>

        <p>{nl2br(provider.PROVIDER_CONTACT_AVAILABILITY)}</p>


        <p><a href='{provider.PROVIDER_WEBSITE_1}'>{provider.PROVIDER_WEBSITE_1}</a></p>

        <h4>{this.isServiceIndentical(provider.PROVIDER_NAME, provider.SERVICE_NAME)}</h4>
        <p>{nl2br(provider.SERVICE_DETAIL)}</p>

        {provider.otherServices && provider.otherServices.map((service, index) => {
          return [
            <h4>{this.isServiceIndentical(service.PROVIDER_NAME, service.SERVICE_NAME)}</h4>,
            <p>{nl2br(service.SERVICE_DETAIL)}</p>
          ]
        })}
      </div>
    )
  }
}

Provider.propTypes = {
  provider: PropTypes.object.isRequired
}

export default Provider
