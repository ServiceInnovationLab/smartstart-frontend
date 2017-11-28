import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import nl2br from 'react-nl2br'
import geolib from 'geolib'
import { fetchServicesDirectory } from 'actions/services'
import LocationAutocomplete from 'components/register-my-baby/fields/render-places-autocomplete'
import ResultMap from 'components/services/map'
import {
  PARENTING_SUPPORT_QUERY ,
  EARLY_ED_QUERY,
  BREAST_FEEDING_QUERY,
  ANTENATEL_QUERY,
  MISCARRIAGE_QUERY,
  MENTAL_HEALTH_QUERY,
  BUDGETING_QUERY,
  WELL_CHILD_QUERY
} from 'components/services/queries'

import './services.scss'

const RESULTS_LIMIT = 50
const categories = [
  {
    'label': 'Parenting support',
    'query': PARENTING_SUPPORT_QUERY
  },
  {
    'label': 'Early childhood education',
    'query': EARLY_ED_QUERY
  },
  {
    'label': 'Breastfeeding support',
    'query': BREAST_FEEDING_QUERY
  },
  {
    'label': 'Antenatel classes',
    'query': ANTENATEL_QUERY
  },
  {
    'label': 'Miscarriage and stillbirth support',
    'query': MISCARRIAGE_QUERY
  },
  {
    'label': 'Postnatal depression support',
    'query': MENTAL_HEALTH_QUERY
  },
  {
    'label': 'Budgeting and financial help',
    'query': BUDGETING_QUERY
  },
  {
    'label': 'Well Child/Tamariki Ora providers',
    'query': WELL_CHILD_QUERY
  }
]

class Services extends Component {
  constructor (props) {
    super(props)

    this.state = {
      category: 0,
      locationApiLoaded: false,
      locationText: '',
      locationMeta: {
        touched: false,
        error: null,
        warning: null,
        form: 'services'
      },
      // location: { latitude: null, longitude: null }, // TODO this should come from props
      location: { latitude: -41.295378, longitude: 174.778684 }, // TODO remove this test data
      mapCenter: { lat: -41.295378, lng: 174.778684 },
      mapZoom: 5
    }

    this.onLocationSelect = this.onLocationSelect.bind(this)
    this.onCategorySelect = this.onCategorySelect.bind(this)
    this.apiIsLoaded = this.apiIsLoaded.bind(this)
  }

  componentDidMount () {
    // TODO do this for nextProps also
    this.showOnMap()
    this.onCategorySelect(this.state.category)
  }

  apiIsLoaded () {
    this.setState({ locationApiLoaded: true })
  }

  onCategorySelect (category) {
    // TODO spinner
    // check if category is passed in from event or from componentDidMount
    if (typeof category === 'object') {
      category = category.target.value
    }
    this.setState({ category: category })
    this.props.dispatch(fetchServicesDirectory(categories[category].query))
  }

  onLocationSelect (locationDetail) {
    if (locationDetail) {
      this.setState({
        location: {
          latitude: locationDetail.geometry.location.lat(),
          longitude: locationDetail.geometry.location.lng()
        }
      }, () => {
        this.showOnMap()
      })
    }
  }

  showOnMap () {
    if (this.state.location.latitude && this.state.location.longitude) {
      this.setState({
        mapCenter: {
          lat: this.state.location.latitude,
          lng: this.state.location.longitude
        },
        mapZoom: 13
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
      value: this.state.locationText,
      onChange: (value) => {
        this.setState({ locationText: value })
      }
    }
  }

  render () {
    const { directory } = this.props
    const { locationApiLoaded, locationInput, location, locationMeta, mapCenter, mapZoom, category } = this.state

    let results = this.computeDistances(directory, location)

    return (
      <div>
        <h2>Services near me</h2>

        <label for="services-category">Category:</label>
        <select id="services-category" value={category} onChange={this.onCategorySelect}>
          {categories.map((categoryOption, index) => {
            return (<option value={index} key={'category-' + index}>{categoryOption.label}</option>)
          })}
        </select>

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
          <p><em>Showing closest {results.length} results of {directory.length}.</em></p>
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
