import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import geolib from 'geolib'
import classNames from 'classnames'
import { browserHistory } from 'react-router'
import { StickyContainer, Sticky } from 'react-sticky'
import { fetchServicesDirectory } from 'actions/services'
import LocationAutocomplete from 'components/register-my-baby/fields/render-places-autocomplete'
import ResultMap from 'components/services/map'
import Provider from 'components/services/provider'
import Spinner from 'components/spinner/spinner'
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
      listView: true,
      locationApiLoaded: false,
      locationText: '',
      locationMeta: {
        touched: false,
        error: null,
        warning: null,
        form: 'services'
      },
      location: { latitude: null, longitude: null }, // TODO this should come from props
      mapCenter: { lat: -41.295378, lng: 174.778684 },
      mapZoom: 5,
      results: [],
      groupedResults: [],
      loading: false
    }

    this.onLocationSelect = this.onLocationSelect.bind(this)
    this.onCategorySelect = this.onCategorySelect.bind(this)
    this.apiIsLoaded = this.apiIsLoaded.bind(this)
    this.showOnMap = this.showOnMap.bind(this)
    this.clickListTab = this.clickListTab.bind(this)
    this.clickMapTab = this.clickMapTab.bind(this)
  }

  componentDidMount () {
    // TODO set location from props if it exists
    this.showOnMap(this.state.location)

    if (this.props.category && categories[this.props.category]) {
      this.onCategorySelect(this.props.category)
    }
  }

  componentWillReceiveProps (nextProps) {
    let hasDirectoryDataChanged = !!(nextProps.directory && nextProps.directory !== this.props.directory)

    if (hasDirectoryDataChanged) {
      // this is the earliest that we recieve the data back from the dispatch
      // we only need to recompute grouping if we switched datasets
      this.setState({
        loading: false,
        groupedResults: this.groupServices(nextProps.directory) // store so no re-grouping when location changes
      }, () => {
        this.computeDistances(this.state.groupedResults)
      })
    }

    if (this.state.category === '') {
      this.setState({ loading: false })
    }
  }

  componentDidUpdate () {
    // hack to force google maps to redraw because we start with it hidden
    window.dispatchEvent(new Event('resize'))
  }

  apiIsLoaded () {
    this.setState({ locationApiLoaded: true })
  }

  onCategorySelect (category) {
    // check if category is passed in from event or from componentDidMount or route
    if (typeof category === 'object') { // from using the select
      category = category.target.value
    }
    this.setState({ category: category })

    // only do the dispatch if the category is set, i.e. not '' the blank value
    if (category !== '') {
      this.setState({ loading: true })
      this.props.dispatch(fetchServicesDirectory(categories[category].query))
      browserHistory.replace(`/services-near-me/${category}`)
    } else {
      browserHistory.replace(`/services-near-me`)
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
        // we need to re-calculate distances
        this.computeDistances(this.state.groupedResults)
      })
    }
  }

  // TODO clear button for location

  showOnMap (location) {
    if (location.latitude && location.longitude) {
      this.setState({
        mapCenter: {
          lat: location.latitude,
          lng: location.longitude
        },
        mapZoom: 13
      }, () => {
        if (this.state.listView) {
          this.clickMapTab()
        }
      })
    }
  }

  computeDistances (results) {
    // this is kept separate from the service grouping loop so we can
    // re-calculate distance without having to re-group services

    const { location } = this.state

    if (!location.latitude || !location.longitude) {
      this.setState({ results: [] })
      return
    }

    results = geolib.orderByDistance(location, results)

    this.setState({
      results: results.slice(0, RESULTS_LIMIT)
    }, () => {
      this.showOnMap(this.state.location)
    })
  }

  groupServices (services) {
    // this function relies on providers being adjacent in the directory data
    let providers = []
    services.forEach((service, index) =>  {
      // do some setup for computeDistances
      service.latitude = service.LATITUDE
      service.longitude = service.LONGITUDE

      // check if it is the same provider as the last service
      if (index > 1 && service.PROVIDER_NAME === services[index - 1].PROVIDER_NAME) {
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

  clickListTab () {
    this.setState({
      listView: true
    })
  }

  clickMapTab () {
    this.setState({
      listView: false
    }, () => {
      // hack to force google maps to redraw because it was hidden
      window.dispatchEvent(new Event('resize'));
    })
  }

  render () {
    const { directory } = this.props
    const { category, listView, locationApiLoaded, location, locationMeta, mapCenter, mapZoom, results, loading } = this.state

    const resultsClasses = classNames(
      'results',
      { 'hidden': !(category !== '' && location.latitude && location.longitude && results.length && !loading) }
    )
    const selectMoreInfoClasses = classNames(
      'select-more-info',
      { 'hidden': !!(category !== '' && location.latitude && location.longitude) }
    )
    const listViewClasses = classNames(
      'provider-list',
      { 'inactive': !listView }
    )
    const mapViewClasses = classNames(
      'map-container',
      { 'inactive': listView }
    )
    const listTabClasses = classNames({ 'active': listView })
    const mapTabClasses = classNames({ 'active': !listView })

    return (
      <div>
        <label htmlFor="services-category">Category:</label>
        <select id="services-category" value={category} onChange={this.onCategorySelect}>
          <option value=''>Please select a category</option>
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

        {loading && location.latitude && location.longitude && <Spinner />}

        <div className={resultsClasses}>
          <h3>Closest results near you [{results.length}/{directory.length}].</h3>

          <div className='map-list-tabs' aria-hidden='true'>
            <button onClick={this.clickListTab} className={listTabClasses}>List view</button>
            <button onClick={this.clickMapTab} className={mapTabClasses}>Map view</button>
          </div>

          <div className='results-layout'>
            <div className={listViewClasses}>
              {results.length && results.map((provider, index) => {
                return <Provider key={'provider' + index} provider={provider} recenterMap={this.showOnMap} />
              })}
            </div>

            <StickyContainer className='map-container-wrapper'>
              <Sticky>
                {
                  ({ style }) => {
                    return (
                      <div style={style} className={mapViewClasses} aria-hidden='true'>
                        <ResultMap apiIsLoaded={this.apiIsLoaded} center={mapCenter} zoom={mapZoom} markers={results} showList={this.clickListTab} />
                      </div>
                    )
                  }
                }
              </Sticky>
            </StickyContainer>
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
