import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getFormValues } from 'redux-form'
import get from 'lodash/get'
import { connect } from 'react-redux'
import { rememberBroData } from 'actions/birth-registration'
import SecondaryLogin from 'components/secondary-login/secondary-login'
import { stepValidateFn } from './progress'

import './save-as-draft-button.scss'

class SaveAsDraftButton extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showLoginPrompt: false,
      showSuccessPrompt: false,
      showErrorPrompt: false
    }

    this.getValidFields = this.getValidFields.bind(this)
  }

  getValidFields() {
    let currentValidFields = {...this.props.formState}
    const fieldErrors = stepValidateFn[this.props.step](currentValidFields)
    if (Object.keys(fieldErrors).length) {
      for (let group in fieldErrors) {
        if (typeof fieldErrors[group] === 'object') {
            for (let field in fieldErrors[group]) {
              if (currentValidFields[group] && currentValidFields[group][field]) {
                delete currentValidFields[group][field]
              }
            }
            if (!Object.keys(group).length) {
              if (currentValidFields[group]) {
                delete currentValidFields[group]
              }
            }
        } else {
          if (currentValidFields[group]) {
            delete currentValidFields[group]
          }
        }
      }
    }

    return currentValidFields
  }
  handleClick(e) {
    e.preventDefault()

    const { savedRegistrationForm, isLoggedIn } = this.props
    // check form fields to save
    const currentValidFields = this.getValidFields()

    if (isLoggedIn) {
      return rememberBroData({ ...savedRegistrationForm, ...currentValidFields })
        // display prompt and remove after 3 sec
        .then(() => this.setState({ showSuccessPrompt: true}), setTimeout(() => this.setState({ showSuccessPrompt: false }), 3000))
        .catch(() => this.setState({ showErrorPrompt: true}), setTimeout(() => this.setState({ showErrorPrompt: false }), 3000))
    } else {
      this.setState({ showLoginPrompt: true })

      // still try to save silently for anonymous user
      return rememberBroData({ ...savedRegistrationForm, ...currentValidFields })
    }
  }


  render() {
    const { showLoginPrompt, showSuccessPrompt, showErrorPrompt } = this.state
    return (
      <div className="save-as-draft-wrapper">
        <div className="save-as-draft-button"> <button onClick={this.handleClick.bind(this)}> Save as draft </button> </div>
        {showLoginPrompt && <SecondaryLogin />}
        {showSuccessPrompt &&  <div className="success"> Your birth registration form has been saved as a draft. </div>}
        {showErrorPrompt && <div className="error"> There has been a problem with saving your data. </div>}
      </div>
    )
  }
}

SaveAsDraftButton.propTypes = {
  step: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  savedRegistrationForm: PropTypes.object.isRequired,
  formState: PropTypes.object
}

const mapStateToProps = state => ({
  isLoggedIn: get(state, 'personalisationActions.isLoggedIn'),
  savedRegistrationForm: get(state, 'birthRegistration.savedRegistrationForm'),
  formState: getFormValues('registration')(state)
})
export default connect(mapStateToProps)(SaveAsDraftButton)
