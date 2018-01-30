import get from 'lodash/get'
import check from 'components/form/get-validation'
import fields from './fields'

const validate = (values) => {
  const errors = {}

  const isNZResident = get(values, 'applicant.isNZResident')

  check('applicant.isNZResident')(fields, values, errors)

  if (isNZResident === 'true') {
    check('applicant.normallyLivesInNZ')(fields, values, errors)
    check('applicant.age')(fields, values, errors)
  }

  return errors
}

export default validate
