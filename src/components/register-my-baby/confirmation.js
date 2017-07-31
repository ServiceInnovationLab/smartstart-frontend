import React, { Component, PropTypes } from 'react'
import find from 'lodash/find'
import Accordion from './accordion'
import { retrieveBroData } from '../../actions/birth-registration'
import {
  products as productOptions
} from './options'
import Spinner from '../spinner/spinner'
import './confirmation.scss'

class Confirmation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      retrieving: true,
      sessionData: null
    };
  }

  componentWillMount() {
    retrieveBroData()
      .then(result => {
        if (!result || !result.applicationReferenceNumber) {
          throw new Error();
        }
        this.setState({
          retrieving: false,
          sessionData: result
        });
      })
      .catch(() => {
        window.location = '/'
      });
  }

  render() {
    const { sessionData } = this.state;
    const { paymentSuccess } = this.props;

    if (!sessionData) {
      return <Spinner text="Retrieving application ..."/>
    }

    const { productCode, courierDelivery, quantity, stillBorn } = sessionData

    const product = productCode ? find(productOptions, { value: productCode }) : null
    const deliveryPrice = courierDelivery === 'standard' ? 0 : 5
    const totalPrice = (product && quantity) ? (product.price * quantity + deliveryPrice) : 0

    let resultNotification;

    if (product && !paymentSuccess) {
      resultNotification = <div>
        <div className="success">
          <strong>Success: </strong>
          { stillBorn ?
            <span>We understand this is a difficult time. Thank you for registering your baby.</span>:
            <span>Thanks for registering the birth of your baby. If we have any questions, we'll contact you.</span>
          }
        </div>
        <div className="warning"><strong>Warning: </strong>Your birth certificate order has not been processed, probably because the payment method used was declined. You can order a certificate at a later time if you want to.</div>
      </div>
    } else {
      resultNotification = <div className="instruction">
        <strong>
          { stillBorn ?
            <span>We understand this is a difficult time. Thank you for registering your baby.</span>:
            <span>Thanks for registering the birth of your baby. If we have any questions, we'll contact you.</span>
          }
        </strong>
        { product &&
          <strong>Your baby's birth certificate will normally arrive within 10 working days (allowing time for postal delivery).</strong>
        }
      </div>
    }

    return <div className="confirmation">
      <h2><span className="step-number"></span> Te haamauraa <br/> Confirmation</h2>

      { resultNotification }

      <div className="informative-text">
        Your reference number is: <strong>{sessionData.applicationReferenceNumber}</strong>
      </div>

      { product &&
        <div className="order-summary">
          <label>Order summary</label>
          <ul>
            <li>
              <span>{quantity} x {product.label} {product.subLabel && <em> - {product.subLabel}</em>}</span>
              <span>${(quantity * product.price).toFixed(2)}</span>
            </li>
            <li>
              <span>Shipping</span>
              <span>{ deliveryPrice ? `$${deliveryPrice.toFixed(2)}` :  'FREE'}</span>
            </li>
            { paymentSuccess ?
              <li>
                <strong>Total</strong>
                <strong>${ totalPrice.toFixed(2) }</strong>
              </li> :
              <li className="fail-payment">
                <strong>Payment declined</strong>
              </li>
            }
          </ul>
        </div>
      }

      <Accordion>
        <Accordion.Toggle>
          Birth registration questions?
        </Accordion.Toggle>
        <Accordion.Content>
          <p>
            If you want to contact us about your baby's registration you can email <a href="mailto:bdm.nz@dia.govt.nz">bdm.nz@dia.govt.nz</a> or call free on <a href="tel:0800225255">0800 225 255</a> (NZ only).
          </p>
        </Accordion.Content>
      </Accordion>

      { stillBorn &&
        <Accordion>
          <Accordion.Toggle>
            Need additional support?
          </Accordion.Toggle>
          <Accordion.Content>
            <p>If you've lost your baby and need support, there are several organisations you can contact:</p>
            <ul>
              <li><a href="http://www.sands.org.nz" target="_blank" rel="noreferrer noopener">Sands New Zealand</a></li>
              <li><a href="https://www.miscarriagesupport.org.nz" target="_blank" rel="noreferrer noopener">Miscarriage Support</a></li>
              <li><a href="http://skylight.org.nz" target="_blank" rel="noreferrer noopener">Skylight</a></li>
            </ul>
          </Accordion.Content>
        </Accordion>
      }

      { !stillBorn &&
        <Accordion>
          <Accordion.Toggle>
            IRD number questions?
          </Accordion.Toggle>
          <Accordion.Content>
            <p>
              If you have applied for an IRD number for your baby, you should receive it within 15 working days. It will arrive separately to your baby's birth certificate. If you have any questions regarding an IRD number, please go to <a href="http://www.ird.govt.nz/how-to/irdnumbers" target="_blank" rel="noreferrer noopener">www.ird.govt.nz/how-to/irdnumbers</a>
            </p>
          </Accordion.Content>
        </Accordion>
      }

      { !stillBorn &&
        <Accordion>
          <Accordion.Toggle>
            Ministry of Social Development/benefit questions?
          </Accordion.Toggle>
          <Accordion.Content>
            <p>
              If you have any questions regarding benefits and services you may be entitled to, contact MSD <a href="https://www.workandincome.govt.nz" target="_blank" rel="noreferrer noopener">https://www.workandincome.govt.nz</a>.
            </p>
          </Accordion.Content>
        </Accordion>
      }

      { ((stillBorn && product) || (!stillBorn)) &&
        <Accordion>
          <Accordion.Toggle>
            { product ?
              <span>How do I buy an extra birth certificate?</span>:
              <span>How do I buy a birth certificate?</span>
            }
          </Accordion.Toggle>
          <Accordion.Content>
            <p>
              If you have already registered your baby, you are still able to order a birth certificate or extra certificates. You can do this by requesting an order over the phone, online, by post or in person.
              <br/>
              It costs:
            </p>
            <ul>
              <li>$33 for a standard birth certificate</li>
              <li>$35 for a decorative birth certificate, or</li>
              <li>$55 for a pack that includes both a standard and a decorative birth certificate.</li>
            </ul>

            <p>
              <a href="https://www.govt.nz/browse/nz-passports-and-citizenship/proving-and-protecting-your-identity/get-a-birth-certificate/#how-to-apply"  target="_blank" rel="noreferrer noopener">Get a birth certificate </a>
            </p>
          </Accordion.Content>
        </Accordion>
      }

      { !stillBorn &&
        <div className="aligner">
          <div className="aligner-item aligner-item-center">
            <img src='/assets/img/illustrations/illustration-6.png' />
          </div>
          <div className="aligner-item">
            <div className="instruction">
              <strong>Do you know what services are available for parents in your area?</strong>
              <br/>
              <a href="https://smartstart.services.govt.nz">Check out SmartStart</a>
            </div>
          </div>
        </div>
      }

      <div className="print">
        <button type="button">Print</button>
      </div>
    </div>
  }
}

Confirmation.propTypes = {
  paymentSuccess: PropTypes.bool
}

export default Confirmation
