import './task.scss'

import React from 'react'

class Task extends React.Component {
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

    if (this.props.type === 'plaintext' && this.props.content) {
      labelText = this.props.content
    } else {
      // can't trust content will not have markup if not plaintext type, so use label
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

export default Task
