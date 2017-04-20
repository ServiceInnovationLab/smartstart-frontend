import '../plain-layout-page.scss'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { IndexLink } from 'react-router'
import Header from 'layouts/header/header'
import Footer from 'layouts/footer/footer'
import Spinner from 'components/spinner/spinner'
import Error from 'components/error/error'
import SiteMetadataCard from 'components/card/site-metadata-card/site-metadata-card'
import { routeTagMapping } from 'index'

class MetadataPage extends Component {
  render () {
    const { about, isLoggedIn, appError, authError, isFetchingPersonalisation } = this.props
    const route = this.props.route.path

    let showWhenLoading = ''
    let showWhenLoaded = 'hidden'
    let showWhenHasError = 'hidden'
    let metadataCard = false

    if (about.length > 0 && !appError && isFetchingPersonalisation === false) {
      showWhenLoading = 'hidden'
      showWhenLoaded = ''
    }

    if (appError) {
      showWhenHasError = ''
      showWhenLoading = 'hidden'
    }

    // if we have a mapping for this route, match up the appropriate data
    if (routeTagMapping[route]) {
      about.forEach(card => {
        if (card.tags.indexOf(routeTagMapping[route]) > -1) {
          metadataCard = card
        }
      })
    }

    return (
      <div className='site-container-wrapper'>
        <div className='site-container'>
          <Header isLoggedIn={isLoggedIn} authError={authError} />
          <div id='content' className="plain-layout-page" >
            <div className="page-content">
              <div className={showWhenLoading}>
                <Spinner />
              </div>
              <div className={showWhenLoaded}>
                {metadataCard && <SiteMetadataCard key={metadataCard.id} id={metadataCard.id} title={metadataCard.label} elements={metadataCard.elements} tags={metadataCard.tags} />}
                <p role='navigation' className='back-to-main'><IndexLink to={'/'} className='button'>Go back</IndexLink></p>
              </div>
              <div className={showWhenHasError}>
                <Error />
              </div>
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

MetadataPage.propTypes = {
  phases: PropTypes.array,
  supplementary: PropTypes.array,
  about: PropTypes.array,
  isLoggedIn: PropTypes.bool,
  isFetchingPersonalisation: PropTypes.bool,
  appError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.object
  ]),
  authError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string
  ]),
  route: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(mapStateToProps)(MetadataPage)
