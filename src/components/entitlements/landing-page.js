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
          <li>This is a planning tool that gives an indication of your eligibility for certain benefits and payments and the maximum amounts you could receive.</li>
          <li>It is intended for parents and expectant parents who are New Zealand citizens or residents.</li>
          <li>You can see what you might be eligible for based on your current or future situation.</li>
          <li>The information you enter isn’t stored and isn’t shared with anyone (see <Link to={'/your-privacy/'}>our privacy policy</Link>).</li>
        </ul>

        <p className='time-estimate'>Time to complete is 5-8 minutes.</p>

        <div className="expandable-group">
          <Accordion>
            <Accordion.Toggle>
            See what benefits and payments are included
            </Accordion.Toggle>
            <Accordion.Content>
              <p>The benefits and payments included in this planning tool are provided by Work and Income and Inland Revenue. It doesn’t include all benefits and payments available in New Zealand.</p>
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
          <Accordion>
            <Accordion.Toggle>
            Do you and your children need urgent financial help?
            </Accordion.Toggle>
            <Accordion.Content>
              <p>If you aren’t currently receiving any benefit from Work and Income and need urgent financial help, you can apply for the emergency benefit. This is a one-off payment calculated based on your circumstances.</p>

              <p>You’ll need to call Work and Income on <a href='tel:0800559009'>0800 559 009</a> to discuss your circumstances.</p>
              <p>For other urgent help:</p>
              <p>Call Citizens Advice Bureau on 0800 FOR CAB (<a href='tel:0800367222'>0800 367 222</a>)</p>
              <p><a href='https://www.foodbank.co.nz/foodbanks'>https://www.foodbank.co.nz/foodbanks</a></p>
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
