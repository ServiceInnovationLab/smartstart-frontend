import React, { PropTypes, Component } from 'react'
import Header from 'layouts/header/header'
import Footer from 'layouts/footer/footer'
import SettingsPane from 'components/settings-pane/settings-pane'
import Timeline from 'components/timeline/timeline'
import Supplementary from 'components/supplementary/supplementary'
import Spinner from 'components/spinner/spinner'
import Error from 'components/error/error'

class Main extends Component {
  render () {
    const { phases, supplementary, isLoggedIn, appError, isFetchingPersonalisation } = this.props

    let showWhenLoading = ''
    let showWhenLoaded = 'hidden'
    let showWhenHasError = 'hidden'

    if (phases.length > 0 && !appError && isFetchingPersonalisation === false) { // assumes there will always be both supplementary and phases
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
          <SettingsPane />
          <Timeline phases={phases} />
          <Supplementary cards={supplementary} />
        </div>
        <div className={showWhenHasError}>
          <Error />
        </div>
        <Footer />
      </div>
    )
  }
}

Main.propTypes = {
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

export default Main