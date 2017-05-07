import './progress.scss'
import classNames from 'classnames'

import React, { Component, PropTypes } from 'react'

class FormWizardProgress extends Component {
  render() {
    const { currentStep, steps } = this.props
    const stepPercentage = (currentStep / steps.length) * 100
    const oneStepPercentage = (1 / steps.length) * 100

    const progressBarWidth = stepPercentage - oneStepPercentage / 2

    return (
      <div className="form-wizard-progress">
        {
          steps.map((step, i) => {
            const stepClass = classNames(
              'form-wizard-step',
              { 'finished': i + 1 < currentStep },
              { 'current': i + 1 === currentStep }
            )
            return (
              <div className={stepClass} key={`step-${i + 1}`}>
                <div className="form-wizard-step-icon">
                  {
                    step.icon ?
                    <i className={step.icon}></i> :
                    <span>{i + 1}</span>
                  }
                </div>
                <p>{step.name}</p>
              </div>
            )
          })
        }
        <div className="form-wizard-progress-line">
          <div style={{width: progressBarWidth + '%'}}></div>
        </div>
      </div>
    )
  }
}

FormWizardProgress.propTypes = {
  currentStep: PropTypes.number.isRequired,
  steps: PropTypes.array.isRequired
}

export default FormWizardProgress
