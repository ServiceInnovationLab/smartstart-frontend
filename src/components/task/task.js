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
  }

  componentWillMount () {
    // we only need to load the saved checkboxes from
    // the backend on componentWillMount because we
    // don't render the timeline until data is loaded
    // and we only need to load saved data once
    let checkboxData = this.props.personalisationValues.checkboxes

    if (checkboxData) {
      let thisCheckbox = checkboxData[this.props.id.toString()]

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

      if (!this.props.isLoggedIn) {
        // TODO #36411 show login prompt
        // TODO #37457 save to a cookie here
      } else {
        // they are logged in, save the checkbox value to the backend
        this.props.dispatch(savePersonalisationValues(valuesToSave))
      }
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
    isLoggedIn,
    personalisationValues
  } = personalisationActions || {
    isLoggedIn: false,
    personalisationValues: {}
  }

  return {
    isLoggedIn,
    personalisationValues
  }
}

Task.propTypes = {
  label: PropTypes.string, // need EITHER label or text depending on type
  text: PropTypes.string,
  id: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  personalisationValues: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(Task)
