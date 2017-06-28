/* globals google */
import React, { PropTypes, Component } from 'react'
import Autosuggest from 'react-autosuggest'
import debounce from 'lodash/debounce'
import './autocomplete.scss'

const getSuggestionValue = suggestion => suggestion.name

const renderSuggestion = suggestion => (
  <span>{suggestion.name}</span>
)

class renderPlacesAutocomplete extends Component {
  constructor(props) {
    super(props)

    this.state = {
      suggestions: []
    }

    this.debouncedLoadSuggestions = debounce(this.loadSuggestions, 300)
    this.autocompleteCallback = this.autocompleteCallback.bind(this)
    this.onChange = this.onChange.bind(this)
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

    const { onPlaceSelect, input: { onChange } } = this.props

    onChange(suggestion.name)

    if (typeof onPlaceSelect === 'function') {
      this.placeService.getDetails({ placeId: suggestion.placeId }, (place, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          onPlaceSelect(place)
        }
      })
    }
  }

  // redux-form's onChange signature is differrent with Autosuggest
  onChange(event, { newValue }) {
    this.props.input.onChange(newValue)
  }

  render() {
    const { input, label, placeholder, instructionText, meta: { touched, error, warning, form } } = this.props
    const { suggestions } = this.state

    return <div className={`input-group places-autocomplete ${(touched && error) ? 'has-error' : ''}`}>
      { label && <label htmlFor={`${form}-${input.name}`}>{label}</label> }
      { instructionText && <div className="instruction-text">{instructionText}</div> }
      <div>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={{
            ...input,
            value: input.value || '',
            onChange: this.onChange,
            placeholder,
            autoComplete: 'off',
            id: `${form}-${input.name}`,
            'aria-describedby': `${form}-${input.name}-desc`
          }}
        />
        <div id={`${form}-${input.name}-desc`}>
          {touched && error && <span className="error"><strong>Error:</strong> {error}</span>}
          {warning && <span className="warning"><strong>Warning:</strong> {warning}</span>}
        </div>
      </div>
    </div>
  }
}

renderPlacesAutocomplete.propTypes = {
  input: PropTypes.object,
  label: PropTypes.node,
  instructionText: PropTypes.string,
  placeholder: PropTypes.string,
  onPlaceSelect: PropTypes.func,
  meta: PropTypes.object
}

export default renderPlacesAutocomplete
