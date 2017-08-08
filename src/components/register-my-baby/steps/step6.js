import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import find from 'lodash/find'
import get from 'lodash/get'
import Accordion from '../accordion'
import makeFocusable from '../hoc/make-focusable'
import {
  products as productOptions,
  courierDeliveryPrice,
  getBirthCertificateDeliveryAddresses
} from '../options'
import './step6.scss'
import { maxLength } from '../normalize'
import validate from './validation'
import schema from './schemas/step6'
import getFieldProps from './get-field-props'


class OrderCertificatesForm extends Component {
  constructor(props) {
    super(props)
    this.onDeliveryAddressTypeChange = this.onDeliveryAddressTypeChange.bind(this)
    this.onPlaceSelect = this.onPlaceSelect.bind(this)
  }

  onPlaceSelect(placeDetail) {
    const { address_components: addressComponents } = placeDetail

    const streetAddress = get(placeDetail, 'name', '')
    const suburb = get(placeDetail, 'vicinity', '')

    const town = get(
      find(addressComponents, component => component.types.indexOf('locality') > -1),
      'long_name',
      ''
    )
    const postalCode = get(
      find(addressComponents, component => component.types.indexOf('postal_code') > -1),
      'long_name',
      ''
    )

    this.props.change('certificateOrder.deliveryAddress.line1', maxLength(45)(streetAddress))
    this.props.change('certificateOrder.deliveryAddress.suburb', maxLength(30)(suburb))
    this.props.change('certificateOrder.deliveryAddress.line2', maxLength(30)(`${town} ${postalCode}`))
  }

  onDeliveryAddressTypeChange(e, newVal) {
    let line1 = '';
    let line2 = '';
    let suburb = '';

    if (newVal === 'mother') {
      line1 = this.props.motherAddressLine1
      line2 = this.props.motherAddressLine2
      suburb = this.props.motherAddressSuburb
    } else if (newVal === 'father') {
      line1 = this.props.fatherAddressLine1
      line2 = this.props.fatherAddressLine2
      suburb = this.props.fatherAddressSuburb
    }

    this.props.change('certificateOrder.deliveryAddress.line1', line1)
    this.props.change('certificateOrder.deliveryAddress.line2', line2)
    this.props.change('certificateOrder.deliveryAddress.suburb', suburb)
  }

