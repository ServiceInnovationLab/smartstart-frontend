import React, { PropTypes, Component } from 'react'
import Select from 'react-select'
import { getTextContent } from '../../utils'
import './custom-select.scss'

class CustomSelect extends Component {
  constructor(props) {
    super(props)
    this.clearRenderer = this.clearRenderer.bind(this)
  }

  clearRenderer() {
    return <a href="#" title="Clear value" aria-label="Clear value"
      onClick={(e) => {
        e.preventDefault()
        this.props.input.onChange(null)
      }}
    ></a>
  }

  render() {
    const {
      input, label, placeholder, className, instructionText, options, meta: { touched, error, form },
      clearable = false, searchable = false, labelKey = 'label', valueKey = 'value',
      optionRenderer, valueRenderer
    } = this.props;

    const selectProps = {
        id: `${form}-${input.name}`,
        name: input.name,
        value: input.value,
        placeholder,
        options,
        labelKey,
        valueKey,
        clearable,
        searchable,
        onBlur: () => input.onBlur(input.value),
        onChange: selected => input.onChange(selected ? selected[valueKey] : null)
    }

    if (optionRenderer) {
      selectProps.optionRenderer = optionRenderer
    }

    if (valueRenderer) {
      selectProps.valueRenderer = valueRenderer
    }

    if (clearable) {
      selectProps.clearRenderer = this.clearRenderer
    }

    return <div className={`input-group ${className} ${(touched && error) ? 'has-error' : ''}`}>
        { label && <label htmlFor={`${form}-${input.name}`}>{label}</label> }
        { instructionText && <div className="instruction-text">{instructionText}</div> }
        <div>
          <Select
            {...selectProps}
            id={`${form}-${input.name}`}
            aria-describedby={(touched && error) ? `${form}-${input.name}-error` : null}
            aria-label={getTextContent(label)}
          />
          {touched && error && <span id={`${form}-${input.name}-error`} className="error"><strong>Error:</strong> {error}</span>}
        </div>
      </div>
  }
}

CustomSelect.propTypes = {
  input: PropTypes.object,
  label: PropTypes.node,
  instructionText: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  options: PropTypes.array,
  labelKey: PropTypes.string,
  valueKey: PropTypes.string,
  optionRenderer: PropTypes.func,
  valueRenderer: PropTypes.func,
  clearable: PropTypes.bool,
  searchable: PropTypes.bool,
  meta: PropTypes.object
}

export default CustomSelect

