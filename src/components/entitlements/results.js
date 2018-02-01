import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'

class EntitlementsResults extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { eligibility, fetchingEligibility } = this.props

    if (fetchingEligibility) {
      return <Spinner text="Please wait ..."/>
    }

    // TODO special error message for unable to recieve results
    // TODO error message for if the user hasn't actually supplied any question answers yet (came to page in error)

    console.log(eligibility.benefits)

    return (
      <div>
        <h3>Results</h3>



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
