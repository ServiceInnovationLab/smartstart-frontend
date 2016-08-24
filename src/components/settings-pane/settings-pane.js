import './settings-pane.scss'
import './button-set.scss'

import React, { PropTypes, Component } from 'react'
import classNames from 'classnames'

class SettingsPane extends Component {
  constructor (props) {
    super(props)

    this.state = {
      paneOpen: false
    }
  }

  paneToggle () {
    this.setState({
      paneOpen: !this.state.paneOpen
    })
  }

  paneClose () {
    this.setState({
      paneOpen: false
    })
  }

  updateSettings (event) {
    event.preventDefault()

    this.setState({
      paneOpen: false
    })

    // TODO dispatch this.dueDate.value
    // connect to phase to update titles
    // plumb in the date calculations (into actions?)
  }

  dueDateValidate () {
    if (this.dueDate.validity.patternMismatch) {
      this.dueDate.setCustomValidity('Please use the format yyyy-mm-dd')
    } else {
      this.dueDate.setCustomValidity('')
    }
  }

  reset () {
    this.dueDate.value = ''
    this.dueDate.setCustomValidity('')
  }

  render () {
    // TODO use isLoggedIn to conditionally show login message
    // const { isLoggedIn } = this.props
    let paneClasses = classNames(
      'settings-pane',
      { 'is-open': this.state.paneOpen }
    )

    return (
      <div className='settings'>
        <button
          className='settings-trigger'
          aria-controls='settings'
          aria-expanded={this.state.paneOpen}
          onClick={this.paneToggle.bind(this)}
        >Your profile</button>
        <div id='settings' className={paneClasses} aria-hidden={!this.state.paneOpen}>
          <form onSubmit={this.updateSettings.bind(this)}>
            <h4>Personalise the timeline</h4>
            <p>Make the information displayed in the timeline more relevant by answering these questions. You can answer as many or few as you wish. All your details are kept private (see <a href='#'>our privacy policy</a>).</p>
            <label>
              When is your baby due?
              <br />
              <input
                type='date'
                maxLength='10'
                size='10'
                placeholder='yyyy-mm-dd'
                pattern='\d{4}-\d{2}-\d{2}'
                ref={(ref) => { this.dueDate = ref }}
                onKeyUp={this.dueDateValidate.bind(this)}
            />
            </label>
            <div className='button-set'>
              <button onClick={this.reset.bind(this)} className='reset-button'>Reset</button>
              <button onClick={this.paneClose.bind(this)} className='cancel-button'>Cancel</button>
              <button type='submit'>Update</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

SettingsPane.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired
}

export default SettingsPane
