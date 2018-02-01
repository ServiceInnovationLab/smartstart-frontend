import get from 'lodash/get'
import check from 'components/form/get-validation'
import fields from './fields'

const validate = (values) => {
  const errors = {}

  const isNZResident = get(values, 'applicant.isNZResident')
  const hasAccommodationCosts = get(values, 'applicant.hasAccommodationCosts')

  check('applicant.isNZResident')(fields, values, errors)

  if (isNZResident === 'true') {
    check('applicant.normallyLivesInNZ')(fields, values, errors)
    check('applicant.Age')(fields, values, errors)
    check('applicant.hasAccommodationCosts')(fields, values, errors)
  }

  if (hasAccommodationCosts === 'true') {
    check('applicant.hasSocialHousing')(fields, values, errors)
    check('applicant.receivesAccommodationSupport')(fields, values, errors)
    check('threshold.income.AccommodationSupplement')(fields, values, errors)
  }

  return errors
}

export default validate
