import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Task from 'components/task/task'

class TodoList extends Component {

  render () {
    let paneClasses = classNames(
      'settings-pane',
      { 'is-open': this.props.shown }
    )
    let phaseTasks = []

    this.props.phases.forEach(phase => {
      let tasks = []

      if (phase.elements) {
        phase.elements.forEach(card => {
          if (card.elements) {
            card.elements.forEach(element => {
              if (element.tags.indexOf('boac_presentation::task') >= 0) {
                tasks.push(<Task key={element.id} id={element.id} type={element.type} label={element.label} text={element.content} />)
              }
            })
          }
        })

        if (tasks.length) {
          phaseTasks.push(<h5 key={'todo-phase-' + phase.id}>{phase.label}</h5>)
          phaseTasks.push(tasks)
        }
      }
    })

    return (
      <div id='todo-list' className={paneClasses} aria-hidden={!this.props.shown}>
        <h4>To do list</h4>

        {phaseTasks}

        <div className='button-set'>
          <button type='button' className='cancel-button' onClick={this.props.todoPaneClose}>Close</button>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const {
    contentActions,
    personalisationActions
  } = state
  const {
    phases
  } = contentActions || {
    phases: []
  }
  const {
    isLoggedIn
  } = personalisationActions || {
    isLoggedIn: false
  }

  return {
    phases,
    isLoggedIn
  }
}

TodoList.propTypes = {
  phases: PropTypes.array.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}

export default connect(mapStateToProps)(TodoList)
