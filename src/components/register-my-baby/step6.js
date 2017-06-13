import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import find from 'lodash/find'
import get from 'lodash/get'
import Accordion from './accordion'
import makeFocusable from './make-focusable'
import renderRadioGroup from './render-radio-group'
import renderCustomSelect from './render-custom-select'
import renderField from './render-field'
import renderPlacesAutocomplete from './render-places-autocomplete'
import {
  yesNo as yesNoOptions,
  deliveryMethods
} from './options'
import {
  REQUIRE_MESSAGE_STREET,
  REQUIRE_MESSAGE_POSTCODE,
} from './validation-messages'
import { required, requiredWithMessage, email } from './validate'
import './step6.scss'

const PRODUCT_OPTIONS = [
  { value: 'BC05', label: 'All Blacks NZ (limited time only)', price: 35, imageSrc: '/assets/img/certificates/birth-certificate-allblacks.png' },
  { value: 'ZBFD', label: 'Forest', price: 35, imageSrc: '/assets/img/certificates/birth-certificate-forest.png' },
  { value: 'ZBBD', label: 'Beach', price: 35, imageSrc: '/assets/img/certificates/birth-certificate-beach.png' },
  { value: 'ZBBC', label: 'Standard', price: 33, imageSrc: '/assets/img/certificates/birth-certificate-standard.png' },
  { value: 'BC06', label: 'Standard & All Blacks NZ', subLabel: 'Two certificate package', price: 55, imageSrc: '/assets/img/certificates/birth-certificate-standard-and-allblacks.png' },
  { value: 'ZBFP', label: 'Standard & Forest', subLabel: 'Two certificate package', price: 55, imageSrc: '/assets/img/certificates/birth-certificate-standard-and-forest.png' },
  { value: 'ZBBP', label: 'Standard & Beach', subLabel: 'Two certificate package', price: 55, imageSrc: '/assets/img/certificates/birth-certificate-standard-and-beach.png' }
]

const PRODUCT_OPTIONS_WITH_PRICE = PRODUCT_OPTIONS.map(product => ({
    ...product,
    label: `${product.label} - $${product.price.toFixed(2)}`
}))

const validate = () => {
  const errors = {}
  return errors
}

