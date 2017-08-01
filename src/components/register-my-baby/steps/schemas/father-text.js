import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

const renderFatherText = ({ assistedHumanReproduction, assistedHumanReproductionWomanConsented, capitalize }) => {
  if (assistedHumanReproduction === 'yes' && assistedHumanReproductionWomanConsented) {
    return capitalize ?
      <span>Other Parent</span> :
      <span>other parent</span>
  }

  return capitalize ?
    <span>Father</span> :
    <span>father</span>
}

renderFatherText.propTypes = {
  assistedHumanReproduction: PropTypes.string,
  assistedHumanReproductionWomanConsented: PropTypes.bool,
  capitalize: PropTypes.bool
}

const selector = formValueSelector('registration')
const mapStateToProps = (state) => ({
  assistedHumanReproduction: selector(state, 'assistedHumanReproduction'),
  assistedHumanReproductionWomanConsented: selector(state, 'assistedHumanReproductionWomanConsented')

})

export default connect(mapStateToProps)(renderFatherText)

