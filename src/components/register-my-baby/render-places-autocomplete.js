/* globals google */
import React, { PropTypes, Component } from 'react'
import PlacesAutocomplete from 'react-places-autocomplete'

class renderPlacesAutocomplete extends Component {
  constructor(props) {
    super(props)

    this.handleSelect = this.handleSelect.bind(this)
    this.service = new google.maps.places.PlacesService(document.createElement('div'));
  }

  handleSelect(address, placeId) {
    const { onPlaceSelect, input: { onChange } } = this.props;

    onChange(address)

    if (typeof onPlaceSelect === 'function') {
      this.service.getDetails({ placeId }, (place, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          onPlaceSelect(place)
        }
      });
    }
  }

  render() {
    const { input, label, placeholder, instructionText, meta: { touched, error, warning, form } } = this.props;

    // prefer New Zealand address
    const options = {
      location: new google.maps.LatLng(-36, 174),
      radius: 2000,
      types: ['address']
    }

    const cssClasses = {
      autocompleteContainer: 'google-autocomplete-container',
      autocompleteItem: 'google-autocomplete-item',
      autocompleteItemActive: 'google-autocomplete-item-active',
    }

    return <div className={`input-group ${(touched && error) ? 'has-error' : ''}`}>
      { label && <label htmlFor={`${form}-${input.name}`}>{label}</label> }
      { instructionText && <div className="instruction-text">{instructionText}</div> }
      <div>
        <PlacesAutocomplete
          inputProps={{
            ...input,
            placeholder,
            autoComplete: 'off',
            id: `${form}-${input.name}`
          }}
          classNames={cssClasses}
          options={options}
          onSelect={this.handleSelect}
        />
        {touched && error && <span className="error"><strong>Error:</strong> {error}</span>}
        {warning && <span className="warning"><strong>Warning:</strong> {warning}</span>}
      </div>
    </div>
  }
}

renderPlacesAutocomplete.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  instructionText: PropTypes.string,
  placeholder: PropTypes.string,
  onPlaceSelect: PropTypes.func,
  meta: PropTypes.object
}

export default renderPlacesAutocomplete
