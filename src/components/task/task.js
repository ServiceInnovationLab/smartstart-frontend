import './task.scss'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { savePersonalisationValues, piwikTrackPost } from 'actions/actions'
import classNames from 'classnames'

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

      // tracking
      if (this.state.checked) {
        let piwikEvent = {
          'category': 'To Do List',
          'action': 'Checked',
          'name': this.getLabel()
        }
        // track the event
        this.props.dispatch(piwikTrackPost('To Do List', piwikEvent))
      }
    })
  }

  getLabel () {
    if (this.props.type === 'plaintext' && this.props.text) {
      return this.props.text
    }
    // can't trust text will not have markup if not plaintext type, so use label
    return this.props.label
  }

  render () {
    let labelText = this.getLabel()
    let elementId = 'task-' + this.props.id
    let taskClasses = classNames(
      'task',
      { 'subtask': this.props.tags.indexOf('boac_presentation::subtask') >= 0 }
    )

    return (
      <div className={taskClasses}>
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
  personalisationValues: PropTypes.object.isRequired,
  tags: PropTypes.array.isRequired,
  dispatch: PropTypes.func
}

export default connect(mapStateToProps)(Task)
