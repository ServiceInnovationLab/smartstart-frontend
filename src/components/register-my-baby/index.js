import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import invert from 'lodash/invert'
import get from 'lodash/get'
import FormWizardProgress from './progress'
import Step1 from './step1'
import Step2 from './step2'
import Step3 from './step3'
import Step4 from './step4'
import { piwikTrackPost } from '../../actions/actions'

const stepByStepName = {
  'child-details': 1,
  'mother-details': 2,
  'father-details': 3,
  'other-details': 4
}

const stepNameByStep = invert(stepByStepName)

class RegisterMyBabyForm extends Component {
  constructor(props) {
    super(props)
    this.nextStep = this.nextStep.bind(this)
    this.previousStep = this.previousStep.bind(this)
    this.handleSubmitFail = this.handleSubmitFail.bind(this)
    this.state = {
      step: 1,
      stepName: 'child-details',
      steps: [
        { icon: '', name: 'Child'},
        { icon: '', name: 'Mother'},
        { icon: '', name: 'Father'},
        { icon: '', name: 'Others'}
      ]
    }
  }
  nextStep() {
    this.props.dispatch(piwikTrackPost('Register My Baby', {
      'category': 'RegisterMyBaby',
      'action': 'Click next',
      'name': this.state.stepName
    }))
    this.goToStep(this.state.step + 1)
  }

  previousStep() {
    this.props.dispatch(piwikTrackPost('Register My Baby', {
      'category': 'RegisterMyBaby',
      'action': 'Click back',
      'name': this.state.stepName
    }))
    this.goToStep(this.state.step - 1)
  }

  goToStep(step, replace = false) {
    const stepName = stepNameByStep[step]

    if (stepName) {
      this.props.router[replace ? 'replace': 'push'](`/register-my-baby/${stepName}`)
    }
  }

  handleSubmitFail() {
    this.props.dispatch(piwikTrackPost('Register My Baby', {
      'category': 'RegisterMyBaby',
      'action': 'Click next (errors)',
      'name': this.state.stepName
    }))
  }

  onSubmit() {
  }

  componentDidMount() {
    const { params, savedRegistrationForm } = this.props
    const { stepName } = params

    const step = stepByStepName[stepName]

    if (step && savedRegistrationForm && savedRegistrationForm.step === step) {
      this.goToStep(step)
    } else {
      this.goToStep(1, true)
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextStepName = get(nextProps, 'params.stepName')
    const currentStepName = get(this.state, 'stepName')

    if (nextStepName && nextStepName !== currentStepName) {
      const step = stepByStepName[nextStepName]
      this.setState({ step, stepName: nextStepName })
    }
  }

  render() {
    const { step, steps } = this.state

    return (
      <div>
        <FormWizardProgress currentStep={step} steps={steps} />
        {step === 1 && <Step1 onSubmit={this.nextStep} onSubmitFail={this.handleSubmitFail} />}
        {step === 2 && <Step2 onPrevious={this.previousStep} onSubmit={this.nextStep} onSubmitFail={this.handleSubmitFail} />}
        {step === 3 && <Step3 onPrevious={this.previousStep} onSubmit={this.nextStep} onSubmitFail={this.handleSubmitFail} />}
        {step === 4 && <Step4 onPrevious={this.previousStep} onSubmit={this.nextStep} onSubmitFail={this.handleSubmitFail} />}
      </div>
    )
  }
}

RegisterMyBabyForm.propTypes = {
  params: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  savedRegistrationForm: PropTypes.object,
  dispatch: PropTypes.func
}

RegisterMyBabyForm = connect(
  state => ({
    savedRegistrationForm: state.savedRegistrationForm,
  })
)(RegisterMyBabyForm)

export default RegisterMyBabyForm
