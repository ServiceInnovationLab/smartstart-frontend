import React, { PropTypes, Component } from 'react'
import Select from 'react-select'
import './custom-select.scss'

class CustomSelect extends Component {
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
        onChange: selected => input.onChange(selected[valueKey])
    }

    if (optionRenderer) {
      selectProps.optionRenderer = optionRenderer
    }

    if (valueRenderer) {
      selectProps.valueRenderer = valueRenderer
    }

    return <div className={`input-group ${className} ${(touched && error) ? 'has-error' : ''}`}>
        { label && <label htmlFor={`${form}-${input.name}`}>{label}</label> }
        { instructionText && <div className="instruction-text">{instructionText}</div> }
        <div>
          <Select {...selectProps} />
          {touched && error && <span className="error"><strong>Error:</strong> {error}</span>}
        </div>
      </div>
  }
}

CustomSelect.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
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

