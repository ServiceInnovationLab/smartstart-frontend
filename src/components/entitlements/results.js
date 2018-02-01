import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'
import Spinner from 'components/spinner/spinner'

class EntitlementsResults extends Component {
  constructor (props) {
    super(props)

    this.state = {
      permitted: [],
      forbidden: []
    }

    this.assessBenefits = this.assessBenefits.bind(this)
  }

  componentDidMount () {
    const { eligibility } = this.props
    if (eligibility.benefit) {
      this.assessBenefits(eligibility.benefit)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { eligibility } = nextProps
    if (eligibility.benefit) {
      this.assessBenefits(eligibility.benefit)
    }
  }

  assessBenefits (benefits) {
    const { permitted, forbidden } = this.state
    let newPermitted = []
    let newForbidden = []

    for (let benefit in benefits) {
      benefits[benefit].forEach(result => {
        // only pull out conclusive results
        if (result.reasoningResult === 'CONCLUSIVE') {
          if (result.goal && result.goal.modality === 'PERMITTED') {
            // only add to the permitted list if it's not there already
            if (permitted.indexOf(benefit) === -1 && newPermitted.indexOf(benefit) === -1) {
              newPermitted.push(benefit)
            }
          } else {
            // only add to the forbidden list if it's not there already
            if (forbidden.indexOf(benefit) === -1 && newForbidden.indexOf(benefit) === -1) {
              newForbidden.push(benefit)
            }
          }
        }
      })
    }
    this.setState({
      permitted: permitted.concat(newPermitted),
      forbidden: forbidden.concat(newForbidden)
    })
  }

  render () {
    const { fetchingEligibility } = this.props
    const { permitted, forbidden } = this.state

    if (fetchingEligibility) {
      return <Spinner text="Please wait ..."/>
    }

    // TODO special error message for unable to recieve results
    // TODO error message for if the user hasn't actually supplied any question answers yet (came to page in error)

    return (
      <div>
        <h3>Results</h3>

        <h4>Eligible</h4>
        {permitted.map((benefit, index) =>
          <p key={'permitted-' + index}>{benefit}</p>
        )}

        <h4>Not eligible</h4>
        {forbidden.map((benefit, index) =>
          <p key={'forbidden-' + index}>{benefit}</p>
        )}

      </div>
    )
  }
}

EntitlementsResults.propTypes = {
  fetchingEligibility: PropTypes.bool,
  eligibility: PropTypes.object
}

const mapStateToProps = (state) => ({
  fetchingEligibility: get(state, 'entitlements.fetchingEligibility'),
  eligibility: get(state, 'entitlements.eligibility')
})

export default connect(mapStateToProps)(EntitlementsResults)
