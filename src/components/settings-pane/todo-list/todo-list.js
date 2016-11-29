import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { piwikTrackPost } from 'actions/actions'
import Task from 'components/task/task'

export class TodoList extends Component {
  constructor (props) {
    super(props)

    this.goToPhaseLink = this.goToPhaseLink.bind(this)
  }

  goToPhaseLink (location, label) {
    // chrome won't honour the anchor link if the todo list is scrolled down
    // so in addition to the normal link click we also manually set the location
    this.props.todoPaneClose()
    window.location = '/#' + location

    // tracking
    let piwikEvent = {
      'category': 'To Do List',
      'action': 'Jump to phase',
      'name': label
    }

    this.props.dispatch(piwikTrackPost('Jump to phase', piwikEvent))
  }

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
                tasks.push(<Task key={element.id} id={element.id} type={element.type} label={element.label} text={element.content} tags={element.tags} />)
              }
            })
          }
        })

        if (tasks.length) {
          phaseTasks.push(
            <h5 key={'todo-phase-' + phase.id}>
              <a href={'#' + phase.id} onClick={() => this.goToPhaseLink(phase.id, phase.label)}>{phase.label}</a>
            </h5>)
          phaseTasks.push(tasks)
        }
      }
    })

    return (
      <div id='todo-list' className={paneClasses} aria-hidden={!this.props.shown}>
        <h4>To Do list</h4>

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
    contentActions
  } = state
  const {
    phases
  } = contentActions || {
    phases: []
  }

  return {
    phases
  }
}

TodoList.propTypes = {
  phases: PropTypes.array.isRequired,
  shown: PropTypes.bool.isRequired,
  todoPaneClose: PropTypes.func.isRequired,
  dispatch: PropTypes.func
}

export default connect(mapStateToProps)(TodoList)
