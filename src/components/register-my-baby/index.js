import React, { Component, PropTypes } from 'react'
import FormWizardProgress from './progress'
import Step1 from './step1'
import Step2 from './step2'
import Step3 from './step3'
import Step4 from './step4'

class RegisterMyBabyForm extends Component {
  constructor(props) {
    super(props)
    this.nextStep = this.nextStep.bind(this)
    this.previousStep = this.previousStep.bind(this)
    this.state = {
      step: 1,
      steps: [
        { icon: '', name: 'Child'},
        { icon: '', name: 'Mother'},
        { icon: '', name: 'Father'},
        { icon: '', name: 'Others'}
      ]
    }
  }
  nextStep() {
    this.setState({ step: this.state.step + 1 })
  }

  previousStep() {
    this.setState({ step: this.state.step - 1 })
  }

  onSubmit() {
  }

  render() {
    const { step, steps } = this.state
    return (
      <div>
        <FormWizardProgress currentStep={step} steps={steps} />
        {step === 1 && <Step1 onSubmit={this.nextStep} />}
        {step === 2 && <Step2 onPrevious={this.previousStep} onSubmit={this.nextStep} />}
        {step === 3 && <Step3 onPrevious={this.previousStep} onSubmit={this.nextStep} />}
        {step === 4 && <Step4 onPrevious={this.previousStep} onSubmit={this.onSubmit} />}
      </div>
    )
  }
}

RegisterMyBabyForm.propTypes = {
}

export default RegisterMyBabyForm
