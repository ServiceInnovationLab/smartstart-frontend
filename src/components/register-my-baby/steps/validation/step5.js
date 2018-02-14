import get from 'lodash/get'
import set from 'lodash/set'
import check from 'components/form/get-validation'
import  schema from '../schemas/step5'
import {
  REQUIRE_MOTHER_EMAIL_IRD,
  REQUIRE_FATHER_EMAIL_IRD,
  REQUIRE_AT_LEAST_ONE_MSD
} from '../../validation-messages'

const validate = (values) => {
  const errors = {}

  const irdApplyForNumber = get(values, 'ird.applyForNumber')
  const irdNumberDeliveryAddress = get(values, 'ird.deliveryAddress')
  const irdNumberByEmail = get(values, 'ird.numberByEmail')

  check('ird.applyForNumber')(schema, values, errors)

  if (irdApplyForNumber === 'yes') {
    check('ird.deliveryAddress')(schema, values, errors)
    check('ird.numberByEmail')(schema, values, errors)
    check('ird.taxCreditIRDNumber')(schema, values, errors)
  }

  if (
    irdApplyForNumber === 'yes' &&
    irdNumberByEmail === 'yes' &&
    (
      irdNumberDeliveryAddress === 'mothersAddress' ||
      irdNumberDeliveryAddress === 'fathersAddress'
    )
  ) {
    if (irdNumberDeliveryAddress === 'mothersAddress') {
      const motherEmail = get(values, 'mother.email')
      if (!motherEmail) {
        set(errors, 'ird.numberByEmail', REQUIRE_MOTHER_EMAIL_IRD)
      }
    } else if (irdNumberDeliveryAddress === 'fathersAddress') {
      const fatherEmail = get(values, 'father.email')
      if (!fatherEmail) {
        set(errors, 'ird.numberByEmail', REQUIRE_FATHER_EMAIL_IRD)
      }
    }
  }


  const notifyMsd = get(values, 'msd.notify')
  const motherMsd = get(values, 'msd.mothersClientNumber')
  const fatherMsd = get(values, 'msd.fathersClientNumber')

  if (notifyMsd) {
    check('msd.mothersClientNumber')(schema, values, errors)
    check('msd.fathersClientNumber')(schema, values, errors)

    if (!motherMsd && !fatherMsd) {
      set(errors, 'msd.fathersClientNumber', REQUIRE_AT_LEAST_ONE_MSD)
    }
  }

  return errors
}

export default validate



