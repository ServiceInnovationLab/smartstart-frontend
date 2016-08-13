import './task.scss'

import React, { PropTypes, Component } from 'react'

class Task extends Component {
  constructor (props) {
    super(props)

    this.state = {
      checked: false
    }
  }

  handleChange () {
    this.setState({checked: !this.state.checked})
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
          <label>
            <input id={elementId} type='checkbox' data-test='task' data-test-task={this.props.id} value={this.state.checked} onChange={this.handleChange.bind(this)} /> {labelText}
          </label>
        </p>
      </div>
    )
  }
}

Task.propTypes = {
  label: PropTypes.string, // need EITHER label or text depending on type
  text: PropTypes.string,
  id: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired
}

export default Task
