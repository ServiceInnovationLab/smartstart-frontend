import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { addDueDate, savePersonalisationValues, piwikTrackPost } from 'actions/actions'
import classNames from 'classnames'
import { isValidDate } from 'utils'

export class MyProfile extends Component {
  constructor (props) {
    super(props)

    this.state = {
      dueDateFieldValue: ''
    }

    this.setFilterValuesFromStore = this.setFilterValuesFromStore.bind(this)
  }

  componentWillMount () {
    this.setFilterValuesFromStore(this.props.personalisationValues.settings)
  }

  componentWillReceiveProps (nextProps) {
    this.setFilterValuesFromStore(nextProps.personalisationValues.settings)
  }

  setFilterValuesFromStore (settingsData) {
    if (settingsData) {
      if (settingsData.dd && isValidDate(settingsData.dd)) {
        // update the input (only if it's a valid value)
        this.setState({
          dueDateFieldValue: settingsData.dd
        })

        // update the timeline
        this.props.dispatch(addDueDate(settingsData.dd))
      }
    }
  }

  updateSettings (event) {
    event.preventDefault() // prevent a form submit action

    // unfortunately setCustomValidity doesn't work in safari so we have to
    // manually check the validity here

    if (this.dueDateValidate()) {
      // it validated, add the due date to the store and close the pane
      this.props.dispatch(addDueDate(this.state.dueDateFieldValue))

      this.props.profilePaneClose()

      // values to save to backend or cookie
      let valuesToSave = [{
        'group': 'settings',
        'key': 'dd', // keep these non-descriptive for privacy reasons
        'val': this.state.dueDateFieldValue
      }]

      // save values to store
      this.props.dispatch(savePersonalisationValues(valuesToSave))

      // tracking
      if (this.state.dueDateFieldValue) {
        let piwikEvent = {
          'category': 'Profile Data',
          'action': 'Added',
          'name': 'Due date'
        }
        // track the event
        this.props.dispatch(piwikTrackPost('Profile', piwikEvent))
      }
    } else {
      // it's safari and it didn't validate
      // #37500 should we display the error manually? or use a polyfill? - deferred for now
    }
  }

  dueDateValidate () {
    const field = this.dueDateField
    const fieldValue = this.state.dueDateFieldValue
    const isDateValid = (fieldValue === '' || isValidDate(fieldValue))

    if (isDateValid) {
      this.setCustomValidity(field, '')
    } else {
      this.setCustomValidity(field, 'Please use the format yyyy-mm-dd')
    }

    return isDateValid // so we can do the manual check for safari
  }

  setCustomValidity (input, message) {
    if (input.setCustomValidity) {
      input.setCustomValidity(message)
    }
  }

  dueDateChange (event) {
    // needed as per https://facebook.github.io/react/docs/forms.html#controlled-components
    // plus we need to trigger the validation once the state update has finished
    this.setState({ dueDateFieldValue: event.target.value }, this.dueDateValidate.bind(this))
  }

  reset () {
    this.setState({ dueDateFieldValue: '' }, this.setCustomValidity(this.dueDateField, ''))
  }

  render () {
    let paneClasses = classNames(
      'settings-pane',
      { 'is-open': this.props.shown }
    )

    return (
      <div id='my-profile' className={paneClasses} aria-hidden={!this.props.shown}>
        <form onSubmit={this.updateSettings.bind(this)}>
          <h4>Personalise the timeline</h4>

          <p>Add your due date to make the information displayed in the timeline more relevant. All your details are kept private (see <Link to={'/your-privacy/'}>our privacy policy</Link>).</p>
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
    personalisationValues
  } = personalisationActions || {
    personalisationValues: {}
  }

  return {
    personalisationValues
  }
}

MyProfile.propTypes = {
  personalisationValues: PropTypes.object.isRequired,
  shown: PropTypes.bool.isRequired,
  profilePaneClose: PropTypes.func.isRequired,
  dispatch: PropTypes.func
}

export default connect(mapStateToProps)(MyProfile)
