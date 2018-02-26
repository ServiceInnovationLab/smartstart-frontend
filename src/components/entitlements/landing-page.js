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
          By answering the following questions, we’ll be able to give you an indication of financial help you may be eligible for.
        </div>

        <ul>
          <li>The information you enter is anonymous, it isn’t shared with anyone and we won’t save anything, even if you’re logged in via RealMe (see <Link to={'/your-privacy/'}>our privacy policy</Link>).</li>
          <li>This planning tool will only show you the maximum amounts you could receive – it won’t calculate amounts based on your situation.</li>
          <li>It’s intended for parents and expectant parents who are New Zealand citizens or residents.</li>
          <li>You can see what you might be eligible for based on your current or future situation.</li>
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
                <li>Home Help</li>
                <li>Job Seeker Support</li>
                <li>Orphans Benefit</li>
                <li>Paid Parental Leave</li>
                <li>Sole Parent Support</li>
                <li>Student Allowance</li>
                <li>Supported Living Payment</li>
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
            <p>You can apply for the emergency benefit if you need urgent financial help and aren’t currently receiving any other benefits from Work and Income. The emergency benefit is a one-off payment that’s calculated based on your circumstances.</p>
            <p>You’ll need to call Work and Income to discuss your circumstances with them.</p>
            <p>Work and Income freephone: <a href='tel:0800559009'>0800 559 009</a></p>
            <h5>For other urgent help:</h5>
            <p>Foodbank New Zealand help families in need by providing food parcels and other services. </p>
            <p><a href='https://www.foodbank.co.nz/foodbanks' target='_blank' rel='noopener noreferrer'>Find a foodbank near you</a></p>
            <p>Citizens Advice Bureau has trained volunteers that will provide you with free and confidential information and guidance on where you can get urgent help in your local area.</p>
            <p>Citizens Advice Bureau freephone: <a href='tel:0800367222'>0800 367 222</a></p>
            <p><a href='http://www.cab.org.nz/acabnearyou/Pages/home.aspx'  target='_blank' rel='noopener noreferrer'>Find a Citizens Advice Bureau near you</a></p>
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
