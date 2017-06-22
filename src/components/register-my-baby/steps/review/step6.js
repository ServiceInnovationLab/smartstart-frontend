import React, { PropTypes } from 'react'
import FieldReview from './field-review'
import find from 'lodash/find'
import get from 'lodash/get'
import { formatAddress } from './utils'
// import SubFieldReview from './sub-field-review'
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
    <FieldReview
      name="orderBirthCertificate"
      label="Do you want to order a birth certificate?"
      value={getOptionDisplay(yesNo, formState.orderBirthCertificate)}
      section="buy-birth-certificates"
      onEdit={onEdit}
    />
    { formState.orderBirthCertificate === 'yes' &&
      <div>
        <FieldReview
          name="certificateOrder.productCode"
          label="Choose your design"
          value={selectedDesign}
          section="buy-birth-certificates"
          onEdit={onEdit}
        />
        <FieldReview
          name="certificateOrder.quantity"
          label="Choose your quantity"
          value={formState.certificateOrder.quantity}
          section="buy-birth-certificates"
          onEdit={onEdit}
        />
        <FieldReview
          name="certificateOrder.courierDelivery"
          label="Choose your delivery method"
          value={getOptionDisplay(deliveryMethods, formState.certificateOrder.courierDelivery)}
          section="buy-birth-certificates"
          onEdit={onEdit}
        />

        <div className="review-field">
          <div>
            <strong>Total cost</strong>
            <span>${ totalPrice.toFixed(2) }</span>
          </div>
        </div>

        <h4>Delivery details</h4>
        <FieldReview
          name="certificateOrder.deliveryName"
          label="Delivery name"
          value={formState.certificateOrder.deliveryName}
          section="buy-birth-certificates"
          onEdit={onEdit}
        />
        <FieldReview
          name="certificateOrder.deliveryAddressType"
          label="What address should we deliver to?"
          value={getOptionDisplay(birthCertificateDeliveryAddresses, formState.certificateOrder.deliveryAddressType)}
          section="buy-birth-certificates"
          onEdit={onEdit}
        />
        <FieldReview
          name="certificateOrder.deliveryAddress.line1"
          label="What address should we deliver to?"
          value={formatAddress(formState.certificateOrder.deliveryAddress)}
          section="buy-birth-certificates"
          onEdit={onEdit}
        />

        <FieldReview
          name="certificateOrder.deliveryAddress.countryCode"
          label="Country (if not New Zealand)"
          value={deliveryCountry}
          section="buy-birth-certificates"
          onEdit={onEdit}
        />

        <FieldReview
          name="certificateOrder.emailAddress"
          label="Email address (for a tax receipt)"
          value={formState.certificateOrder.emailAddress}
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

