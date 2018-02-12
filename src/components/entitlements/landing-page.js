import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Accordion from 'components/form/accordion'

import './landing-page.scss'

class EntitlementsLandingPage extends Component {
  constructor(props) {
    super(props)

    this.getStartedClick = this.getStartedClick.bind(this)
  }

  getStartedClick() {
    // TODO piwik event here?
  }

  render() {
    return (
      <div className="landing-page form eligibility">
        <div className="instruction">
          By answering the following questions, we’ll be able to work out what
          financial help you may or may not be eligible for.
        </div>

        <ul>
          <li>This is a planning tool that gives an indication of your eligibility, it won’t give you calculated figures.</li>
          <li>You can see what you might be eligible for currently or in the future.</li>
          <li>The information you enter won’t be shared with anyone, all your details will be kept private (see <Link to={'/your-privacy/'}>our privacy policy</Link>).</li>
        </ul>

        <p className='time-estimate'>Time to complete is 5-8 minutes.</p>

        <div className="expandable-group">
          <Accordion>
            <Accordion.Toggle>
            See what benefits and payments are included
            </Accordion.Toggle>
            <Accordion.Content>
              <ul>
                <li>Accommodation Supplement</li>
                <li>Child Care Subsidy</li>
                <li>Child Disability Allowance</li>
                <li>Community Services Card</li>
                <li>Job Seeker Support</li>
                <li>Home Help</li>
                <li>Orphans Benefit</li>
                <li>Sole Parent Support</li>
                <li>Student Allowance</li>
                <li>Supported Living Payment</li>
                <li>Paid Parental Leave</li>
                <li>Unsupported Childs Benefit</li>
                <li>Working for Families Tax Credits</li>
                <li>Young Parent Payment</li>
              </ul>
            </Accordion.Content>
          </Accordion>
        </div>

        <h5>Before you get started, check you have everything you need:</h5>

        <ul>
          <li>your income information</li>
          <li>your partner’s income information (if applicable).</li>
        </ul>

        <h5>Ready to get started?</h5>

        <Link to={'/financial-help/questions'} role="button" className="welcome-action button" onClick={this.getStartedClick}>Get started</Link>

      </div>
    )
  }
}

EntitlementsLandingPage.propTypes = {
  dispatch: PropTypes.func
}

const mapStateToProps = () => ({})

export default connect(mapStateToProps)(EntitlementsLandingPage)
