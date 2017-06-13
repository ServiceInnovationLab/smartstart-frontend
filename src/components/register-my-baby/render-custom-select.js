import React, { PropTypes, Component } from 'react'
import Select from 'react-select'
import './custom-select.scss'

class CustomSelect extends Component {
  renderValue(option) {
    return <div>
      <div>{option.label}</div>
      { option.subLabel &&
        <em>{option.subLabel}</em>
      }
    </div>
  }
  renderOption(option) {
    return <div>
      <div>{option.label}</div>
      { option.subLabel &&
        <em>{option.subLabel}</em>
      }
    </div>
  }
  selectValue(option) {
    return option.value;
  }
  render() {
    const { input, label, placeholder, className, instructionText, options, meta: { touched, error, form } } = this.props;
    return <div className={`input-group ${className} ${(touched && error) ? 'has-error' : ''}`}>
        { label && <label htmlFor={`${form}-${input.name}`}>{label}</label> }
        { instructionText && <div className="instruction-text">{instructionText}</div> }
        <div>
          <Select
            id={`${form}-${input.name}`}
            name={input.name}
            value={input.value}
            valueRenderer={this.renderValue}
            optionRenderer={this.renderOption}
            selectValue={this.selectValue}
            placeholder={placeholder}
            options={options}
            clearable={false}
            searchable={false}
            onBlur={() => input.onBlur(input.value)}
            onChange={selected => input.onChange(selected.value)}
          />
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
  options: PropTypes.array,
  className: PropTypes.string,
  meta: PropTypes.object
}

export default CustomSelect

