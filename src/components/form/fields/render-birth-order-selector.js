import React, { Component, PropTypes } from 'react'
import renderError, { hasError } from './render-error'
import renderWarning from './render-warning'
import { makeMandatoryAriaLabel } from 'components/form/hoc/make-mandatory-label'

class BirthOrderSelector extends Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)

    this.state = {
      options: [1, 2, 3, 4, 5, 6],
      firstSelection: '',
      secondSelection: ''
    }
  }

  componentWillMount() {
    const { value } = this.props

    if (value) {
      this.parseValue(value)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value && nextProps.value !== this.props.value) {
      this.parseValue(nextProps.value)
    }
  }

  parseValue(value) {
    const [firstSelection, secondSelection] = value.split(' of ')

    if (firstSelection && secondSelection) {
      this.setState({
        firstSelection: parseInt(firstSelection),
        secondSelection: parseInt(secondSelection)
      })
    }
  }

  getValue() {
    const { firstSelection, secondSelection } = this.state

    if (firstSelection && secondSelection && firstSelection <= secondSelection) {
      return `${firstSelection} of ${secondSelection}`
    }

    return ''
  }

  handleChange(field) {
    return e =>
      this.setState({ [field]: e.target.value }, () =>
        this.props.onChange(this.getValue())
      )
  }

  handleBlur() {
    return e => {
      if (
        !e.relatedTarget ||
        (
          e.relatedTarget !== this.firstSelect &&
          e.relatedTarget !== this.secondSelect
        )
      ) {
        this.props.onBlur(this.getValue())
      }
    }
  }

  render() {
    const { firstSelection, secondSelection, options } = this.state

    const firstOptions = secondSelection ? options.filter(option => option <= secondSelection) : options
    const secondOptions = firstSelection ? options.filter(option => option > 1 && option >= firstSelection) : options

    return (
      <div className="aligner">
        <span className="styled-select">
          <select
            value={firstSelection}
            onChange={this.handleChange('firstSelection')}
            onBlur={this.handleBlur('firstSelection')}
            ref={ firstSelect => this.firstSelect = firstSelect }
            aria-describedby={this.props.ariaDescribedBy}
            aria-label={makeMandatoryAriaLabel("Select child's birth order")}
          >
            <option value=""></option>
            {
              firstOptions.map(val =>
                <option value={val} key={val}>{val}</option>
              )
            }
          </select>
        </span>
        <span className="aligner-item aligner-item-center"> &nbsp; of &nbsp; &nbsp;</span>
        <span className="styled-select">
          <select
            value={secondSelection}
            onChange={this.handleChange('secondSelection')}
            onBlur={this.handleBlur('secondSelection')}
            ref={ secondSelect => this.secondSelect = secondSelect }
            aria-describedby={this.props.ariaDescribedBy}
            aria-label={makeMandatoryAriaLabel("Select total number of births")}
          >
            <option value=""></option>
            {
              secondOptions.map(val =>
                <option value={val} key={val}>{val}</option>
              )
            }
          </select>
        </span>
      </div>
    )
  }
}

BirthOrderSelector.propTypes = {
  value: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func
}

const renderBirthOrderSelector = ({ input, label, instructionText, meta: { touched, error, warning, form } }) => (
  <fieldset>
    <legend>{label}</legend>
    { instructionText && <div className="instruction-text">{instructionText}</div> }
    <div className={`input-group ${hasError({ touched, error }) ? 'has-error' : ''}`}>
      <div>
        <BirthOrderSelector {...input} ariaDescribedBy={`${form}-${input.name}-desc`} />
        <div id={`${form}-${input.name}-desc`}>
          { renderError({ meta: { touched, error } }) }
          { renderWarning({ meta: { error, warning } }) }
        </div>
      </div>
    </div>
  </fieldset>
)

renderBirthOrderSelector.propTypes = {
  input: PropTypes.object,
  label: PropTypes.node,
  instructionText: PropTypes.string,
  meta: PropTypes.object
}

export default renderBirthOrderSelector

