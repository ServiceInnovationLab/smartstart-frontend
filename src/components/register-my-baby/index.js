import React, { Component, PropTypes } from 'react'
import { getFormValues } from 'redux-form'
import URLSearchParams from 'url-search-params'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import scriptLoader from 'react-async-script-loader'
import invert from 'lodash/invert'
import get from 'lodash/get'
import { animateScroll } from 'react-scroll'
import FormWizardProgress from './progress'
import Step1 from './steps/step1'
import Step2 from './steps/step2'
import Step3 from './steps/step3'
import Step4 from './steps/step4'
import Step5 from './steps/step5'
import Step6 from './steps/step6'
import Review from './steps/review/index'
import { fullSubmit } from './submit'
import { piwikTrackPost } from '../../actions/actions'
import { fetchBirthFacilities, fetchCountries, rememberBroData } from '../../actions/birth-registration'

const stepByStepName = {
  'child-details': 1,
  'mother-details': 2,
  'father-details': 3,
  'parents-relationship': 4,
  'other-services': 5,
  'buy-birth-certificates': 6,
  'review': 7
}

const stepNameByStep = invert(stepByStepName)

const scrollToFirstError = () => {
  const firstErrorNode = document.querySelector('.has-error')
  const firstErrorInput = document.querySelector('.has-error input, .has-error select, .has-error textarea')

  if (!firstErrorNode) {
    return;
  }

  const bodyRect = document.body.getBoundingClientRect()

  let elemRect

  if (firstErrorNode.parentNode.tagName === 'FIELDSET') {
    elemRect = firstErrorNode.parentNode.getBoundingClientRect()
  } else {
    elemRect = firstErrorNode.getBoundingClientRect()
  }

  const offset = elemRect.top - bodyRect.top;

  animateScroll.scrollTo(offset, { smooth: true })
  firstErrorInput.focus()
}

class RegisterMyBabyForm extends Component {
  constructor(props) {
    super(props)
    this.nextStep = this.nextStep.bind(this)
    this.previousStep = this.previousStep.bind(this)
    this.goToReviewStep = this.goToReviewStep.bind(this)
    this.handleSubmitFail = this.handleSubmitFail.bind(this)
    this.handleFieldReviewEdit = this.handleFieldReviewEdit.bind(this)
    this.submit = this.submit.bind(this)
    this.goToStep = this.goToStep.bind(this)
    this.state = {
      step: 1,
      stepName: 'child-details',
      isReviewing: false,
    }
  }
  nextStep() {
    this.props.piwikTrackPost('Register My Baby', {
      'category': 'RegisterMyBaby',
      'action': 'Click next',
      'name': this.state.stepName
    })
    this.goToStep(this.state.step + 1)
    this.setState({
      animationClass: 'next'
    })
  }

  previousStep() {
    this.props.piwikTrackPost('Register My Baby', {
      'category': 'RegisterMyBaby',
      'action': 'Click back',
      'name': this.state.stepName
    })
    this.goToStep(this.state.step - 1)
    this.setState({
      animationClass: 'previous'
    })
  }

  goToReviewStep() {
    if (this.state.isReviewing) {
      this.goToStep(7)
    }
  }

  goToStep(step, replace = false, focus = '') {
    const stepName = stepNameByStep[step]

    const currentStep = this.state.step;

    if (stepName) {
      if (currentStep === 7 && step !== currentStep) {
        this.setState({
          isReviewing: true
        });
      }

      let url = `/register-my-baby/${stepName}`;

      if (focus) {
        url += `?focus=${focus}`
      }

      this.props.router[replace ? 'replace': 'push'](url)
    }
  }

  handleSubmitFail() {
    this.props.piwikTrackPost('Register My Baby', {
      'category': 'RegisterMyBaby',
      'action': 'Click next (errors)',
      'name': this.state.stepName
    })
    window.setTimeout(scrollToFirstError, 200)
  }

  handleFieldReviewEdit(section, fieldName) {
    this.goToStep(stepByStepName[section], false, fieldName)
  }

