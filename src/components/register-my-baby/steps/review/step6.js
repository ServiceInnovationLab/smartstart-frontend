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
  getBirthCertificateDeliveryAddresses,
  getOptionDisplay
} from '../../options'
import schema from '../schemas/step6'
import getFieldReviewProps from './get-field-review-props'

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
  const isOtherParent = formState.assistedHumanReproduction === 'yes' && formState.assistedHumanReproductionWomanConsented
  const birthCertificateDeliveryAddresses = getBirthCertificateDeliveryAddresses(isOtherParent)

  return <div className="review-section">
    <div className="section-heading">
      <h3>Tono i te tiwhikete whanau <br/> Order a birth certificate</h3>
      <button type="button" onClick={() => onEdit('buy-birth-certificates')} className="section-edit-btn">Edit</button>
    </div>
    <Field
      {...getFieldReviewProps(schema, 'orderBirthCertificate')}
      component={renderFieldReview}
      valueRenderer={getOptionDisplay(yesNo)}
      section="buy-birth-certificates"
      onEdit={onEdit}
    />
    { formState.orderBirthCertificate === 'yes' &&
      <div>
        <Field
          {...getFieldReviewProps(schema, 'certificateOrder.productCode')}
          component={renderFieldReview}
          valueRenderer={() => selectedDesign}
          section="buy-birth-certificates"
          onEdit={onEdit}
        />
        <Field
          {...getFieldReviewProps(schema, 'certificateOrder.quantity')}
          component={renderFieldReview}
          section="buy-birth-certificates"
          onEdit={onEdit}
        />
        <Field
          {...getFieldReviewProps(schema, 'certificateOrder.courierDelivery')}
          component={renderFieldReview}
          valueRenderer={getOptionDisplay(deliveryMethods)}
          section="buy-birth-certificates"
          onEdit={onEdit}
        />

        <div className="review-field">
          <div>
            <div>
              <strong>Total cost </strong>
              <span>${ totalPrice.toFixed(2) }</span>
            </div>
          </div>
        </div>

        <h4>Delivery details</h4>
        <Field
          {...getFieldReviewProps(schema, 'certificateOrder.deliveryName')}
          component={renderFieldReview}
          section="buy-birth-certificates"
          onEdit={onEdit}
        />
        <Field
          {...getFieldReviewProps(schema, 'certificateOrder.deliveryAddressType')}
          component={renderFieldReview}
          valueRenderer={getOptionDisplay(birthCertificateDeliveryAddresses)}
          section="buy-birth-certificates"
          onEdit={onEdit}
        />
        <Field
          {...getFieldReviewProps(schema, 'certificateOrder.deliveryAddress.line1')}
          component={renderFieldReview}
          valueRenderer={() => formatAddress(formState.certificateOrder.deliveryAddress)}
          section="buy-birth-certificates"
          onEdit={onEdit}
        />

        <Field
          {...getFieldReviewProps(schema, 'certificateOrder.deliveryAddress.countryCode')}
          component={renderFieldReview}
          valueRenderer={() => deliveryCountry}
          section="buy-birth-certificates"
          onEdit={onEdit}
        />

        <Field
          {...getFieldReviewProps(schema, 'certificateOrder.emailAddress')}
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

