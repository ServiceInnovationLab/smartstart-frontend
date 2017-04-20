import React, { Component, PropTypes } from 'react'

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
        e.relatedTarget !== this.firstSelect &&
        e.relatedTarget !== this.secondSelect
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
  onChange: PropTypes.func,
  onBlur: PropTypes.func
}

const renderBirthOrderSelector = ({ input, label, meta: { touched, error } }) => (
  <fieldset>
    <legend>{label}</legend>
    <div className="instruction-text">If this child was the second born of triplets select 2 of 3</div>
    <div className={`input-group ${(touched && error) ? 'has-error' : ''}`}>
      <div>
        <BirthOrderSelector {...input} />
        {touched && error && <span>{error}</span>}
      </div>
    </div>
  </fieldset>
)

renderBirthOrderSelector.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  meta: PropTypes.object
}

export default renderBirthOrderSelector

