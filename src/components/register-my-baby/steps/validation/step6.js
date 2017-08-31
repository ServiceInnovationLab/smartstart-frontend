import get from 'lodash/get'
import set from 'lodash/set'
import check from './check'
import  schema from '../schemas/step6'
import {
  REQUIRE_BIRTH_CERTIFICATE_ORDER,
  REQUIRE_EMAIL_ADDRESS
} from '../../validation-messages'

const validate = (values) => {
  const errors = {}

  const orderBirthCertificate = get(values, 'orderBirthCertificate')
  const irdApplyForNumber = get(values, 'ird.applyForNumber')
  const irdNumberDeliveryAddress = get(values, 'ird.deliveryAddress')
  const irdNumberByEmail = get(values, 'ird.numberByEmail')

  check('orderBirthCertificate')(schema, values, errors)

  if (orderBirthCertificate === 'yes') {
    check('certificateOrder.productCode')(schema, values, errors)
    check('certificateOrder.quantity')(schema, values, errors)
    check('certificateOrder.courierDelivery')(schema, values, errors)
    check('certificateOrder.deliveryName')(schema, values, errors)
    check('certificateOrder.deliveryAddressType')(schema, values, errors)
    check('certificateOrder.deliveryAddress.line1')(schema, values, errors)
    check('certificateOrder.deliveryAddress.suburb')(schema, values, errors)
    check('certificateOrder.deliveryAddress.line2')(schema, values, errors)
    check('certificateOrder.emailAddress')(schema, values, errors)

    if (
      irdApplyForNumber === 'yes' &&
      irdNumberByEmail === 'yes' &&
      irdNumberDeliveryAddress === 'birthCertificateAddress' &&
      !get(values, 'certificateOrder.emailAddress')
    ) {
      set(errors, 'certificateOrder.emailAddress', REQUIRE_EMAIL_ADDRESS)
    }
  } else if (
      irdApplyForNumber === 'yes' &&
      irdNumberDeliveryAddress === 'birthCertificateAddress'
  ) {
    set(errors, 'orderBirthCertificate', REQUIRE_BIRTH_CERTIFICATE_ORDER)
  }

  return errors
}

export default validate
