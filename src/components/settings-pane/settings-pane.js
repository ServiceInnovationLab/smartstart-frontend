import './settings-pane.scss'
import './button-set.scss'
import './messages.scss'
import './realme-login-primary.scss'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
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
    // guard so only runs if settings pane is present
    if (this.settingsElement) {
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

    // unfortunately setCustomValidity doesn't work in safari so we have to
    // manually check the validity here

    if (this.dueDateValidate()) {
      // it validated, add the due date to the store and close the pane
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
    } else {
      // it's safari and it didn't validate
      // TODO #37500 should we display the error manually? or use a polyfill?
    }
  }

  dueDateValidate () {
    const fieldValue = this.state.dueDateFieldValue

    // if format is wrong OR there is a value but it's not a valid date
    if (this.dueDateField.validity.patternMismatch || ((fieldValue != '') && !isValidDate(fieldValue))) {
      this.dueDateField.setCustomValidity('Please use the format yyyy-mm-dd')
      return false // so we can do the manual check for safari
    } else {
      this.dueDateField.setCustomValidity('')
      return true // so we can do the manual check for safari
    }
  }

  dueDateChange (event) {
    // needed as per https://facebook.github.io/react/docs/forms.html#controlled-components
    // plus we need to trigger the validation once the state update has finished
    this.setState({ dueDateFieldValue: event.target.value }, this.dueDateValidate.bind(this))
  }

  reset () {
    this.setState({ dueDateFieldValue: '' }, this.dueDateField.setCustomValidity(''))
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
              <p>Make the information displayed in the timeline more relevant by answering these questions. You can answer as many or as few as you wish. All your details are kept private (see <Link to={'/your-privacy/'}>our privacy policy</Link>).</p>
              <label>
                When is your baby due?
                <br />
                <input
                  type='date'
                  maxLength='10'
                  size='11'
                  placeholder='yyyy-mm-dd'
                  pattern='\d{4}-\d{2}-\d{2}'
                  ref={(ref) => { this.dueDateField = ref }}
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
