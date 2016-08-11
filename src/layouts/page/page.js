import React from 'react'
import Header from 'layouts/header/header'
import Timeline from 'components/timeline/timeline'
import Spinner from 'components/spinner/spinner'

class Page extends React.Component {
  render () {
    const { phases } = this.props

    let isLoading = ''
    let isLoaded = 'hidden'

    if (phases.length > 0) {
      isLoading = 'hidden'
      isLoaded = ''
    }

    return (
      <div>
        <Header />
        <div className={isLoading}>
          <Spinner />
        </div>
        <div className={isLoaded}>
          <Timeline phases={phases} />
        </div>
        {/* footer component will go here */}
      </div>
    )
  }
}

export default Page
