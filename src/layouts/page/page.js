import React from 'react'
import Header from 'layouts/header/header'
import Timeline from 'components/timeline/timeline'
import Spinner from 'components/spinner/spinner'
import Error from 'components/error/error'

class Page extends React.Component {
  render () {
    const { phases, isLoggedIn, appError } = this.props

    let isLoading = ''
    let isLoaded = 'hidden'
    let hasError = 'hidden'

    if (phases.length > 0) {
      isLoading = 'hidden'
      isLoaded = ''
    }

    if (appError) {
      hasError = ''
      isLoading = 'hidden'
    }

    return (
      <div>
        <Header isLoggedIn={isLoggedIn} />
        <div className={isLoading}>
          <Spinner />
        </div>
        <div className={isLoaded}>
          <Timeline phases={phases} />
        </div>
        <div className={hasError}>
          <Error />
        </div>
        {/* footer component will go here */}
      </div>
    )
  }
}

export default Page
