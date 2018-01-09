import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import geolib from 'geolib'
import classNames from 'classnames'
import { browserHistory } from 'react-router'
import { StickyContainer, Sticky } from 'react-sticky'
import scriptLoader from 'react-async-script-loader'
import { fetchServicesDirectory } from 'actions/services'
import LocationAutosuggest from 'components/location-autosuggest/location-autosuggest'
import ResultMap from 'components/services/map'
import Provider from 'components/services/provider'
import Spinner from 'components/spinner/spinner'

import './services.scss'

const RESULTS_LIMIT = 50
const categories = {
  'parenting-support': {
    'label': 'Parenting support',
    'query': '/api/request/service-locations/parenting-support'
  },
  'early-education': {
    'label': 'Early childhood education',
    'query': '/api/request/service-locations/early-education'
  },
  'breastfeeding': {
    'label': 'Breastfeeding support',
    'query': '/api/request/service-locations/breastfeeding'
  },
  'antenatal': {
    'label': 'Antenatel classes',
    'query': '/api/request/service-locations/antenatal'
  },
  'mental-health': {
    'label': 'Anxiety and depression support',
    'query': '/api/request/service-locations/mental-health'
  },
  'budgeting': {
    'label': 'Budgeting and financial help',
    'query': '/api/request/service-locations/budgeting'
  },
  'well-child': {
    'label': 'Well Child/Tamariki Ora providers',
    'query': '/api/request/service-locations/well-child'
  }
}

class Services extends Component {
  constructor (props) {
    super(props)

    this.state = {
      category: '',
      listView: true,
      locationText: '',
      location: { latitude: null, longitude: null },
      mapCenter: { lat: -41.295378, lng: 174.778684 },
      mapZoom: 5,
      results: [],
      groupedResults: [],
      loading: false,
      googleLibAvailable: false
    }

    this.setLocationFromStore = this.setLocationFromStore.bind(this)
    this.onLocationSelect = this.onLocationSelect.bind(this)
    this.onLocationTextChange = this.onLocationTextChange.bind(this)
    this.onNoLocationSelect = this.onNoLocationSelect.bind(this)
    this.onCategorySelect = this.onCategorySelect.bind(this)
    this.showOnMap = this.showOnMap.bind(this)
    this.changeTabAndShowOnMap = this.changeTabAndShowOnMap.bind(this)
    this.clickListTab = this.clickListTab.bind(this)
    this.clickMapTab = this.clickMapTab.bind(this)
    this.clearLocation = this.clearLocation.bind(this)
  }

  componentDidMount () {
    const { isScriptLoaded, isScriptLoadSucceed, category, personalisationValues } = this.props

    if (isScriptLoaded && isScriptLoadSucceed) {
      this.setState({ googleLibAvailable: true })
    }

    if (category && categories[category]) {
      this.onCategorySelect(category)
    }

    if (personalisationValues.settings && personalisationValues.settings.loc) {
      this.setLocationFromStore(personalisationValues.settings.loc)
    }
  }

  componentWillReceiveProps (nextProps) {
    let hasDirectoryDataChanged = false

    if (nextProps.isScriptLoaded && !this.props.isScriptLoaded) { // script load finished
      if (nextProps.isScriptLoadSucceed) {
        this.setState({ googleLibAvailable: true })
      }
    }

    hasDirectoryDataChanged = !!(nextProps.directory && nextProps.directory !== this.props.directory)
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

    if (nextProps.personalisationValues.settings && nextProps.personalisationValues.settings.loc) {
      this.setLocationFromStore(nextProps.personalisationValues.settings.loc)
    }
  }

