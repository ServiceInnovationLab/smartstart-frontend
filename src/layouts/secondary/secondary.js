import React, { PropTypes, Component } from 'react'
import { IndexLink } from 'react-router'
import Header from 'layouts/header/header'
import Spinner from 'components/spinner/spinner'
import Error from 'components/error/error'
import SiteMetadataCard from 'components/card/site-metadata-card/site-metadata-card'
import { routeTagMapping } from 'index'

class Secondary extends Component {
  render () {
    const { about, isLoggedIn, appError, isFetchingPersonalisation } = this.props
    const route = this.props.route.path

    let showWhenLoading = ''
    let showWhenLoaded = 'hidden'
    let showWhenHasError = 'hidden'
    let secondaryCard = false

    if (about.length > 0 && !appError && isFetchingPersonalisation === false) {
      showWhenLoading = 'hidden'
      showWhenLoaded = ''
    }

    if (appError) {
      showWhenHasError = ''
      showWhenLoading = 'hidden'
    }

    // the primary purpose of the secondary layout is to display the site metadata pages
    // if we have a mapping for this route, match up the appropriate data
    if (routeTagMapping[route]) {
      about.forEach(card => {
        if (card.tags.indexOf(routeTagMapping[route]) > -1) {
          secondaryCard = card
        }
      })
    }

    return (
      <div>
        <Header isLoggedIn={isLoggedIn} />
        <div className={showWhenLoading}>
          <Spinner />
        </div>
        <div className={showWhenLoaded}>
          {secondaryCard && <SiteMetadataCard key={secondaryCard.id} id={secondaryCard.id} title={secondaryCard.label} elements={secondaryCard.elements} />}
          <p><IndexLink to={'/'}>Go back</IndexLink></p>
        </div>
        <div className={showWhenHasError}>
          <Error />
        </div>
        {/* footer component will go here */}
      </div>
    )
  }
}

Secondary.propTypes = {
  phases: PropTypes.array,
  supplementary: PropTypes.array,
  about: PropTypes.array,
  isLoggedIn: PropTypes.bool,
  isFetchingPersonalisation: PropTypes.bool,
  appError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.object
  ])
}

export default Secondary
