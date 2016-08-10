import React from 'react'
import Header from 'layouts/header/header'
import Timeline from 'components/timeline/timeline'
import Spinner from 'components/spinner/spinner'

class Page extends React.Component {
  render () {
    const { loading, phases } = this.props

    return (
      <div>
        <Header />
        {loading &&
          <Spinner />
        }
        {phases.length > 0 &&
          <Timeline phases={phases} />
        }
        {/* footer component will go here */}
      </div>
    )
  }
}

export default Page
