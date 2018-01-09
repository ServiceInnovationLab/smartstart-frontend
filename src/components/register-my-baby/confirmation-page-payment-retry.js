import React from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import get from 'lodash/get'
import Spinner from '../spinner/spinner'
import { fetchBroData } from '../../actions/birth-registration'

import './confirmation.scss'
import { checkStatus } from 'utils'

class PaymentFailPage extends React.Component {
  componentWillMount() {
    this.props.fetchBroData()
  }

  componentWillReceiveProps(nextProps) {
    const { confirmationData, fetchingSavedUserData } = nextProps
    if (!fetchingSavedUserData && !confirmationData.applicationReferenceNumber) {
      this.props.router['push']('/')
    }
  }

  componentDidMount() {
    // redirect to failed payment page just before session will expire
    this.setState({
      pageTimeout: setTimeout(() => {
        window.location.href = '/register-my-baby/confirmation-payment-outstanding'
      }, 28 * 60 * 1000) // 28 min
    })
  }

  componentWillUnmount() {
    // clear 28 min timeout that has been set on didMount
    clearTimeout(this.state.pageTimeout)
  }

  onRetry() {
    const { applicationReferenceNumber } = this.props.confirmationData

    if (applicationReferenceNumber) {
      fetch(`/birth-registration-api/Births/birth-registrations/${applicationReferenceNumber}/retry-payment/`)
        .then(checkStatus)
        .then(response => response.json())
        .then(data => {
          window.location.href = data && data.response ? data.response.paymentURL : '/'
        })
        .catch(() => {
          this.props.router['push'](`/register-my-baby/confirmation-payment-outstanding`)
        })
    } else {
      // if we don't have application reference number
      this.props.router['push']('/')
    }
  }

  onCancel() {
    // don't need to wait for response
    // backend submits it if it doesn't get a response in time
    this.props.router['push'](`/register-my-baby/confirmation-payment-outstanding`)
  }

  render() {
    const failedPaymentMsg =
      `The payment for your birth certificate order has failed, probably because payment method used was declined.
      You can retry your payment now or cancel your birth certificate order and buy a certificate at a later date.`

    if (this.props.fetchingSavedUserData) {
      return <Spinner text="Retrieving application ..."/>
    }

    return (
      <div className="confirmation retry">
        <div>
          <div className="warning"><strong>Warning: </strong>{failedPaymentMsg}</div>
        </div>
        <p>
          Note - if we get no response from you within the next five minutes
          we will assume you no longer want your certificate order and will cancel the payment.
        </p>
        <div className="form-actions">
          <button  type="button" onClick={this.onRetry.bind(this)}>Retry my payment</button>
          <button  type="button" onClick={this.onCancel.bind(this)}>No, I'll just register the birth without buying a certificate</button>
        </div>
      </div>
    )
  }
}

PaymentFailPage.propTypes = {
  router: PropTypes.object.isRequired,
  confirmationData: PropTypes.object.isRequired,
  fetchBroData: PropTypes.func.isRequired,
  fetchingSavedUserData: PropTypes.bool.isRequired,

}

const mapStateToProps = state => ({
  fetchingSavedUserData: get(state, 'birthRegistration.fetchingSavedUserData'),
  confirmationData: get(state, 'birthRegistration.savedRegistrationForm.confirmationData') || {}
})

export default connect(mapStateToProps, { fetchBroData })(PaymentFailPage)
