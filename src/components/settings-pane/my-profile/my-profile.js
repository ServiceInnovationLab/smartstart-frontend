import './my-profile.scss'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { addDueDate, addSubscribed, savePersonalisationValues, saveNewEmail, piwikTrackPost, checkPendingEmails } from 'actions/actions'
import classNames from 'classnames'
import scriptLoader from 'react-async-script-loader'
import LocationAutosuggest from 'components/location-autosuggest/location-autosuggest'
import { isValidDate, isValidEmail } from 'utils'

export class MyProfile extends Component {
  constructor (props) {
    super(props)

    this.state = {
      dueDateFieldValue: '',
      locationFieldValue: '',
      location: { latitude: null, longitude: null, text: '' },
      subscribedFieldValue: false,
      newEmailFieldValue: '',
      unconfirmedEmail: '',
      googleLibAvailable: false
    }

    this.setFilterValuesFromStore = this.setFilterValuesFromStore.bind(this)
    this.setEmailValue = this.setEmailValue.bind(this)
    this.dueDateValidate = this.dueDateValidate.bind(this)
    this.emailValidate = this.emailValidate.bind(this)
    this.formValidate = this.formValidate.bind(this)
    this.dueDateChange = this.dueDateChange.bind(this)
    this.locationTextChange = this.locationTextChange.bind(this)
    this.onLocationSelect = this.onLocationSelect.bind(this)
    this.onNoLocationSelect = this.onNoLocationSelect.bind(this)
    this.clearLocation = this.clearLocation.bind(this)
    this.subscribedChange = this.subscribedChange.bind(this)
    this.emailChange = this.emailChange.bind(this)
    this.submitForm = this.submitForm.bind(this)
  }

  componentWillMount () {
    this.setFilterValuesFromStore(this.props)
  }

