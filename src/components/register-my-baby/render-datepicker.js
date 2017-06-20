import React, { Component, PropTypes } from 'react'
import moment from 'moment'

const DAYS = []
const MONTHS = [
  { key: 0, value: 'January'},
  { key: 1, value: 'February'},
  { key: 2, value: 'March'},
  { key: 3, value: 'April'},
  { key: 4, value: 'May'},
  { key: 5, value: 'June'},
  { key: 6, value: 'July'},
  { key: 7, value: 'August'},
  { key: 8, value: 'September'},
  { key: 9, value: 'October'},
  { key: 10, value: 'November'},
  { key: 11, value: 'December'}
]
const YEARS = []

for(let i = 1 ; i <= 31; i ++) {
  DAYS.push(i)
}

for(let i = new Date().getFullYear() ; i >= 1907; i --) {
  YEARS.push(i)
}

class SimpleDatePicker extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)

    this.state = {
      day: null,
      month: null,
      year: null,
      days: DAYS,
      months: MONTHS,
      years: YEARS
    }
  }

  componentWillMount() {
    const { value } = this.props

    if (value) {
      this.parseDate(value)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value && nextProps.value !== this.props.value) {
      this.parseDate(nextProps.value)
    }
  }

  parseDate(value) {
    const d = moment(value)

    if (d.isValid()) {
      this.setState({
        day: d.date(),
        month: d.month(),
        year: d.year()
      })
    }
  }

  getSelectedDate() {
    const { day, month, year } = this.state

    if (
      typeof day !== 'undefined' && day !== null &&
      typeof month !== 'undefined' && month !== null &&
      typeof year !== 'undefined' && year !== null
    ) {
      return moment([year, month, day])
    }

    return null
  }

  handleChange(field) {
    return e =>
      this.setState({ [field]: e.target.value }, () => {
        this.props.onChange(this.getSelectedDate())
      })
  }

  /**
   * Only trigger blur event when user focus outside the datepicker
   * This will help redux-form to mark the field as `touched` correctly
   */
  handleBlur(e) {
    if (
      !e.relatedTarget ||
      (
        e.relatedTarget !== this.daySelect &&
        e.relatedTarget !== this.monthSelect &&
        e.relatedTarget !== this.yearSelect
      )
    ) {
      this.props.onBlur(this.getSelectedDate())
    }
  }

  render() {
    const { day, month, year, days, months, years } = this.state
    const { ariaDescribedBy } = this.props;
    return (
      <div>
        <span className="styled-select">
          <select
            value={day || ''}
            onChange={this.handleChange('day')}
            onBlur={this.handleBlur}
            ref={ daySelect => this.daySelect = daySelect }
            aria-describedby={ariaDescribedBy}
          >
            <option value="">Day</option>
            {
              days.map(val =>
                <option value={val} key={val}>{val}</option>
              )
            }
          </select>
        </span>
        <span className="styled-select">
          <select
            value={month === 0 ? month : (month ||  '')}
            onChange={this.handleChange('month')}
            onBlur={this.handleBlur}
            ref={ monthSelect => this.monthSelect = monthSelect }
            aria-describedby={ariaDescribedBy}
          >
            <option value="">Month</option>
            {
              months.map(m =>
                <option value={m.key} key={m.key}>{m.value}</option>
              )
            }
          </select>
        </span>
        <span className="styled-select">
          <select
            value={year || ''}
            onChange={this.handleChange('year')}
            onBlur={this.handleBlur}
            ref={ yearSelect => this.yearSelect = yearSelect }
            aria-describedby={ariaDescribedBy}
          >
            <option value="">Year</option>
            {
              years.map(val =>
                <option value={val} key={val}>{val}</option>
              )
            }
          </select>
        </span>
      </div>
    )
  }
}

SimpleDatePicker.propTypes = {
  value: PropTypes.object,
  ariaDescribedBy: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func
}

const renderDatepicker = ({ input, label, meta: { touched, error, warning, form } }) => (

  <fieldset>
    <legend>{label}</legend>
    <div className={`input-group ${(touched && error) ? 'has-error' : ''}`}>
      <div>
        <SimpleDatePicker
          value={input.value || null}
          onChange={input.onChange}
          onBlur={input.onBlur}
          ariaDescribedBy={(touched && error) ? `${form}-${input.name}-error` : null}
        />
        {touched && error && <span id={`${form}-${input.name}-error`} className="error"><strong>Error:</strong> {error}</span>}
        {touched && warning && <span className="warning"><strong>Warning:</strong> {warning}</span>}
      </div>
    </div>
  </fieldset>
)

renderDatepicker.propTypes = {
  input: PropTypes.object,
  label: PropTypes.node,
  meta: PropTypes.object
}

export default renderDatepicker

