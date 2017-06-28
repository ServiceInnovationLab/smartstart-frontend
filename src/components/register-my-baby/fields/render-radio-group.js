import React, { Component, PropTypes } from 'react'

class RadioGroup extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.radios = []
  }

  handleChange(option) {
    return event => {
      if(event.target.checked) {
        return this.props.onChange(option.value)
      }
    }
  }

  handleBlur(event) {
    const focusOutsideGroup = !event.relatedTarget || this.radios.indexOf(event.relatedTarget) === -1
    if (focusOutsideGroup) {
      this.props.onBlur(this.props.value)
    }
  }

  render() {
    const { options, value, name, ariaDescribedBy } = this.props;
    return (
      <div>
        { options.map((option, index) => (
            <label key={`${name}-${index}`}>
              <input type="radio"
                name={`${name}-group`}
                value={option.value}
                checked={value === option.value}
                onChange={this.handleChange(option)}
                onBlur={this.handleBlur}
                ref={ radio => this.radios = [radio, ...this.radios] }
                aria-describedby={ariaDescribedBy}
              />
              <span>{option.display}</span>
            </label>
          ))
        }
      </div>
    )
  }
}

RadioGroup.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func,
  onBlur: PropTypes.func
}

const renderRadioGroup = ({ input, label, instructionText, options, meta: { touched, error, warning, form } }) => (
  <fieldset>
    { label && <legend>{label}</legend> }
    { instructionText && <div className="instruction-text">{instructionText}</div> }
    <div className={`radio-group ${(touched && error) ? 'has-error' : ''}`}>
      <div>
        <RadioGroup
          name={input.name}
          value={input.value}
          options={options}
          onChange={input.onChange}
          onBlur={input.onBlur}
          ariaDescribedBy={`${form}-${input.name}-desc`}
        />

        <div id={`${form}-${input.name}-desc`}>
          {touched && error && <span className="error"><strong>Error:</strong> {error}</span>}
          {warning && <span className="warning"><strong>Warning:</strong> {warning}</span>}
        </div>
      </div>
    </div>
  </fieldset>
)

renderRadioGroup.propTypes = {
  input: PropTypes.object,
  name: PropTypes.string,
  label: PropTypes.node,
  instructionText: PropTypes.string,
  options: PropTypes.array,
  type: PropTypes.string,
  meta: PropTypes.object
}

export default renderRadioGroup
