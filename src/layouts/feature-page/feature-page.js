import './feature-page.scss'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { piwikTrackPost } from 'actions/actions'
import { IndexLink } from 'react-router'
import Header from 'layouts/header/header'
import Footer from 'layouts/footer/footer'

class FeaturePage extends Component {
  componentDidMount () {
    if (!this.props.children) {
      window.location = '/'
    }
  }

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

function mapStateToProps () {
  return {}
}

FeaturePage.propTypes = {
  isLoggedIn: PropTypes.bool,
  authError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string
  ]),
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func
}

export default connect(mapStateToProps)(FeaturePage)
