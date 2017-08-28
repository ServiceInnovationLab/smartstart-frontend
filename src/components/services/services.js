import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import nl2br from 'react-nl2br'
import geolib from 'geolib'
import scriptLoader from 'react-async-script-loader'
import { fetchServicesDirectory } from 'actions/services'
import LocationAutocomplete from 'components/register-my-baby/fields/render-places-autocomplete'

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
      location: {latitude: null, longitude: null}
      // location: {latitude: -41.295378, longitude: 174.778684} // TODO remove these Wellington test values
    }

    this.onLocationSelect = this.onLocationSelect.bind(this)
  }

  componentDidMount () {
    const { isScriptLoaded, isScriptLoadSucceed, dispatch } = this.props

    dispatch(fetchServicesDirectory())

    if (isScriptLoaded && isScriptLoadSucceed) {
      this.setState({ locationApiLoaded: true })
    }
  }

  componentWillReceiveProps (nextProps) {
    const { isScriptLoaded, isScriptLoadSucceed } = nextProps

    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {
        this.setState({ locationApiLoaded: true })
      }
    }
  }

  onLocationSelect (locationDetail) {
    if (locationDetail) {
      this.setState({
        location: {
          latitude: locationDetail.geometry.location.lat(),
          longitude: locationDetail.geometry.location.lng()
        }
      })
    }
  }

  computeDistances (directory, location) {
    if (!location.latitude || !location.longitude) {
      return false
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
    const { locationApiLoaded, locationInput, location, locationMeta } = this.state

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

Services = connect(mapStateToProps)(Services)

export default scriptLoader(
  `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`
)(Services)
