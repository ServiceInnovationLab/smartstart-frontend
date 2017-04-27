import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { piwikTrackPost } from '../../actions/actions'

class RegisterMyBabyLandingPage extends Component {
  constructor(props) {
    super(props);

    this.getStartedClick = this.getStartedClick.bind(this);
  }

  getStartedClick() {
    const piwikEvent = {
      'category': 'RegisterMyBaby',
      'action': 'Click button',
      'name': 'Get started'
    }
    this.props.dispatch(piwikTrackPost('Register My Baby', piwikEvent))
  }

  render() {
    return (
      <div className="page-content">
        <h3>Notification of Birth for Registration</h3>
        <div className="divider" />

        <h5>Before you apply, make sure you have read everything you need:</h5>
        <ul>
          <li>Name and birth details of child being registered</li>
          <li>Name, birth and occupation details of both parents (if available)</li>
          <li>Address details for delivery of birth certificate (if you're ordering one)</li>
          <li>Credit or debit card, or internet banking details for ordering a certificate, if required</li>
        </ul>

        <h5>In this form you can also:</h5>
        <ul>
          <li>Apply for an IRD number for your child</li>
          <li>Notify MSD of the birth</li>
        </ul>

        <p>
          <strong>Take care with this form - it's against the law to give false information and you may have to pay to correct mistakes</strong>
        </p>

        <h3>Ready to go?</h3>
        <Link to={'/register-my-baby/child-details'} role="button" className="button" onClick={this.getStartedClick}>Get started</Link>
      </div>
    );
  }
}

RegisterMyBabyLandingPage.propTypes = {
  dispatch: PropTypes.func
};

const mapStateToProps = () => ({})

export default connect(mapStateToProps)(RegisterMyBabyLandingPage)
