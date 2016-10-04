import './task.scss'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { savePersonalisationValues } from 'actions/actions'

class Task extends Component {
  constructor (props) {
    super(props)

    this.state = {
      checked: false,
      checkedClass: ''
    }

    this.setCheckboxValuesFromStore = this.setCheckboxValuesFromStore.bind(this)
  }

  componentWillMount () {
    this.setCheckboxValuesFromStore(this.props.personalisationValues.checkboxes, this.props.id)
  }

  componentWillReceiveProps (nextProps) {
    this.setCheckboxValuesFromStore(nextProps.personalisationValues.checkboxes, nextProps.id)
  }

  setCheckboxValuesFromStore (allCheckboxValues, checkboxID) {
    if (allCheckboxValues) {
      let thisCheckbox = allCheckboxValues[checkboxID.toString()]

      if (thisCheckbox === 'true') {
        this.state = {
          checked: true,
          checkedClass: 'checked'
        }
      }
    }
  }

  handleChange () {
    this.setState({checked: !this.state.checked}, () => {
      // further changes needs to occur as callback to ensure state change executed first
      if (this.state.checked) {
        this.setState({checkedClass: 'checked'})
      } else {
        this.setState({checkedClass: ''})
      }

      // values to save to backend or cookie
      let valuesToSave = [{
        'group': 'checkboxes',
        'key': this.props.id.toString(),
        'val': this.state.checked.toString()
      }]

      // save values to store
      this.props.dispatch(savePersonalisationValues(valuesToSave))
    })
  }

  render () {
    let labelText = ''
    let elementId = 'task-' + this.props.id

    if (this.props.type === 'plaintext' && this.props.text) {
      labelText = this.props.text
    } else {
      // can't trust text will not have markup if not plaintext type, so use label
      labelText = this.props.label
    }

    return (
      <div className='task'>
        <p>
          <label className={this.state.checkedClass}>
            <input id={elementId} type='checkbox' data-test='task' data-test-task={this.props.id} checked={this.state.checked} onChange={this.handleChange.bind(this)} /> {labelText}
          </label>
        </p>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const {
    personalisationActions
  } = state
  const {
    personalisationValues
  } = personalisationActions || {
    personalisationValues: {}
  }

  return {
    personalisationValues
  }
}

Task.propTypes = {
  label: PropTypes.string, // need EITHER label or text depending on type
  text: PropTypes.string,
  id: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  personalisationValues: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(Task)
