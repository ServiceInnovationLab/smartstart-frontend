import React from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import get from 'lodash/get'
import Spinner from '../spinner/spinner'
import { fetchBroData } from '../../actions/birth-registration'

import './confirmation.scss'
import { checkStatus } from 'utils'

class PaymentFailPage extends React.Component {
  onRetry() {
    const { applicationReferenceNumber } = this.props.formState

    if (applicationReferenceNumber) {
      fetch(`/birth-registration-api/Births/birth-registrations/${applicationReferenceNumber}/retry-payment/`)
        .then(checkStatus)
        .then(response => response.json())
        .then(data => {
          window.location.href = data && data.response ? data.response.paymentURL : '/'
        })
    } else {
      // if we don't have application reference number
      //  go to home page
      this.props.router['push']('/')
    }
  }

  onCancel() {
    // don't need to wait for response
    // backend submits it if it doesn't get a response in time
    this.props.router['push'](`/register-my-baby/confirmation-payment-outstanding`)
  }


  componentWillMount() {
    this.props.fetchBroData()
  }

  componentWillReceiveProps(nextProps) {
    const { formState, fetchingFormState } = nextProps
    if (!fetchingFormState && !formState.applicationReferenceNumber) {
      this.props.router['push']('/')
    }
  }

  render() {
    const failedPaymentMsg =
      `The payment for your birth certificate order has failed, probably because payment method used was declided.
      You can retry your payment now or cancel your birth certificate order and buy a certificate at a later date.`

    if (this.props.fetchingFormState) {
      return <Spinner text="Retrieving application ..."/>
    }

    return (
      <div className="confirmation retry">
        <div>
          <div className="warning"><strong>Warning: </strong>{failedPaymentMsg}</div>
        </div>
        <p>
          Note - if we get no response from you within the next five minutes
          we will assume you no longer want your certificate order and will cancel the payment
        </p>
        <div className="form-actions">
          <button  type="button" onClick={this.onRetry.bind(this)}>Retry my payment</button>
          <button  type="button" onClick={this.onCancel.bind(this)}>No, thanks - cancel my order</button>
        </div>
      </div>
    )
  }
}

PaymentFailPage.propTypes = {
  router: PropTypes.object.isRequired,
  formState: PropTypes.object.isRequired,
  fetchBroData: PropTypes.func.isRequired,
  fetchingFormState: PropTypes.bool.isRequired,

}

const mapStateToProps = state => ({
  fetchingFormState: get(state, 'birthRegistration.fetchingFormState'),
  formState: get(state, 'birthRegistration.savedRegistrationForm.data') || {}
})

export default connect(mapStateToProps, { fetchBroData })(PaymentFailPage)
