import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { Link } from 'react-router'
import { fetchMetadata, postToReasoner } from 'actions/entitlements'
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

    this.retry = this.retry.bind(this)
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

  retry () {
    this.props.postToReasoner(this.props.eligibilityRequest)
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
    const { fetchingEligibility, eligibilityRequest, eligibility, fetchingMetadata, metadata } = this.props
    const { permitted, forbidden, maybe } = this.state

    if (fetchingEligibility || fetchingMetadata) {
      return <Spinner text='Please wait ...'/>
    }

    if ((!eligibility || Object.keys(eligibility).length === 0) && Object.keys(eligibilityRequest).length > 0) {
      // no results and we do have question data - unable to connect to RaaP
      return <div className='unavailable-notice'>
        <h3>Sorry!</h3>
        <p>
          Benefits eligibility is currently unavailable. Right now we’re working on getting back online as soon as possible. Thank you for your patience - please <Link to={'/financial-help/results'} onClick={this.retry}>try again</Link> shortly.
        </p>
      </div>
    }

    if (Object.keys(eligibilityRequest).length === 0) {
      // no question data - user refreshed or directly came to this page
      return <div className='unavailable-notice entitlements-results'>
        <h3>Oops!</h3>
        <p>
          It doesn’t look like we have any question information from you - did you accidentally refresh this page? Sorry, because we don’t store any of your information for privacy reasons you’ll need to <Link to={'/financial-help/questions'}>answer the questions again</Link>.
        </p>

        <div className='form eligibility'>
          <Link to={'/financial-help/questions'} role="button" className="button change-answers">Go to the questions</Link>
        </div>
      </div>
    }

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

        {permitted.length === 0 && maybe.length === 0 &&
          <div className='all-forbidden'>
            <h3>Sorry!</h3>
            <p>
              We haven’t found any benefits that it seems like you might be eligible for. Perhaps you’d like to try <Link to={'/financial-help/questions'}>changing some of your answers</Link>?
            </p>
          </div>
        }

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
  eligibilityRequest: PropTypes.object,
  fetchingMetadata: PropTypes.bool,
  metadata: PropTypes.object,
  fetchMetadata: PropTypes.func,
  postToReasoner: PropTypes.func
}

const mapStateToProps = (state) => ({
  fetchingEligibility: get(state, 'entitlements.fetchingEligibility'),
  eligibility: get(state, 'entitlements.eligibility'),
  eligibilityRequest: get(state, 'entitlements.eligibilityRequest'),
  fetchingMetadata: get(state, 'entitlements.fetchingMetadata'),
  metadata: get(state, 'entitlements.metadata')
})

export default connect(
  mapStateToProps,
  {
    fetchMetadata,
    postToReasoner
  }
)(EntitlementsResults)
