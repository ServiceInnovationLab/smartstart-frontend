import validateStep1 from './step1'
import validateStep2 from './step2'
import validateStep3 from './step3'
import validateStep4 from './step4'
import validateStep5 from './step5'
import validateStep6 from './step6'

const validate = (values) => {
  const step1Errors = validateStep1(values)
  const step2Errors = validateStep2(values)
  const step3Errors = validateStep3(values)
  const step4Errors = validateStep4(values)
  const step5Errors = validateStep5(values)
  const step6Errors = validateStep6(values)

  return  {
    ...step1Errors,
    ...step2Errors,
    ...step3Errors,
    ...step4Errors,
    ...step5Errors,
    ...step6Errors
  }
}

export default validate
