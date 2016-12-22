import './feature-page.scss'

import React, { PropTypes, Component } from 'react'
import { IndexLink } from 'react-router'
import Header from 'layouts/header/header'
import Footer from 'layouts/footer/footer'

class FeaturePage extends Component {
  render () {
    const { isLoggedIn, authError } = this.props

    return (
      <div className='site-container-wrapper feature-page'>
        <div className='site-container'>
          <Header isLoggedIn={isLoggedIn} authError={authError} />
          <div id='content'>
            { this.props.children }
            <div className='feature-page-content'>
              <p role='navigation' className='back-to-main'><IndexLink to={'/'} className='button'>Go back</IndexLink></p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

FeaturePage.propTypes = {
  isLoggedIn: PropTypes.bool,
  authError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string
  ]),
  children: PropTypes.object.isRequired
}

export default FeaturePage
