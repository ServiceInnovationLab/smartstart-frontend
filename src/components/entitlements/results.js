import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { Link } from 'react-router'
import { fetchMetadata } from 'actions/entitlements'
import Spinner from 'components/spinner/spinner'
import Benefit from 'components/entitlements/benefit'
import './results.scss'

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

  componentWillMount () {
    this.props.fetchMetadata()
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
        // also create a seperate list of incomplete permitted ones - this will
        // have false positives - things that are 'CONCLUSIVE''FORBIDDEN' or
        // 'CONCLUSIVE''PERMITTED' so the maybes require further filtering later
        } else if (result.reasoningResult === 'INCOMPLETE') {
          if (result.goal && result.goal.modality === 'PERMITTED') {
            if (newMaybe.indexOf(benefit) === -1) {
              newMaybe.push(benefit)
            }
          }
        }
      })
    }

    // remove any maybes that are in the forbidden or permitted lists
    newMaybe = newMaybe.filter(benefit => newForbidden.indexOf(benefit) === -1)
    newMaybe = newMaybe.filter(benefit => newPermitted.indexOf(benefit) === -1)

    this.setState({
      permitted: newPermitted,
      forbidden: newForbidden,
      maybe: newMaybe
    })
  }

  render () {
    const { fetchingEligibility, fetchingMetadata, metadata } = this.props
    const { permitted, forbidden, maybe } = this.state

    if (fetchingEligibility || fetchingMetadata) {
      return <Spinner text="Please wait ..."/>
    }

    // TODO special error message for unable to recieve results
    // TODO error message for if the user hasn't actually supplied any question answers yet (came to page in error)
    // TODO error message for note being eligible for anything

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
          <Benefit key={'permitted-' + index} metadata={metadata[benefit]} />
        )}

        {maybe.length > 0 &&
          <h3 className='section-heading'>
             E māraurau ana pea koe ki te<br />
            <span className='english'>You’re possibly eligible for</span>
          </h3>
        }
        {maybe.map((benefit, index) =>
          <Benefit key={'maybe-' + index} id={benefit} metadata={metadata[benefit]} />
        )}

        {forbidden.length > 0 &&
          <div>
            <h3 className='section-heading'>
               Kāore pea iana koe e māraurau ana ki te<br />
              <span className='english'>You’re probably not eligible for</span>
            </h3>
            <ul>
              {forbidden.map((benefit, index) => {
                if (metadata[benefit] && metadata[benefit].name && metadata[benefit].moreInformationLink) {
                  return (
                    <li key={'forbidden-' + index}>
                      <a href={metadata[benefit].moreInformationLink} target='_blank' rel='noopener noreferrer'>{metadata[benefit].name}</a>
                    </li>
                  )
                }
              })}
            </ul>
          </div>
        }

        <div className='form eligibility'>
          <Link to={'/financial-help/questions'} role="button" className="button change-answers">Change my answers</Link>
        </div>

      </div>
    )
  }
}

EntitlementsResults.propTypes = {
  fetchingEligibility: PropTypes.bool,
  eligibility: PropTypes.object,
  fetchingMetadata: PropTypes.bool,
  metadata: PropTypes.object,
  fetchMetadata: PropTypes.func
}

const mapStateToProps = (state) => ({
  fetchingEligibility: get(state, 'entitlements.fetchingEligibility'),
  eligibility: get(state, 'entitlements.eligibility'),
  fetchingMetadata: get(state, 'entitlements.fetchingMetadata'),
  metadata: get(state, 'entitlements.metadata')
})

export default connect(
  mapStateToProps,
  {
    fetchMetadata
  }
)(EntitlementsResults)