/**
 * TODO in transformation step:
 *
 * [ ] remove certificateOrder.deliveryAddressType
 * [ ] convert certificateOrder.courierDelivery to boolean
 * [ ] convert certificateOrder.deliveryAddress to match spec
 *
 * "deliveryAddress": {
 *   "line1": "string",                -> `streetAddress`
 *   "line2": "string",                -> `suburb`
 *   "suburbTownPostCode": "string",   -> `${town} ${postalCode}`
 *   "countryCode": "string"
 * }
 */
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

    this.props.change('certificateOrder.deliveryAddress.line1', streetAddress)
    this.props.change('certificateOrder.deliveryAddress.suburb', suburb)
    this.props.change('certificateOrder.deliveryAddress.line2', `${town} ${postalCode}`)
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
    const { orderBirthCertificate, productCode, quantity, courierDelivery, handleSubmit, submitting } = this.props
    const product = productCode ? find(PRODUCT_OPTIONS, { value: productCode }) : null
    const previewImage = product ? product.imageSrc : '/assets/img/certificates/birth-certificate-preview.png'
    const deliveryPrice = courierDelivery === 'standard' ? 0 : 5
    const totalPrice = (product && quantity) ? (product.price * quantity + deliveryPrice) : 0

    return (
      <div id="step-6">
        <h2><span className="visuallyhidden">Step</span> <span className="step-number">6</span> Tono i te tiwhikete whanau <br/> Order a birth certificate</h2>
        <div className="informative-text">
          You're not required to buy a birth certificate but some people like to have one as a record or momento. To purchase a certificate online you will need a credit card.
        </div>
        <form onSubmit={handleSubmit(this.props.onSubmit)}>
          <Field
            name="orderBirthCertificate"
            component={renderRadioGroup}
            label="Do you want to order a birth certificate?"
            instructionText="You can buy a birth certificate or move on to reviewing your registration."
            options={yesNoOptions}
            validate={[required]}
          />
          { orderBirthCertificate === 'yes' &&
            <div className="component-grouping">
              <h4>Certificate details</h4>
              <Field
                className="product-select"
                name="certificateOrder.productCode"
                component={renderCustomSelect}
                options={PRODUCT_OPTIONS_WITH_PRICE}
                label="Choose your design"
                placeholder="Please select a design"
                validate={[required]}
              />
              <div className="birth-certificate-preview">
                <img src={`${previewImage}`} alt={`${product ? product.label : 'default'}  preview`}/>
              </div>
              <Field
                className="quantity-select"
                name="certificateOrder.quantity"
                component={renderCustomSelect}
                options={[
                  {value: 1, label: '1'},
                  {value: 2, label: '2'},
                  {value: 3, label: '3'},
                  {value: 4, label: '4'},
                  {value: 5, label: '5'},
                ]}
                label="Choose your quantity"
                validate={[required]}
              />
              <Field
                name="certificateOrder.courierDelivery"
                component={renderRadioGroup}
                label="Choose your delivery method"
                options={deliveryMethods}
                validate={[required]}
              />
              <div className="expandable-group secondary">
                <Accordion>
                  <Accordion.Toggle>
                    What if I want to send the certificate overseas?
                  </Accordion.Toggle>
                  <Accordion.Content>
                    <p>If you want to send the certificate to an address outside New Zealand, select Standard delivery and we will contact you to discuss the applicable charges.</p>
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
              <Field
                name="certificateOrder.deliveryName"
                component={renderField}
                type="text"
                label="Delivery name"
                instructionText="You may address the certificate to your baby if you wish."
                validate={[required]}
              />
              <Field
                name="certificateOrder.deliveryAddressType"
                component={renderRadioGroup}
                label="What address should we deliver to?"
                options={[
                  { value: 'mother', display: 'Mother\'s' },
                  { value: 'father', display: 'Father\'s' },
                  { value: 'other', display: 'Other' }
                ]}
                onChange={this.onDeliveryAddressTypeChange}
                validate={[required]}
              />

              <fieldset>
                <legend className="visuallyhidden">Delivery address</legend>
                <div className="input-groups">
                  <Field
                    name="certificateOrder.deliveryAddress.line1"
                    component={renderPlacesAutocomplete}
                    type="text"
                    label="Street number and Street name"
                    onPlaceSelect={this.onPlaceSelect}
                    validate={[requiredWithMessage(REQUIRE_MESSAGE_STREET)]}
                  />
                  <Field
                    name="certificateOrder.deliveryAddress.suburb"
                    component={renderField}
                    type="text"
                    label="Suburb"
                  />
                  <Field
                    name="certificateOrder.deliveryAddress.line2"
                    component={renderField}
                    type="text"
                    label="Town/City and Postcode"
                    validate={[requiredWithMessage(REQUIRE_MESSAGE_POSTCODE)]}
                  />
                </div>
              </fieldset>

              <Field
                name="certificateOrder.deliveryAddress.countryCode"
                component={renderCustomSelect}
                options={[
                  { value: 'Australia', label: 'Australia' },
                  { value: 'Canada', label: 'Canada' },
                  { value: 'Japan', label: 'Japan' },
                  { value: 'Madagascar', label: 'Madagascar' },
                ]}
                label="Country (if not New Zealand)"
                placeholder="Please select"
              />

              <Field
                name="certificateOrder.emailAddress"
                component={renderField}
                type="email"
                label="Email address (for a tax receipt)"
                validate={[email]}
              />

              <div className="informative-text">
                You will be directed to a Payment Express hosted payment page for payment when you submit your birth registration.
              </div>
            </div>
          }
          <div className="form-actions">
            <button type="button" className="previous" onClick={this.props.onPrevious}>Back</button>
            <button type="submit" className="next" disabled={submitting}>Next</button>
          </div>
        </form>
      </div>
    )
  }
}

OrderCertificatesForm.propTypes = {
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
  onSubmit: PropTypes.func,
  onPrevious: PropTypes.func,
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
    fatherAddressSuburb: selector(state, 'father.homeAddress.suburb')
  })
)(OrderCertificatesForm)

export default makeFocusable(OrderCertificatesForm)

