/* globals google */
import React, { PropTypes, Component } from 'react'
import LocationAutosuggest from 'components/location-autosuggest/location-autosuggest'
import renderError, { hasError } from './render-error'
import renderWarning from './render-warning'
import './autocomplete.scss'

class renderPlacesAutocomplete extends Component {
  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)
  }

  // redux-form's onChange signature is different with Autosuggest
  onChange(event, { newValue }) {
    this.props.input.onChange(newValue)
  }

  render() {
    const { input, label, placeholder, instructionText, meta: { touched, error, warning, form }, onPlaceSelect } = this.props

    return <div className={`input-group places-autocomplete ${hasError({ touched, error }) ? 'has-error' : ''}`}>
      { label && <label htmlFor={`${form}-${input.name}`}>{label}</label> }
      { instructionText && <div className="instruction-text">{instructionText}</div> }
      <div>
        <LocationAutosuggest
          onPlaceSelect={onPlaceSelect}
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
          { renderError({ meta: { touched, error } }) }
          { renderWarning({ meta: { error, warning } }) }
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
