/* globals google */
import React, { PropTypes, Component } from 'react'
import Autosuggest from 'react-autosuggest'
import debounce from 'lodash/debounce'

const getSuggestionValue = suggestion => suggestion.name

const renderSuggestion = suggestion => (
  <span>{suggestion.name}</span>
)

// whatever page wants to use this component should have the google js available
// this is usually achieved by wrapping the parent component in a scriptLoader
// The component should be invoked with at least the following:
// <LocationAutosuggest
//   onPlaceSelect={<FUNCTION TO HANDLE PLACE BEING SELECTED>}
//   inputProps={{
//     value: <VALUE FROM STORE OR STATE>,
//     onChange: <FUNCTION TO UPDATE THE INPUT VALUE>
//     autoComplete: 'off'
//   }}
// />

class LocationAutosuggest extends Component {
  constructor(props) {
    super(props)

    this.state = {
      suggestions: []
    }

    this.debouncedLoadSuggestions = debounce(this.loadSuggestions, 300)
    this.autocompleteCallback = this.autocompleteCallback.bind(this)
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this)
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this)
  }

  componentDidMount() {
    this.placeService = new google.maps.places.PlacesService(document.createElement('div'))
    this.autocompleteService = new google.maps.places.AutocompleteService()
    this.autocompleteOK = google.maps.places.PlacesServiceStatus.OK
  }

  autocompleteCallback(predictions, status) {
    if (status != this.autocompleteOK) {
      this.setState({ suggestions: [] })
      return
    }

    this.setState({
      suggestions: predictions.map((p) => ({
        name: p.description,
        placeId: p.place_id
      }))
    })
  }

  loadSuggestions(value) {
    const options = {
      location: new google.maps.LatLng(-41, 174),
      radius: 2000,
      types: ['address'],
      input: value
    }
    this.autocompleteService.getPlacePredictions(options, this.autocompleteCallback)
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.debouncedLoadSuggestions(value)
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    })
  }

  onSuggestionSelected(event, { suggestion }) {
    // prevent submitting the form
    event.preventDefault()

    const { onPlaceSelect } = this.props

    if (typeof onPlaceSelect === 'function') {
      this.placeService.getDetails({ placeId: suggestion.placeId }, (place, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          onPlaceSelect(place)
        }
      })
    }
  }

  render() {
    const { inputProps } = this.props
    const { suggestions } = this.state

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{...inputProps}}
      />
    )
  }
}

LocationAutosuggest.propTypes = {
  inputProps: PropTypes.object,
  onPlaceSelect: PropTypes.func
}

export default LocationAutosuggest
