import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import Header from 'layouts/header/header'
import Footer from 'layouts/footer/footer'
import SettingsPane from 'components/settings-pane/settings-pane'
import Welcome from 'components/welcome/welcome'
import Timeline from 'components/timeline/timeline'
import Supplementary from 'components/supplementary/supplementary'
import Spinner from 'components/spinner/spinner'
import Error from 'components/error/error'

class Main extends Component {
  render () {
    const { phases, supplementary, isLoggedIn, appError, authError, isFetchingPersonalisation } = this.props

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
      <div className='site-container-wrapper'>
        <div className='site-container'>
          <Header isLoggedIn={isLoggedIn} authError={authError} showBanner={true} />
          <div className={showWhenLoaded}>
            <SettingsPane />
            <Welcome />
          </div>
          <div id='content'>
            <div className={showWhenLoading}>
              <Spinner />
            </div>
            <div className={showWhenLoaded} role='main'>
              <Timeline phases={phases} />
              <Supplementary cards={supplementary} />
            </div>
            <div className={showWhenHasError}>
              <Error />
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
  ]),
  authError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string
  ]),
  dispatch: PropTypes.func
}

export default connect(mapStateToProps)(Main)
