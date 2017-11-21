import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import nl2br from 'react-nl2br'
import geolib from 'geolib'
import { fetchServicesDirectory } from 'actions/services'
import LocationAutocomplete from 'components/register-my-baby/fields/render-places-autocomplete'
import ResultMap from 'components/services/map'

import './services.scss'

const RESULTS_LIMIT = 50

class Services extends Component {
  constructor(props) {
    super(props)

    this.state = {
      locationApiLoaded: false,
      locationInputValue: '',
      locationMeta: {
        touched: false,
        error: null,
        warning: null,
        form: 'services'
      },
      location: { latitude: null, longitude: null },
      mapCenter: { lat: -41.295378, lng: 174.778684 },
      mapZoom: 5
    }

    this.onLocationSelect = this.onLocationSelect.bind(this)
    this.apiIsLoaded = this.apiIsLoaded.bind(this)
  }

  componentDidMount () {
    const { dispatch } = this.props

    dispatch(fetchServicesDirectory())
  }

  apiIsLoaded () {
    this.setState({ locationApiLoaded: true })
  }

  onLocationSelect (locationDetail) {
    if (locationDetail) {
      this.setState({
        location: {
          latitude: locationDetail.geometry.location.lat(),
          longitude: locationDetail.geometry.location.lng()
        },
        mapCenter: {
          lat: locationDetail.geometry.location.lat(),
          lng: locationDetail.geometry.location.lng()
        },
        mapZoom: 11
      })
    }
  }

  // TODO clear button for location

  computeDistances (directory, location) {
    if (!location.latitude || !location.longitude) {
      return null
    }

    directory.forEach(service => {
      service.latitude = service.LATITUDE
      service.longitude = service.LONGITUDE
      service.distance = geolib.getDistanceSimple(location, service, 100) // 100 = round to 0.1 of a km
      // TODO use https://www.npmjs.com/package/geolib#geoliborderbydistanceobject-latlng-mixed-coords
    })

    directory.sort((a, b) => {
      return a.distance - b.distance;
    })

    return directory.slice(0, RESULTS_LIMIT)
  }

  setupLocationInput () {
    // this is a hack to get around the fact we're using a component that is
    // usually backed by redux form
    return {
      name: 'location',
      value: this.state.locationInputValue,
      onChange: (value) => {
        this.setState({ locationInputValue: value })
      }
    }
  }

  render () {
    const { directory } = this.props
    const { locationApiLoaded, locationInput, location, locationMeta, mapCenter, mapZoom } = this.state

    let results = this.computeDistances(directory, location)

    return (
      <div>
        <h2>Services near me</h2>

        {locationApiLoaded && <LocationAutocomplete
          input={this.setupLocationInput()}
          label='Location:'
          instructionText=''
          placeholder='Start typing an address then pick a location'
          onPlaceSelect={this.onLocationSelect}
          meta={locationMeta}
        />}

        <div className='mapContainer'>
          <ResultMap apiIsLoaded={this.apiIsLoaded} center={mapCenter} zoom={mapZoom} markers={results} />
        </div>

        {results &&
          <p><em>Showing closest {results.length} results.</em></p>
        }

        {results && results.map(service => {
          return [
            <h3>{service.SERVICE_NAME}</h3>,
            <h4>{service.PROVIDER_NAME}</h4>,
            <h5>{service.distance/1000} km &mdash; {service.PHYSICAL_ADDRESS}</h5>,
            <p><b>Purpose:</b> {nl2br(service.ORGANISATION_PURPOSE)}</p>,
            <p><b>Service detail:</b> {nl2br(service.SERVICE_DETAIL)}</p>,
            <p><a href={'tel:' + service.PUBLISHED_PHONE_1}>{service.PUBLISHED_PHONE_1}</a></p>,
            <p><a href={'mailto:' + service.PUBLISHED_CONTACT_EMAIL_1}>{service.PUBLISHED_CONTACT_EMAIL_1}</a></p>,
            <p>{nl2br(service.PROVIDER_CONTACT_AVAILABILITY)}</p>,
            <p><a href='{service.PROVIDER_WEBSITE_1}'>{service.PROVIDER_WEBSITE_1}</a></p>
          ]
        })}
      </div>
    )
  }
}

function mapStateToProps (state) {
  const {
    servicesActions
  } = state
  const {
    directory
  } = servicesActions || {
    directory: []
  }

  return {
    directory
  }
}

Services.propTypes = {
  dispatch: PropTypes.func,
  directory: PropTypes.array.isRequired,
}

export default connect(mapStateToProps)(Services)
