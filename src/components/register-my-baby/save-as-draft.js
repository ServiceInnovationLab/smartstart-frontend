import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getFormValues } from 'redux-form'
import get from 'lodash/get'
import { connect } from 'react-redux'
import { rememberBroData } from 'actions/birth-registration'
import PrimaryLogin from 'components/primary-login/primary-login'

import './save-as-draft.scss'

class SaveAsDraft extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showLoginPrompt: false,
      showSuccessPrompt: false,
      showErrorPrompt: false
    }
  }

  handleClick(e) {
    e.preventDefault()

    const { isLoggedIn, step, formState, rememberBroData } = this.props

    if (isLoggedIn) {
      const maxStep = step > this.props.maxStep ? step : this.props.maxStep
      return rememberBroData({ step: maxStep, data: formState })
        .then(() => this.setState({ showSuccessPrompt: true}), setTimeout(() => this.setState({ showSuccessPrompt: false }), 10000))
        .catch(() => this.setState({ showErrorPrompt: true}), setTimeout(() => this.setState({ showErrorPrompt: false }), 10000))
    } else {
      this.setState({ showLoginPrompt: true })

      // still try to save silently for anonymous user
      const maxStep = step > this.props.maxStep ? step : this.props.maxStep
      return rememberBroData({ step: maxStep, data: formState })
    }
  }


  render() {
    const { showLoginPrompt, showSuccessPrompt, showErrorPrompt } = this.state
    return (
      <div className="save-as-draft-wrapper">
        <div className="save-as-draft">
          <button onClick={this.handleClick.bind(this)}> <span>Save as draft</span> </button>
        </div>
        {showLoginPrompt && <PrimaryLogin />}
        {showSuccessPrompt &&  <div className="success"> Your birth registration form has been saved as a draft. </div>}
        {showErrorPrompt && <div className="error"> There has been a problem with saving your data. Try again later. </div>}
      </div>
    )
  }
}

SaveAsDraft.propTypes = {
  step: PropTypes.number.isRequired,
  maxStep: PropTypes.number.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  rememberBroData: PropTypes.func.isRequired,
  formState: PropTypes.object
}

const mapStateToProps = state => ({
  isLoggedIn: get(state, 'personalisationActions.isLoggedIn'),
  maxStep: get(state, 'birthRegistration.savedRegistrationForm.step'),
  formState: getFormValues('registration')(state)
})
export default connect(mapStateToProps, { rememberBroData })(SaveAsDraft)
