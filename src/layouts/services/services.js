import '../plain-layout-page.scss'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import Header from 'layouts/header/header'
import Footer from 'layouts/footer/footer'
import Services from 'components/services/services'

import './services.scss'

class ServicesPage extends Component {
  render () {
    const { isLoggedIn, authError, params } = this.props

    return (
      <div className='site-container-wrapper'>
        <div className='site-container'>
          <Header isLoggedIn={isLoggedIn} authError={authError} />
          <div className='services-header'>
            <div className='services-header-inner'>
              <h2>
                He ratonga e tata ana ki a au<br />
                <span className='english'>Services near me</span>
              </h2>
              <p>Choose a category and enter your location to find services and support closest to you.</p>
            </div>
          </div>
          <div id='content' className='plain-layout-page full-width services-page'>
            <div className='page-content'>
              <Services category={params.category} />
            </div>
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

ServicesPage.propTypes = {
  isLoggedIn: PropTypes.bool,
  authError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string
  ]),
  params: PropTypes.object
}

export default connect(mapStateToProps)(ServicesPage)
