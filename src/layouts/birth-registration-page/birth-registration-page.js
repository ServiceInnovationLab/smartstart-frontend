import '../plain-layout-page.scss'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import Header from 'layouts/header/header'
import Footer from 'layouts/footer/footer'

class BirthRegistrationPage extends Component {
  render () {
    const { isLoggedIn, authError } = this.props

    return (
      <div className='site-container-wrapper'>
        <div className='site-container'>
          <Header isLoggedIn={isLoggedIn} authError={authError} />
          <div id='content' className="plain-layout-page">
            { this.props.children }
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

function mapStateToProps () {
  return {}
}

BirthRegistrationPage.propTypes = {
  isLoggedIn: PropTypes.bool,
  authError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string
  ]),
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func
}

export default connect(mapStateToProps)(BirthRegistrationPage)
