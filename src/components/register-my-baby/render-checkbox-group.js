import React, { Component, PropTypes } from 'react'

class CheckboxGroup extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.checkboxes = []
  }

  handleChange(option) {
    return event => {
      const newValue = [...this.props.value]
      if(event.target.checked) {
        newValue.push(option.value)
      } else {
        newValue.splice(newValue.indexOf(option.value), 1)
      }
      return this.props.onChange(newValue)
    }
  }

  handleBlur(event) {
    const focusOutsideGroup = !event.relatedTarget || this.checkboxes.indexOf(event.relatedTarget) === -1
    if (focusOutsideGroup) {
      this.props.onBlur(this.props.value)
    }
  }

  render() {
    const { options, value, name } = this.props;
    return (
      <div>
        { options.map((option, index) => (
            <label key={index}>
              <input type="checkbox"
                name={`${name}[${index}]`}
                value={option.value}
                checked={value.indexOf(option.value) !== -1}
                onChange={this.handleChange(option)}
                onBlur={this.handleBlur}
                ref={ checkbox => this.checkboxes = [checkbox, ...this.checkboxes] }
              />
              <span>{option.display}</span>
            </label>
          ))
        }
      </div>
    )
  }
}

CheckboxGroup.propTypes = {
  name: PropTypes.string,
  value: PropTypes.array,
  options: PropTypes.array,
  onChange: PropTypes.func,
  onBlur: PropTypes.func
}

const renderCheckboxGroup = ({ input, label, instructionText, options, meta: { touched, error } }) => (
  <fieldset>
    { label && <legend>{label}</legend> }
    { instructionText && <div className="instruction-text">{instructionText}</div> }
    <div className={`checkbox-group ${(touched && error) ? 'has-error' : ''}`}>
      <div>
        <CheckboxGroup
          name={input.name}
          value={input.value || []}
          options={options}
          onChange={input.onChange}
          onBlur={input.onBlur}
        />
        {touched && error && <span className="error"><strong>Error:</strong> {error}</span>}
      </div>
    </div>
  </fieldset>
)

renderCheckboxGroup.propTypes = {
  input: PropTypes.object,
  name: PropTypes.string,
  label: PropTypes.string,
  instructionText: PropTypes.string,
  options: PropTypes.array,
  type: PropTypes.string,
  meta: PropTypes.object
}

export default renderCheckboxGroup
