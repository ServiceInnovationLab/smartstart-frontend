import React, { PropTypes, Component } from 'react'
import Header from 'layouts/header/header'
import Timeline from 'components/timeline/timeline'
import Supplementary from 'components/supplementary/supplementary'
import Spinner from 'components/spinner/spinner'
import Error from 'components/error/error'

class Page extends Component {
  render () {
    const { phases, supplementary, isLoggedIn, appError } = this.props

    let showWhenLoading = ''
    let showWhenLoaded = 'hidden'
    let showWhenHasError = 'hidden'

    if (phases.length > 0) { // assumes there will always be both supplementary and phases
      showWhenLoading = 'hidden'
      showWhenLoaded = ''
    }

    if (appError) {
      showWhenHasError = ''
      showWhenLoading = 'hidden'
    }

    return (
      <div>
        <Header isLoggedIn={isLoggedIn} />
        <div className={showWhenLoading}>
          <Spinner />
        </div>
        <div className={showWhenLoaded}>
          <Timeline phases={phases} />
        </div>
        <div className={showWhenLoaded}>
          <Supplementary cards={supplementary} />
        </div>
        <div className={showWhenHasError}>
          <Error />
        </div>
        {/* footer component will go here */}
      </div>
    )
  }
}

Page.propTypes = {
  phases: PropTypes.array.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  appError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.object
  ])
}

export default Page