  submit() {
    return fullSubmit(this.props.formState, this.props.csrfToken)
      .then(({ submittedData, result }) => {
        if (submittedData.certificateOrder) {
          if (result.response && result.response.paymentURL) {
            const productCode = get(submittedData, 'certificateOrder.productCode')
            const quantity = get(submittedData, 'certificateOrder.quantity')
            const courierDelivery = get(submittedData, 'certificateOrder.courierDelivery')
            return rememberBroData({
              applicationReferenceNumber: result.response.applicationReferenceNumber,
              productCode,
              quantity,
              courierDelivery
            })
            .then(() => {
              window.location = result.response.paymentURL;
            });
          }
        }

        return rememberBroData({
          applicationReferenceNumber: result.response.applicationReferenceNumber
        })
        .then(() => {
          browserHistory.push('/register-my-baby/confirmation')
        });
      });
  }

  componentWillMount() {
    this.props.fetchBirthFacilities();
    this.props.fetchCountries();
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

    animateScroll.scrollToTop({ duration: 300 })
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
    const { step, isReviewing, animationClass = '' } = this.state

    const searchParams = new URLSearchParams(this.props.location.search)
    const autoFocusField = searchParams.get('focus')

    return (
      <div>
        <FormWizardProgress
          currentStep={step}
          isReviewing={isReviewing}
          onFailNavigationAttemp={() => window.setTimeout(scrollToFirstError, 200)}
          onNavigateToStep={this.goToStep}
        />

        <CSSTransitionGroup
          component="div"
          className={`slider-animation-container ${animationClass}`}
          transitionName="slide"
          transitionEnterTimeout={600}
          transitionLeaveTimeout={600}>
          {step === 1 && <Step1 autoFocusField={autoFocusField} isReviewing={isReviewing} onComebackToReview={this.goToReviewStep} onSubmit={this.nextStep} onSubmitFail={this.handleSubmitFail} />}
          {step === 2 && <Step2 autoFocusField={autoFocusField} isReviewing={isReviewing} onComebackToReview={this.goToReviewStep} onPrevious={this.previousStep} onSubmit={this.nextStep} onSubmitFail={this.handleSubmitFail} />}
          {step === 3 && <Step3 autoFocusField={autoFocusField} isReviewing={isReviewing} onComebackToReview={this.goToReviewStep} onPrevious={this.previousStep} onSubmit={this.nextStep} onSubmitFail={this.handleSubmitFail} />}
          {step === 4 && <Step4 autoFocusField={autoFocusField} isReviewing={isReviewing} onComebackToReview={this.goToReviewStep} onPrevious={this.previousStep} onSubmit={this.nextStep} onSubmitFail={this.handleSubmitFail} />}
          {step === 5 && <Step5 autoFocusField={autoFocusField} isReviewing={isReviewing} onComebackToReview={this.goToReviewStep} onPrevious={this.previousStep} onSubmit={this.nextStep} onSubmitFail={this.handleSubmitFail} />}
          {step === 6 && <Step6 autoFocusField={autoFocusField} isReviewing={isReviewing} onComebackToReview={this.goToReviewStep} onPrevious={this.previousStep} onSubmit={this.nextStep} onSubmitFail={this.handleSubmitFail} />}
          {step === 7 &&
            <Review
              onPrevious={this.previousStep}
              onSubmit={this.submit}
              onSubmitFail={this.handleSubmitFail}
              onFieldEdit={this.handleFieldReviewEdit}
            />
          }
        </CSSTransitionGroup>
      </div>
    )
  }
}

RegisterMyBabyForm.propTypes = {
  params: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  savedRegistrationForm: PropTypes.object,
  fetchBirthFacilities: PropTypes.func,
  fetchCountries: PropTypes.func,
  formState: PropTypes.object,
  csrfToken: PropTypes.string,
  piwikTrackPost: PropTypes.func
}

const mapStateToProps = (state) => ({
  savedRegistrationForm: get(state, 'birthRegistration.savedRegistrationForm'),
  formState: getFormValues('registration')(state),
  csrfToken: get(state, 'birthRegistration.csrfToken')
})

RegisterMyBabyForm = connect(
  mapStateToProps,
  {
    fetchBirthFacilities,
    fetchCountries,
    piwikTrackPost
  }
)(RegisterMyBabyForm)

export default scriptLoader(
  `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`
)(RegisterMyBabyForm)
