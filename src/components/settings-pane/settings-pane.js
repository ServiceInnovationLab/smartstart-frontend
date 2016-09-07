import './settings-pane.scss'
import './button-set.scss'
import './messages.scss'
import './realme-login-primary.scss'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { addDueDate, savePersonalisationValues } from 'actions/actions'
import classNames from 'classnames'
import { isValidDate } from 'utils'

class SettingsPane extends Component {
  constructor (props) {
    super(props)

    this.state = {
      paneOpen: false,
      loginMessageShown: false,
      fixedControls: false,
      dueDateFieldValue: ''
    }
  }

  componentWillReceiveProps (nextProps) {
    // need to use componentWillReceiveProps because this
    // component renders before the b/e data is available
    let settingsData = nextProps.personalisationValues.settings

    if (settingsData) {
      if (settingsData.dd && isValidDate(settingsData.dd)) {
        // update the input (only if it's a valid value)
        this.state = {
          dueDateFieldValue: settingsData.dd
        }

        // update the timeline
        this.props.dispatch(addDueDate(settingsData.dd))
      }
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

    this.props.dispatch(addDueDate(this.state.dueDateFieldValue))
    this.setState({
      paneOpen: false
    })

    // values to save to backend or cookie
    let valuesToSave = [{
      'group': 'settings',
      'key': 'dd', // keep these non-descriptive for privacy reasons
      'val': this.state.dueDateFieldValue
    }]

    // if the user is not logged in, tell them they should to save
    if (!this.props.isLoggedIn) {
      this.setState({
        loginMessageShown: true // login always requires a page reload, so no need to manually hide this message later
      })
      // TODO #37457 save to a cookie here
    } else {
      // if they are logged in, save the new value(s) to the backend
      this.props.dispatch(savePersonalisationValues(valuesToSave))
    }
  }

  dueDateValidate () {
    if (this.dueDateField.validity.patternMismatch) {
      this.dueDateField.setCustomValidity('Please use the format yyyy-mm-dd')
    } else {
      this.dueDateField.setCustomValidity('')
    }
  }

  dueDateChange (event) {
    // needed as per https://facebook.github.io/react/docs/forms.html#controlled-components
    this.setState({ dueDateFieldValue: event.target.value })
  }

  reset () {
    this.setState({ dueDateFieldValue: '' })
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
                  onChange={this.dueDateChange.bind(this)}
                  value={this.state.dueDateFieldValue}
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

SettingsPane.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  personalisationValues: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(SettingsPane)
