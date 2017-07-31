import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getFormValues } from 'redux-form'
import classNames from 'classnames'
import './progress.scss'
import validateStep1 from './steps/validation/step1'
import validateStep2 from './steps/validation/step2'
import validateStep3 from './steps/validation/step3'
import validateStep4 from './steps/validation/step4'
import validateStep5 from './steps/validation/step5'
import validateStep6 from './steps/validation/step6'

const steps = [1, 2, 3, 4, 5, 6]
const stepValidateFn = {
  '1': validateStep1,
  '2': validateStep2,
  '3': validateStep3,
  '4': validateStep4,
  '5': validateStep5,
  '6': validateStep6
}

const isComplete = (formState, step) => {
  const errors = stepValidateFn[step](formState)
  return Object.keys(errors).length === 0
}

const StepProgress = ({ step, isComplete, isCurrent, isClickable, onStepClick }) => {
  const stepClass = classNames(
    'form-wizard-step',
    { 'finished': !isCurrent && isComplete },
    { 'clickable': isClickable },
    { 'current': isCurrent }
  )
  return <div
    className={stepClass}
    onClick={() => onStepClick(step)}
  >
    <div className="form-wizard-step-icon">
      <span>{step}</span>
    </div>
  </div>
}

StepProgress.propTypes = {
  step: PropTypes.number,
  isComplete: PropTypes.bool,
  isClickable: PropTypes.bool,
  isCurrent: PropTypes.bool,
  onStepClick: PropTypes.func
}

class FormWizardProgress extends Component {
  constructor(props) {
    super(props)
    this.navigateToStep = this.navigateToStep.bind(this)
  }

  navigateToStep(targetStep) {
    const { currentStep, isReviewing, formState } = this.props
    const isCurrentStepComplete = currentStep === 7 || isComplete(formState, currentStep)

    if (isReviewing && !isCurrentStepComplete) {
      this.props.onFailNavigationAttemp()
    } else {
      // navigating to review step
      // need to check that all other steps has completed
      if (targetStep === 7) {
        const everyStepComplete = steps.every(step => isComplete(formState, step))
        if (everyStepComplete) {
          this.props.onNavigateToStep(targetStep)
        }
      } else {
        const isTargetStepComplete = isComplete(formState, targetStep)
        if (isTargetStepComplete) {
          this.props.onNavigateToStep(targetStep)
        }
      }
    }
  }

  render() {
    const { currentStep, formState } = this.props
    const everyStepComplete = steps.every(step => isComplete(formState, step))

    return (
      <div className="form-wizard-progress">
        { steps.map(step => {
            const stepComplete = isComplete(formState, step)
            return <StepProgress step={step}
              key={step}
              isComplete={stepComplete}
              isClickable={stepComplete}
              isCurrent={currentStep === step}
              onStepClick={this.navigateToStep} />
          })
        }
        <StepProgress
          step={7}
          isComplete={false}
          isClickable={everyStepComplete}
          isCurrent={currentStep === 7}
          onStepClick={this.navigateToStep}
        />
      </div>
    )
  }
}

FormWizardProgress.propTypes = {
  formState: PropTypes.object.isRequired,
  currentStep: PropTypes.number.isRequired,
  isReviewing: PropTypes.bool,
  isRequired: PropTypes.bool,
  onNavigateToStep: PropTypes.func,
  onFailNavigationAttemp: PropTypes.func
}

const mapStateToProps = (state) => ({
  formState: getFormValues('registration')(state)
})

export default connect(mapStateToProps)(FormWizardProgress)
