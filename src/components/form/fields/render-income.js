// a income (number) and frequency of income (select) control for entitlements
import React, { Component, PropTypes } from 'react'
import get from 'lodash/get'
import renderError, { hasError } from './render-error'
import renderWarning from './render-warning'
import { makeMandatoryAriaLabel } from 'components/form/hoc/make-mandatory-label'

class IncomeField extends Component {
  constructor (props) {
    super(props)

    this.state = {
      amount: '',
      frequency: 'weekly'
    }

    this.setValues = this.setValues.bind(this)
    this.amountChange = this.amountChange.bind(this)
    this.frequencyChange = this.frequencyChange.bind(this)
    this.amountBlur = this.amountBlur.bind(this)
  }

  componentWillMount() {
    if (this.props.input.value) {
      this.setValues(this.props.input.value)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.input.value && nextProps.input.value !== this.props.input.value) {
      this.setValues(nextProps.input.value)
    }
  }

  setValues(array) {
    this.setState({
      amount: array[0],
      frequency: array[1]
    })
  }

  amountChange(event) {
    let normalisedValue = event.target.value.substring(0,8)
    this.setState({
      amount: normalisedValue
    })
    this.props.input.onChange([normalisedValue, this.state.frequency])
  }

  frequencyChange(event) {
    this.setState({
      frequency: event.target.value
    })
    this.props.input.onChange([this.state.amount, event.target.value])
  }

  amountBlur() {
    this.props.input.onBlur([this.state.amount, this.state.frequency])
  }

  render () {
    const {
      input,
      label, ariaLabel,
      placeholder,
      instructionText,
      options,
      meta: { touched, error, warning, form }
    } = this.props
    const {
      amount,
      frequency
    } = this.state

    return (
      <div className={`input-group ${hasError({ touched, error }) ? 'has-error' : ''}`}>
        { label && <label htmlFor={`${form}-${input.name}`}>{label}</label> }
        { instructionText && <div className="instruction-text">{instructionText}</div> }
        <div>
          <fieldset>
            <strong>$</strong>
            <input
              id={`${form}-${input.name}`}
              value={amount}
              placeholder={placeholder}
              type="number"
              aria-label={ariaLabel ? ariaLabel : null}
              aria-describedby={`${form}-${input.name}-desc`}
              className="currency-input"
              onChange={this.amountChange}
              onBlur={this.amountBlur}
              onKeyDown={e => {if (e.which === 13) e.preventDefault()}}
              onWheel={e => {if (`${form}-${input.name}` === document.activeElement.id) e.preventDefault() }}
            />
            <span className="styled-select">
              <select
                id={`${form}-${input.name}-frequency`}
                aria-label={makeMandatoryAriaLabel("Select income frequency")}
                value={frequency}
                onChange={this.frequencyChange}
              >
                {
                  options.map((option, idx) => {
                    if (typeof option === 'string' || typeof option === 'number') {
                      return <option value={option} key={`${input.name}-${idx}`}>{option}</option>
                    } else {
                      const value = get(option, 'value', '')
                      const display = get(option, 'display', '')
                      return <option value={value} key={`${input.name}-${idx}`}>{display}</option>
                    }
                  })
                }
              </select>
            </span>
          </fieldset>
          <div id={`${form}-${input.name}-desc`}>
            { renderError({ meta: { touched, error } }) }
            { renderWarning({ meta: { error, warning } }) }
          </div>
        </div>
      </div>
    )
  }
}

IncomeField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.node,
  ariaLabel: PropTypes.string,
  instructionText: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.array,
  meta: PropTypes.object
}

export default IncomeField