  componentDidMount () {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props
    if (isScriptLoaded && isScriptLoadSucceed) {
      this.setState({ googleLibAvailable: true })
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setFilterValuesFromStore(nextProps)

    if (this.props.isLoggedIn) {
      this.setEmailValue()
    }

    if (nextProps.isScriptLoaded && !this.props.isScriptLoaded) { // script load finished
      if (nextProps.isScriptLoadSucceed) {
        this.setState({ googleLibAvailable: true })
      }
    }
  }

  setEmailValue() {
    // if user has pending emails display last one in an email field
    // otherwise display existing email in a field
    this.props.dispatch(checkPendingEmails()).then(emails => {
      if (emails.length > 0) {
        this.setState({
          newEmailFieldValue: emails[0].email,
          unconfirmedEmail: emails[0].email
        })

        // display message to user to remind that they have unconfirmed email
        this.setState({  })
      } else {
        this.setState({ newEmailFieldValue: this.props.userEmail })
      }
    })
  }

  setFilterValuesFromStore (props) {
    let { isLoggedIn, personalisationValues, dispatch } = props
    let { settings } = personalisationValues

    // due date
    if (settings && settings.dd && isValidDate(settings.dd)) {
      // update the input (only if it's a valid value)
      this.setState({ dueDateFieldValue: settings.dd })

      // update the timeline
      dispatch(addDueDate(settings.dd))
    }

    // location
    if (settings && settings.loc && settings.loc.text) {
      this.setState({
        location: { latitude: settings.loc.latitude, longitude: settings.loc.longitude, text: settings.loc.text },
        locationFieldValue: settings.loc.text
      })
    }

    // subscribed value
    if (settings && settings.subscribed) {
      this.setState({ subscribedFieldValue: settings.subscribed === 'true' })
      dispatch(addSubscribed(this.state.subscribedFieldValue))
    } else {
      if (isLoggedIn) {
        //defaults to true
        this.setState({ subscribedFieldValue: true })
        dispatch(addSubscribed(this.state.subscribedFieldValue))
      }
    }
  }

  submitForm (event) {
    event.preventDefault() // prevent a form submit action

    // unfortunately setCustomValidity doesn't work in safari so we have to
    // manually check the validity here
    let valuesToSave = []
    let formIsValid = true

    let { dueDateFieldValue, subscribedFieldValue, newEmailFieldValue, location } = this.state
    let { settings } = this.props.personalisationValues

    // due date field
    if(this.dueDateValidate()) {
      if (!settings || dueDateFieldValue !== settings.dd) {
        valuesToSave.push({ 'group': 'settings', 'key': 'dd', 'val': dueDateFieldValue })

        if (dueDateFieldValue) {
          let piwikEvent = {
            'category': 'Profile Data',
            'action': 'Added',
            'name': 'Due date'
          }
          // track the event
          this.props.dispatch(piwikTrackPost('Profile', piwikEvent))
        }

        // update in store
        this.props.dispatch(addDueDate(this.state.dueDateFieldValue))
      }
    } else {
      // it's safari and it didn't validate
      // #37500 should we display the error manually? or use a polyfill? - deferred for now
      formIsValid = false
    }

    // location field
    // there is no validation for the location as only autocomplete values are allowed
    if (!settings || !settings.loc || (settings.loc && settings.loc.text !== location.text)) {
      valuesToSave.push({ 'group': 'settings', 'key': 'loc', 'val': location })

      if (location.text) {
        let piwikEvent = {
          'category': 'Profile Data',
          'action': 'Added',
          'name': 'Location'
        }
        // track the event
        this.props.dispatch(piwikTrackPost('Profile', piwikEvent))
      }
    }

    // subscribed and email fields
    if (this.props.isLoggedIn) {
      // subscribed checkbox
      if (settings && subscribedFieldValue.toString() !== settings.subscribed) {
        valuesToSave.push({ 'group': 'settings', 'key': 'subscribed', 'val': subscribedFieldValue.toString() })

        // update in store
        this.props.dispatch(addSubscribed(this.state.subscribedFieldValue))

        if (settings.subscribed || subscribedFieldValue.toString() === 'checked') {
          // if there was a previously stored value (which has now changed),
          // or this is first time it was checked, track the event
          let piwikEvent = {
            'category': 'Profile Data',
            'action': this.state.subscribedFieldValue ? 'checked' : 'unchecked',
            'name': 'Subscribed'
          }
          this.props.dispatch(piwikTrackPost('Profile', piwikEvent))
        }
      }

      // email field
      if (!this.emailValidate()) {
        formIsValid = false
      }
    }

    // send request
    if (formIsValid) {

      // email field
      if (this.props.userEmail !== newEmailFieldValue &&
          this.state.unconfirmedEmail !== newEmailFieldValue && newEmailFieldValue !== '') {
        // track the event
        let piwikEvent = {
          'category': 'Profile Data',
          'action': 'submitted',
          'name': 'New Email'
        }
        this.props.dispatch(piwikTrackPost('Profile', piwikEvent))

        // submit new email
        this.props.dispatch(saveNewEmail(newEmailFieldValue))
      }

      // save the data and close the pane
      this.props.dispatch(savePersonalisationValues(valuesToSave))
      this.props.profilePaneClose()
    }
  }

  dueDateValidate () {
    const field = this.dueDateField
    const fieldValue = this.state.dueDateFieldValue
    // if subscribed, due date is required
    let isDateValid, message

    if (this.state.subscribedFieldValue && !fieldValue) {
      isDateValid = false
      message = 'Please enter a due date to receive reminders'
    } else {
      isDateValid = fieldValue === '' || isValidDate(fieldValue)
      message = isDateValid ? '' : 'Please use the format yyyy-mm-dd'
    }

    this.setCustomValidity(field, message)
    return isDateValid // so we can do the manual check for safari
  }

  emailValidate () {
    const field = this.emailField
    const fieldValue = this.state.newEmailFieldValue
    // if subscribed, email is required
    let isEmailValid, message

    if (this.state.subscribedFieldValue && !fieldValue) {
      isEmailValid = false
      message = 'Please enter an email address'
    } else {
      isEmailValid = fieldValue === '' || isValidEmail(fieldValue)
      message = isEmailValid ? '' : 'Please enter a valid email address'
    }

    this.setCustomValidity(field, message)

    return isEmailValid // so we can do the manual check for safari
  }

  setCustomValidity (input, message) {
    if (input.setCustomValidity) {
      input.setCustomValidity(message)
    }
  }

  formValidate () {
    this.dueDateValidate()
    this.emailValidate()
  }

  dueDateChange (event) {
    // needed as per https://facebook.github.io/react/docs/forms.html#controlled-components
    // plus we need to trigger the validation once the state update has finished
    this.setState({ dueDateFieldValue: event.target.value }, this.dueDateValidate)
  }

  locationTextChange (event, { newValue }) {
    this.setState({
      locationFieldValue: newValue
    }, () => {
      if (newValue === '') {
        // if the user manually deletes their input, clear the locally stored location
        this.setState({
          location: { latitude: null, longitude: null, text: '' }
        })
      }
    })
  }

  onLocationSelect (location) {
    // set the location locally, but don't dispatch it until the update button is hit
    this.setState({
      location: {
        latitude: location.geometry.location.lat(),
        longitude: location.geometry.location.lng(),
        text: location.formatted_address
      }
    })
  }

  onNoLocationSelect () {
    // when clicking away from the control, blank it if a proper location hasn't
    // yet been selected, or return to last selected value
    if (!this.state.location.text) {
      this.setState({
        locationFieldValue: '',
        location: { latitude: null, longitude: null, text: '' }
      })
    } else {
      this.setState({
        locationFieldValue: this.state.location.text
      })
    }
  }

  clearLocation (event) {
    event.preventDefault()
    // clear the field and any stored value
    this.setState({
      locationFieldValue: '',
      location: { latitude: null, longitude: null, text: '' }
    })
  }

  subscribedChange () {
    this.setState({subscribedFieldValue: !this.state.subscribedFieldValue}, this.formValidate)
  }

  emailChange (event) {
    this.setState({ newEmailFieldValue: event.target.value }, this.emailValidate)
  }

  render () {
    const { locationFieldValue, googleLibAvailable } = this.state

    const paneClasses = classNames(
      'settings-pane',
      { 'is-open': this.props.shown }
    )
    const notificationClasses = classNames(
      this.state.unconfirmedEmail ? 'success-message' : 'hidden'
    )
    const locationClearClasses = classNames(
      'inline-clear-field',
      { 'hidden': locationFieldValue === ''}
    )


    return (
      <div id='my-profile' className={paneClasses} aria-hidden={!this.props.shown}>
        <form onSubmit={this.submitForm}>
          <h4>Personalise SmartStart</h4>

          <p>Make the information displayed in SmartStart more relevant by adding a few details. All your details are kept private (see <Link to={'/your-privacy/'}>our privacy policy</Link>).</p>
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
              onChange={this.dueDateChange}
              value={this.state.dueDateFieldValue}
            />
          </label>
          <br />
          {googleLibAvailable && <div className='location-field'>
            <label>
              Your location
              <br />
              <span className='profile-label-help'>So we can find services near you.</span>
              <LocationAutosuggest
                id='services-location-field'
                onPlaceSelect={this.onLocationSelect}
                onNoSelection={this.onNoLocationSelect}
                inputProps={{
                  value: this.state.locationFieldValue,
                  onChange: this.locationTextChange,
                  autoComplete: 'off',
                  placeholder: 'Start typing an address'
                }}
              />
            </label>
            <button onClick={this.clearLocation} className={locationClearClasses}>
              <span className='visuallyhidden'>Clear location</span>
            </button>
          </div>}
          <div className="signup-section">
            <h4>Sign-up to reminders</h4>
            <p>Sign-up to reminders from the SmartStart To Do list. A reminder is sent to you at the start of each phase during your pregnancy and with a new baby. You can unsubscribe here at any time.</p>
            {!this.props.isLoggedIn ? <p>Please login to sign-up or update your details.</p> :
              <div>
                <label>
                  <input
                    type='checkbox'
                    ref={(ref) => { this.subscribedField = ref }}
                    onChange={this.subscribedChange}
                    checked={this.state.subscribedFieldValue}
                    />
                  I want to receive SmartStart To Do list reminders
                </label>
                <br />
                <label>
                  Your email address
                  <br />
                  <input
                    type='email'
                    placeholder="email@example.co.nz"
                    ref={(ref) => { this.emailField = ref }}
                    onChange={this.emailChange}
                    value={this.state.newEmailFieldValue}
                    />
                </label>

                <div className={notificationClasses}>
                  You need to confirm your email address before you can receive reminders to this address - you will have been sent an email with a confirmation link.
                </div>
              </div>
            }
          </div>

          <div className='button-set'>
            <button type='button' onClick={this.props.profilePaneClose} className='cancel-button'>Cancel</button>
            <button type='submit'>Update</button>
          </div>
        </form>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const {
    personalisationActions
  } = state
  const {
    personalisationValues,
    userEmail,
    isLoggedIn
  } = personalisationActions || {
    personalisationValues: {},
    userEmail: '',
    isLoggedIn: false
  }

  return {
    personalisationValues,
    userEmail,
    isLoggedIn
  }
}

MyProfile.propTypes = {
  personalisationValues: PropTypes.object.isRequired,
  shown: PropTypes.bool.isRequired,
  profilePaneClose: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  userEmail: PropTypes.string,
  dispatch: PropTypes.func,
  isScriptLoaded: PropTypes.bool,
  isScriptLoadSucceed: PropTypes.bool

}

export default scriptLoader(
  `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`
)(connect(mapStateToProps)(MyProfile))