  setLocationFromStore (location) {
    if (location.text && !this.state.location.text) {
      this.setState({
        location: { latitude: location.latitude, longitude: location.longitude, text: location.text },
        locationText: location.text
      }, () => {
        this.showOnMap(this.state.location)
      })
    }
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
          longitude: locationDetail.geometry.location.lng(),
          text: locationDetail.formatted_address
        }
      }, () => {
        // we need to re-calculate distances
        this.computeDistances(this.state.groupedResults)
      })
    }
  }

  onLocationTextChange (event, { newValue }) {
    this.setState({
      locationText: newValue
    })
  }

  onNoLocationSelect () {
    // when clicking away from the control, blank it if a proper location hasn't
    // yet been selected, or return to last selected value
    if (!this.state.location.text) {
      this.setState({
        locationText: '',
        location: { latitude: null, longitude: null, text: '' }
      })
    } else {
      this.setState({
        locationText: this.state.location.text
      })
    }
  }

  clearLocation () {
    this.setState({
      locationText: '',
      location: { latitude: null, longitude: null }
    })
  }

  showOnMap (location) {
    if (location.latitude && location.longitude) {
      this.setState({
        mapCenter: {
          lat: location.latitude,
          lng: location.longitude
        },
        mapZoom: 13
      })
    }
  }

  changeTabAndShowOnMap (location) {
    // we need a separate function for use by the list so the normal showOnMap
    // (which gets called from a lot of places) doesn't do the tab switch
    if (location.latitude && location.longitude) {
      // reset the mobile view to map
      this.setState({
        listView: false
      }, () => {
        // it's very important to wait until the map is visible before trying
        // to center it - otherwise the centering won't work properly
        this.setState({
          mapCenter: {
            lat: location.latitude,
            lng: location.longitude
          },
          mapZoom: 13
        })
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

  clickListTab () {
    this.setState({
      listView: true
    })
  }

  clickMapTab () {
    this.setState({
      listView: false
    })
  }

  render () {
    const { directoryError } = this.props
    const { category, listView, location, locationText, mapCenter, mapZoom, results, loading, googleLibAvailable } = this.state

    const loadErrorClasses = classNames(
      'load-error',
      { 'hidden': !directoryError }
    )
    const resultsWrapperClasses = classNames({ 'hidden': directoryError })
    const resultsClasses = classNames(
      'results',
      { 'hidden': !(category !== '' && location.latitude && location.longitude && results.length && !loading) }
    )
    const selectMoreInfoClasses = classNames(
      'select-more-info',
      { 'hidden': !!(category !== '' && location.latitude && location.longitude) }
    )
    const locationClearClasses = classNames(
      'inline-clear-field',
      { 'hidden': locationText === ''}
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
        <div className='services-controls clearfix'>
          <div className='services-category'>
            <label data-test='services-category' htmlFor='services-category-field'>
              Category:
            </label>
            <select value={category} onChange={this.onCategorySelect} id='services-category-field'>
              <option value=''>Please select a category</option>
              {Object.keys(categories).map(key => {
                return (<option value={key} key={key}>{categories[key].label}</option>)
              })}
            </select>
          </div>

          {googleLibAvailable && <div className='services-location'>
            <label data-test='services-location' htmlFor='services-location-field'>
              Location:
            </label>
            <LocationAutosuggest
              id='services-location-field'
              onPlaceSelect={this.onLocationSelect}
              onNoSelection={this.onNoLocationSelect}
              inputProps={{
                value: locationText,
                onChange: this.onLocationTextChange,
                autoComplete: 'off',
                placeholder: 'Start typing an address'
              }}
            />
            <button onClick={this.clearLocation} className={locationClearClasses}>
              <span className='visuallyhidden'>Clear location</span>
            </button>
          </div>}
        </div>

        <div className={loadErrorClasses}><h3>Unable to load</h3><p>Please try again shortly.</p></div>
        <div className={resultsWrapperClasses}>
          {loading && location.latitude && location.longitude && <Spinner />}

          <div className={resultsClasses}>
            <h3>Closest results near you</h3>

            <div className='map-list-tabs' aria-hidden='true'>
              <button onClick={this.clickListTab} className={listTabClasses} data-test='services-list-tab'>List view</button>
              <button onClick={this.clickMapTab} className={mapTabClasses} data-test='services-map-tab'>Map view</button>
            </div>

            <div className='results-layout'>
              <div className={listViewClasses} data-test='services-list'>
                {results.length && results.map((provider, index) => {
                  return <Provider key={'provider' + index} provider={provider} recenterMap={this.changeTabAndShowOnMap} />
                })}
              </div>

              {googleLibAvailable && <StickyContainer className='map-container-wrapper'>
                <Sticky>
                  {
                    ({ style }) => {
                      return (
                        <div style={style} className={mapViewClasses} aria-hidden='true' data-test='services-map'>
                          <ResultMap center={mapCenter} zoom={mapZoom} markers={results} showList={this.clickListTab} />
                        </div>
                      )
                    }
                  }
                </Sticky>
              </StickyContainer>}
            </div>
          </div>

          <div className={selectMoreInfoClasses} data-test='services-no-results'>
            <h3>No results</h3>
            <p>Please select a category and search for your address.</p>
          </div>
        </div>

      </div>
    )
  }
}

function mapStateToProps (state) {
  const {
    servicesActions,
    personalisationActions
  } = state
  const {
    directory,
    directoryError
  } = servicesActions || {
    directory: [],
    directoryError: false
  }
  const {
    personalisationValues
  } = personalisationActions || {
    personalisationValues: {}
  }

  return {
    directory,
    directoryError,
    personalisationValues
  }
}

Services.propTypes = {
  dispatch: PropTypes.func.isRequired,
  directory: PropTypes.array.isRequired,
  directoryError: PropTypes.bool.isRequired,
  category: PropTypes.string,
  personalisationValues: PropTypes.object,
  isScriptLoaded: PropTypes.bool,
  isScriptLoadSucceed: PropTypes.bool
}

export default scriptLoader(
  `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`
)(connect(mapStateToProps)(Services))
