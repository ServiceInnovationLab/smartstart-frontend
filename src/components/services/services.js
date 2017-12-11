import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import geolib from 'geolib'
import classNames from 'classnames'
import { browserHistory } from 'react-router'
import { fetchServicesDirectory } from 'actions/services'
import LocationAutocomplete from 'components/register-my-baby/fields/render-places-autocomplete'
import ResultMap from 'components/services/map'
import Provider from 'components/services/provider'
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
const categories = {
  'parenting-support': {
    'label': 'Parenting support',
    'query': PARENTING_SUPPORT_QUERY
  },
  'early-education': {
    'label': 'Early childhood education',
    'query': EARLY_ED_QUERY
  },
  'breastfeeding': {
    'label': 'Breastfeeding support',
    'query': BREAST_FEEDING_QUERY
  },
  'antenatal': {
    'label': 'Antenatel classes',
    'query': ANTENATEL_QUERY
  },
  'miscarriage-support': {
    'label': 'Miscarriage and stillbirth support',
    'query': MISCARRIAGE_QUERY
  },
  'mental-health': {
    'label': 'Anxiety and depression support',
    'query': MENTAL_HEALTH_QUERY
  },
  'budgeting': {
    'label': 'Budgeting and financial help',
    'query': BUDGETING_QUERY
  },
  'well-child': {
    'label': 'Well Child/Tamariki Ora providers',
    'query': WELL_CHILD_QUERY
  }
}

class Services extends Component {
  constructor (props) {
    super(props)

    this.state = {
      category: '',
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
    this.showOnMap()

    if (this.props.category && categories[this.props.category]) {
      this.onCategorySelect(this.props.category)
    }
  }

  componentWillReceiveProps () {
    // hack to force google maps to redraw because we start with it hidden
    window.dispatchEvent(new Event('resize'));
    this.showOnMap()
  }

  apiIsLoaded () {
    this.setState({ locationApiLoaded: true })
  }

  onCategorySelect (category) {
    // TODO spinner
    // check if category is passed in from event or from componentDidMount or route
    if (typeof category === 'object') { // from using the select
      category = category.target.value
    }
    this.setState({ category: category })

    // only do the dispatch if the category is set, i.e. not '' the blank value
    if (category !== '') {
      this.props.dispatch(fetchServicesDirectory(categories[category].query))
      browserHistory.push(`/services-near-me/${category}`)
    } else {
      browserHistory.push(`/services-near-me`)
    }
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
  // TODO clear button for location

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

  computeDistances (results, location) {
    // this is kept separate from the service grouping loop so we can re-calculate
    // distance without having to re-group services
    if (!location.latitude || !location.longitude) {
      return null
    }

    results.forEach(service => {
      service.latitude = service.LATITUDE
      service.longitude = service.LONGITUDE
      service.distance = geolib.getDistanceSimple(location, service, 100) // 100 = round to 0.1 of a km
      // TODO use https://www.npmjs.com/package/geolib#geoliborderbydistanceobject-latlng-mixed-coords
    })

    results.sort((a, b) => {
      return a.distance - b.distance;
    })

    return results.slice(0, RESULTS_LIMIT)
  }

  groupServices (services) {
    // this function relies on providers being adjacent in the directory data
    let providers = []
    services.forEach((service, index) =>  {
      if (index > 1 && service.PROVIDER_NAME === services[index - 1].PROVIDER_NAME) {
        // same provider as the last service
        let last = providers.length - 1
        if (Array.isArray(providers[last].otherServices)) {
          providers[last].otherServices.push(service)
        } else {
          providers[last].otherServices = [service]
        }
      } else {
        providers.push(service)
      }
    })
    return providers
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
    const { locationApiLoaded, location, locationMeta, mapCenter, mapZoom, category } = this.state

    let results = this.groupServices(directory)
    results = this.computeDistances(results, location)

    let resultsClasses = classNames(
      'results',
      { 'hidden': !(category !== '' && location.latitude && location.longitude && results) }
    )

    let selectMoreInfoClasses = classNames(
      'select-more-info',
      { 'hidden': !!(category !== '' && location.latitude && location.longitude) }
    )

    return (
      <div>
        <h2>He ratonga e tata ana ki a au<br /><span className='english'>Services near me</span></h2>

        <label htmlFor="services-category">Category:</label>
        <select id="services-category" value={category} onChange={this.onCategorySelect}>
          <option value=''></option>
          {Object.keys(categories).map(key => {
            return (<option value={key} key={key}>{categories[key].label}</option>)
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

        <div className={resultsClasses}>
          {results &&
            <h3>Closest results near you [{results.length}/{directory.length}].</h3>
          }

          <div className='provider-list'>
            {results && results.map((provider, index) => {
              return <Provider key={'provider' + index} provider={provider} />
            })}
          </div>

          <div className='map-container'>
            <ResultMap apiIsLoaded={this.apiIsLoaded} center={mapCenter} zoom={mapZoom} markers={results} />
          </div>
        </div>

        <div className={selectMoreInfoClasses}>
          <h3>No results</h3>
          <p>Please select a category and search for your address.</p>
        </div>

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
  dispatch: PropTypes.func.isRequired,
  directory: PropTypes.array.isRequired,
  category: PropTypes.string
}

export default connect(mapStateToProps)(Services)
