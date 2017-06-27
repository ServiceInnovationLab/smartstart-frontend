import React, { PropTypes } from 'react'
import { Field } from 'redux-form'
import find from 'lodash/find'
import get from 'lodash/get'
import renderFieldReview from '../../fields/render-review-field'
import { formatAddress } from './utils'
import {
  yesNo,
  products,
  deliveryMethods,
  birthCertificateDeliveryAddresses,
  getOptionDisplay
} from '../../options'

const renderStep6Review = ({formState, onEdit, countries}) => {
  const product = formState.orderBirthCertificate === 'yes' ? find(products, { value: formState.certificateOrder.productCode }) : null
  const quantity = formState.orderBirthCertificate === 'yes' ? formState.certificateOrder.quantity : 0
  const deliveryPrice = formState.orderBirthCertificate === 'yes' ? (formState.certificateOrder.courierDelivery === 'standard' ? 0 : 5) : 0
  const selectedDesign = product ? <span>
    <span>{product.label}</span>
    { product.subLabel &&
      <em> - {product.subLabel}</em>
    }
  </span> : null
  const totalPrice = (product && quantity) ? (product.price * quantity + deliveryPrice) : 0
  const deliveryCountryCode = get(formState, 'certificateOrder.deliveryAddress.countryCode')
  const deliveryCountry = deliveryCountryCode ? get(find(countries, { code: deliveryCountryCode}), 'name') : null

  return <div className="review-section">
    <div className="section-heading">
      <h3>Tono i te tiwhikete whanau <br/> Order a birth certificate</h3>
      <button type="button" onClick={() => onEdit('buy-birth-certificates')} className="section-edit-btn">Edit</button>
    </div>
    <Field
      name="orderBirthCertificate"
      label="Do you want to order a birth certificate?"
      component={renderFieldReview}
      valueRenderer={getOptionDisplay(yesNo)}
      section="buy-birth-certificates"
      onEdit={onEdit}
    />
    { formState.orderBirthCertificate === 'yes' &&
      <div>
        <Field
          name="certificateOrder.productCode"
          label="Choose your design"
          component={renderFieldReview}
          valueRenderer={() => selectedDesign}
          section="buy-birth-certificates"
          onEdit={onEdit}
        />
        <Field
          name="certificateOrder.quantity"
          label="Choose your quantity"
          component={renderFieldReview}
          section="buy-birth-certificates"
          onEdit={onEdit}
        />
        <Field
          name="certificateOrder.courierDelivery"
          label="Choose your delivery method"
          component={renderFieldReview}
          valueRenderer={getOptionDisplay(deliveryMethods)}
          section="buy-birth-certificates"
          onEdit={onEdit}
        />

        <div className="review-field">
          <div>
            <div>
              <strong>Total cost</strong>
              <span>${ totalPrice.toFixed(2) }</span>
            </div>
          </div>
        </div>

        <h4>Delivery details</h4>
        <Field
          name="certificateOrder.deliveryName"
          label="Delivery name"
          component={renderFieldReview}
          section="buy-birth-certificates"
          onEdit={onEdit}
        />
        <Field
          name="certificateOrder.deliveryAddressType"
          label="What address should we deliver to?"
          component={renderFieldReview}
          valueRenderer={getOptionDisplay(birthCertificateDeliveryAddresses)}
          section="buy-birth-certificates"
          onEdit={onEdit}
        />
        <Field
          name="certificateOrder.deliveryAddress.line1"
          label="What address should we deliver to?"
          component={renderFieldReview}
          valueRenderer={() => formatAddress(formState.certificateOrder.deliveryAddress)}
          section="buy-birth-certificates"
          onEdit={onEdit}
        />

        <Field
          name="certificateOrder.deliveryAddress.countryCode"
          label="Country (if not New Zealand)"
          component={renderFieldReview}
          valueRenderer={() => deliveryCountry}
          section="buy-birth-certificates"
          onEdit={onEdit}
        />

        <Field
          name="certificateOrder.emailAddress"
          label="Email address (for a tax receipt)"
          component={renderFieldReview}
          section="buy-birth-certificates"
          onEdit={onEdit}
        />
      </div>
    }
  </div>
}

renderStep6Review.propTypes = {
  formState: PropTypes.object,
  onEdit: PropTypes.func,
  countries: PropTypes.array
}

export default renderStep6Review