  render() {
    const {
      orderBirthCertificate, productCode, quantity, courierDelivery, fatherKnown, handleSubmit, submitting,
      assistedHumanReproduction, assistedHumanReproductionSpermDonor, assistedHumanReproductionWomanConsented
    } = this.props
    const product = productCode ? find(productOptions, { value: productCode }) : null
    const previewImage = product ? product.imageSrc : '/assets/img/certificates/birth-certificate-preview.png'
    const deliveryPrice = courierDelivery === 'standard' ? 0 : courierDeliveryPrice
    const totalPrice = (product && quantity) ? (product.price * quantity + deliveryPrice) : 0

    const hideFatherOption = fatherKnown === 'no' || (assistedHumanReproduction === 'yes' && assistedHumanReproductionSpermDonor)
    const isOtherParent = assistedHumanReproduction === 'yes' && assistedHumanReproductionWomanConsented
    const birthCertificateDeliveryAddresses = getBirthCertificateDeliveryAddresses(isOtherParent)

    const deliveryAddresses = hideFatherOption ?
      birthCertificateDeliveryAddresses.filter(opt => opt.value !== 'father') :
      birthCertificateDeliveryAddresses

    return (
      <div id="step-6">
        <h2><span className="visuallyhidden">Step</span> <span className="step-number">6</span> Te tono i te tiwhikete whānautanga <br/> Order a birth certificate</h2>
        <div className="informative-text">
          You can order a birth certificate or move on to reviewing your registration. To purchase a certificate online you will need a credit card.
        </div>
        <form onSubmit={handleSubmit(this.props.onSubmit)}>
          <Field {...getFieldProps(schema, 'orderBirthCertificate')} />

          { orderBirthCertificate === 'yes' &&
            <div className="component-grouping">
              <h4>Certificate details</h4>

              <Field {...getFieldProps(schema, 'certificateOrder.productCode')} />

              <div className="birth-certificate-preview">
                <img src={`${previewImage}`} alt={`${product ? product.label : 'default'}  preview`}/>
              </div>

              <Field {...getFieldProps(schema, 'certificateOrder.quantity')} />
              <Field {...getFieldProps(schema, 'certificateOrder.courierDelivery')} />

              <div className="expandable-group secondary">
                <Accordion>
                  <Accordion.Toggle>
                    What if I want to send the certificate overseas?
                  </Accordion.Toggle>
                  <Accordion.Content>
                    <p>If you want to send the certificate to an address outside New Zealand, select the standard delivery option.</p>
                  </Accordion.Content>
                </Accordion>
              </div>
              { product && quantity &&
                <div className="input-group order-summary">
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
                    <li>
                      <strong>Total</strong>
                      <strong>${ totalPrice.toFixed(2) }</strong>
                    </li>
                  </ul>
                </div>
              }
              <h4>Delivery details</h4>

              <Field {...getFieldProps(schema, 'certificateOrder.deliveryName')} />
              <Field
                {...getFieldProps(schema, 'certificateOrder.deliveryAddressType')}
                options={deliveryAddresses}
                onChange={this.onDeliveryAddressTypeChange}
              />

              <fieldset>
                <legend className="visuallyhidden">Delivery address</legend>
                <div className="input-groups">
                  <Field
                    {...getFieldProps(schema, 'certificateOrder.deliveryAddress.line1')}
                    onPlaceSelect={this.onPlaceSelect}
                  />
                  <Field {...getFieldProps(schema, 'certificateOrder.deliveryAddress.suburb')} />
                  <Field {...getFieldProps(schema, 'certificateOrder.deliveryAddress.line2')} />
                </div>
              </fieldset>

              <Field
                {...getFieldProps(schema, 'certificateOrder.deliveryAddress.countryCode')}
                options={this.props.countries}
              />

              <Field {...getFieldProps(schema, 'certificateOrder.emailAddress')} />

              <div className="informative-text">
                You will be directed to a Payment Express hosted payment page for payment when you submit your birth registration.
              </div>
            </div>
          }
          <div className="form-actions">
            { this.props.isReviewing ?
              <button type="button" className="previous" onClick={handleSubmit(this.props.onPrevious)}>Back</button>:
              <button type="button" className="previous" onClick={this.props.onPrevious}>Back</button>
            }
            <div>
              { this.props.isReviewing &&
                <button type="button" className="review" onClick={handleSubmit(this.props.onComebackToReview)}>Return to review</button>
              }
              <button type="submit" className="next" disabled={submitting}>Next</button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

OrderCertificatesForm.propTypes = {
  countries: PropTypes.array,
  orderBirthCertificate: PropTypes.string,
  productCode: PropTypes.string,
  quantity: PropTypes.number,
  courierDelivery: PropTypes.string,
  deliveryAddressType: PropTypes.string,
  motherAddressLine1: PropTypes.string,
  motherAddressLine2: PropTypes.string,
  motherAddressSuburb: PropTypes.string,
  fatherAddressLine1: PropTypes.string,
  fatherAddressLine2: PropTypes.string,
  fatherAddressSuburb: PropTypes.string,
  fatherKnown: PropTypes.string,
  assistedHumanReproduction: PropTypes.string,
  assistedHumanReproductionSpermDonor: PropTypes.bool,
  assistedHumanReproductionWomanConsented: PropTypes.bool,
  onSubmit: PropTypes.func,
  onPrevious: PropTypes.func,
  isReviewing: PropTypes.bool,
  onComebackToReview: PropTypes.func,
  handleSubmit: PropTypes.func,
  change: PropTypes.func,
  submitting: PropTypes.bool,
  pristine: PropTypes.bool,
}

OrderCertificatesForm = reduxForm({
  form: 'registration',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate
})(OrderCertificatesForm)


const selector = formValueSelector('registration')

OrderCertificatesForm = connect(
  state => ({
    countries: get(state, 'birthRegistration.countries'),
    orderBirthCertificate: selector(state, 'orderBirthCertificate'),
    productCode: selector(state, 'certificateOrder.productCode'),
    quantity: selector(state, 'certificateOrder.quantity'),
    courierDelivery: selector(state, 'certificateOrder.courierDelivery'),
    deliveryAddressType: selector(state, 'certificateOrder.deliveryAddressType'),
    motherAddressLine1: selector(state, 'mother.homeAddress.line1'),
    motherAddressLine2: selector(state, 'mother.homeAddress.line2'),
    motherAddressSuburb: selector(state, 'mother.homeAddress.suburb'),
    fatherAddressLine1: selector(state, 'father.homeAddress.line1'),
    fatherAddressLine2: selector(state, 'father.homeAddress.line2'),
    fatherAddressSuburb: selector(state, 'father.homeAddress.suburb'),
    fatherKnown: selector(state, 'fatherKnown'),
    assistedHumanReproduction: selector(state, 'assistedHumanReproduction'),
    assistedHumanReproductionSpermDonor: selector(state, 'assistedHumanReproductionSpermDonor'),
    assistedHumanReproductionWomanConsented: selector(state, 'assistedHumanReproductionWomanConsented'),
  })
)(OrderCertificatesForm)

export default makeFocusable(OrderCertificatesForm)

