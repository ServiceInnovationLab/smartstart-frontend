import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Accordion from 'components/form/accordion'

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
      <div>
        <p>By answering the following questions, we’ll be able to work out what financial help you may or may not be eligible for. This is a planning tool that gives an indication of your eligibility, it won’t give you calculated figures.</p>

        <p>You can see what you might be eligible for currently or in the future. </p>

        <p>The information you enter won’t be shared with anyone, all your details will be kept private (see our privacy policy).</p>

        <div className="expandable-group secondary">
          <Accordion>
            <Accordion.Toggle>
            See what benefits and payments are included
            </Accordion.Toggle>
            <Accordion.Content>
              <p>TBC</p>
            </Accordion.Content>
          </Accordion>
        </div>

        <p>Before you get started, check you have everything you need:</p>

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
