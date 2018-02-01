import '../plain-layout-page.scss'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import Header from 'layouts/header/header'
import Footer from 'layouts/footer/footer'

import './entitlements.scss'

class EntitlementsPage extends Component {
  render () {
    const { isLoggedIn, authError } = this.props

    return (
      <div className='site-container-wrapper'>
        <div className='site-container'>
          <Header isLoggedIn={isLoggedIn} authError={authError} />
          <div className='entitlements-header'>
            <div className='entitlements-header-inner'>
              <h2>
                Title<br />
                <span className='english'>What financial help is available to me?</span>
              </h2>
              <p>Some description of what this thing is goes here.</p>
            </div>
          </div>
          <div id='content' className='plain-layout-page full-width entitlements-page'>
            <div className='page-content'>
              { this.props.children }
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

EntitlementsPage.propTypes = {
  children: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool,
  authError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string
  ])
}

export default connect(mapStateToProps)(EntitlementsPage)
