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

    return (
      <div id='todo-list' className={paneClasses} aria-hidden={!this.props.shown}>
        <h4>To do list</h4>

        {this.props.phases.map(phase => {
          if (!phase.elements) { phase.elements = [] } // a phase can be empty

          return phase.elements.map(card => {
            if (!card.elements) { card.elements = [] } // a card can be empty)

            return card.elements.map(element => {
              if (element.tags.indexOf('boac_presentation::task') >= 0) {
                return <Task key={element.id} id={element.id} type={element.type} label={element.label} text={element.content} />
              }
            })
          })
        })}

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
