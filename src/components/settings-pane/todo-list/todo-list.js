import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

class TodoList extends Component {

  render () {
    let paneClasses = classNames(
      'settings-pane',
      { 'is-open': this.props.shown }
    )

    return (
      <div id='todo-list' className={paneClasses} aria-hidden={!this.props.shown}>
        <h4>To do list</h4>
        <p>Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.</p>
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
