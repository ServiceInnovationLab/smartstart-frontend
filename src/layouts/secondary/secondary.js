import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import Header from 'layouts/header/header'
import Spinner from 'components/spinner/spinner'
import Error from 'components/error/error'

class Secondary extends Component {
  render () {
    const { about, isLoggedIn, appError, isFetchingPersonalisation } = this.props

    let showWhenLoading = ''
    let showWhenLoaded = 'hidden'
    let showWhenHasError = 'hidden'

    if (about.length > 0 && !appError && isFetchingPersonalisation === false) {
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
          <p><Link to={'/'}>Go back</Link></p>
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
