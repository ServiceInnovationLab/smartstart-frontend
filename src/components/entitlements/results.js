import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { Link } from 'react-router'
import Spinner from 'components/spinner/spinner'

class EntitlementsResults extends Component {
  constructor (props) {
    super(props)

    this.state = {
      permitted: [],
      forbidden: [],
      maybe: []
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
    let newPermitted = []
    let newForbidden = []
    let newMaybe = []

    for (let benefit in benefits) {
      benefits[benefit].forEach(result => {
        // only pull out conclusive results
        if (result.reasoningResult === 'CONCLUSIVE') {
          if (result.goal && result.goal.modality === 'PERMITTED') {
            // only add to the permitted list if it's not there already
            if (newPermitted.indexOf(benefit) === -1) {
              newPermitted.push(benefit)
            }
          } else {
            // only add to the forbidden list if it's not there already
            if (newForbidden.indexOf(benefit) === -1) {
              newForbidden.push(benefit)
            }
          }
        // also create a seperate list of incomplete permitted ones
        // this will have false positives - things that are 'CONCLUSIVE''FORBIDDEN'
        // so the maybe list requires further filtering
        } else if (result.reasoningResult === 'INCOMPLETE') {
          if (result.goal && result.goal.modality === 'PERMITTED') {
            if (newMaybe.indexOf(benefit) === -1) {
              newMaybe.push(benefit)
            }
          }
        }
      })
    }

    // remove any maybes that are in the forbidden list
    newMaybe = newMaybe.filter(benefit => newForbidden.indexOf(benefit) === -1)

    this.setState({
      permitted: newPermitted,
      forbidden: newForbidden,
      maybe: newMaybe
    })
  }

  render () {
    const { fetchingEligibility } = this.props
    const { permitted, forbidden, maybe } = this.state

    if (fetchingEligibility) {
      return <Spinner text="Please wait ..."/>
    }

    // TODO special error message for unable to recieve results
    // TODO error message for if the user hasn't actually supplied any question answers yet (came to page in error)

    return (
      <div className='entitlements-results'>
        <p>The results shown below are only an indication of the benefits and payments you may be eligible for.</p>
        <p>The estimate is based on:</p>
        <ul>
          <li>the anwers you provided to the questions;</li>
          <li>rates on 14 February 2018</li>
        </ul>

        {permitted.length > 0 &&
          <h3 className='section-heading'>
             Ākene pea, e māraurau ana koe ki te<br />
            <span className='english'>You’re probably eligible for</span>
          </h3>
        }
        {permitted.map((benefit, index) =>
          <p key={'permitted-' + index}>{benefit}</p>
        )}

        {maybe.length > 0 &&
          <h3 className='section-heading'>
             E māraurau ana pea koe ki te<br />
            <span className='english'>You’re possibly eligible for</span>
          </h3>
        }
        {maybe.map((benefit, index) =>
          <p key={'maybe-' + index}>{benefit}</p>
        )}

        {forbidden.length > 0 &&
          <h3 className='section-heading'>
             Kāore pea iana koe e māraurau ana ki te<br />
            <span className='english'>You’re probably not eligible for</span>
          </h3>
        }
        {forbidden.map((benefit, index) =>
          <p key={'forbidden-' + index}>{benefit}</p>
        )}

        <Link to={'/financial-help/questions'} role="button" className="button">Change my answers</Link>

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
