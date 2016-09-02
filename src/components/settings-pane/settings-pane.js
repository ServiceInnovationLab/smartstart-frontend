import './settings-pane.scss'
import './button-set.scss'
import './messages.scss'
import './realme-login-primary.scss'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { addDueDate } from 'actions/actions'
import classNames from 'classnames'

class SettingsPane extends Component {
  constructor (props) {
    super(props)

    this.state = {
      paneOpen: false,
      loginMessageShown: false,
      fixedControls: false
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', this.checkIfShouldBeFixed.bind(this))
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.checkIfShouldBeFixed.bind(this))
  }

  checkIfShouldBeFixed () {
    const settingsPosition = this.settingsElement.getBoundingClientRect().top

    if (!this.state.fixedControls && settingsPosition < 0) {
      this.setState({
        fixedControls: true
      })
    } else if (this.state.fixedControls && settingsPosition >= 0) {
      this.setState({
        fixedControls: false
      })
    }
  }

  paneToggle () {
    this.setState({
      paneOpen: !this.state.paneOpen
    })
  }

  cancel () {
    this.setState({
      paneOpen: false
    })
  }

  updateSettings (event) {
    event.preventDefault() // prevent a form submit action

    this.props.dispatch(addDueDate(this.dueDateField.value))
    this.setState({
      paneOpen: false
    })

    // if the user is not logged in, tell them they should to save
    // login always requires a page reload, so no need to manually hide this message later
    if (!this.props.isLoggedIn) {
      this.setState({
        loginMessageShown: true
      })
    }
  }

  dueDateValidate () {
    if (this.dueDateField.validity.patternMismatch) {
      this.dueDateField.setCustomValidity('Please use the format yyyy-mm-dd')
    } else {
      this.dueDateField.setCustomValidity('')
    }
  }

  reset () {
    this.dueDateField.value = ''
    this.dueDateField.setCustomValidity('')
  }

  render () {
    let paneWrapperClasses = classNames(
      'settings-pane-wrapper',
      { 'is-fixed': this.state.fixedControls }
    )
    let paneClasses = classNames(
      'settings-pane',
      { 'is-open': this.state.paneOpen }
    )
    let loginMessageClasses = classNames(
      'message',
      { 'hidden': !this.state.loginMessageShown }
    )

    // TODO if dueDate in store changes because of a login
    // action, update value here (story RM35006) if there
    // was not a value added. If there is already a value
    // here, we need to update the personalisation service.

    return (
      <div className='settings' ref={(ref) => { this.settingsElement = ref }}>
        <div className={paneWrapperClasses}>
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
                  ref={(ref) => { this.dueDateField = ref }}
                  onKeyUp={this.dueDateValidate.bind(this)}
              />
              </label>
              <div className='button-set'>
                <button type='button' onClick={this.reset.bind(this)} className='reset-button'>Reset</button>
                <button type='button' onClick={this.cancel.bind(this)} className='cancel-button'>Cancel</button>
                <button type='submit'>Update</button>
              </div>
            </form>
          </div>
        </div>
        <div className='settings-messages'>
          <div className={loginMessageClasses}>
            <h6>To save your profile for your next visit you need to log in with RealMe.</h6>
            <a className='button realme-primary-login-button ext-link-icon' href='/login/'>
              Login
            </a>
          </div>
        </div>
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
    dueDate
  } = personalisationActions || {
    isLoggedIn: false,
    dueDate: null
  }

  return {
    isLoggedIn,
    dueDate
  }
}

SettingsPane.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  dueDate: PropTypes.object
}

export default connect(mapStateToProps)(SettingsPane)
