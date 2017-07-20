import get from 'lodash/get'
import check from './check'
import  schema from '../schemas/step6'

const validate = (values) => {
  const errors = {}

  const orderBirthCertificate = get(values, 'orderBirthCertificate')

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
    check('certificateOrder.deliveryAddress.email')(schema, values, errors)
  }

  return errors
}

export default validate




