import React from 'react'
import Header from 'layouts/header/header'
import Timeline from 'components/timeline/timeline'

class Page extends React.Component {
  render () {
    return (
      <div className>
        <Header />
        <Timeline />
        {/* footer component will go here */}
      </div>
    )
  }
}

export default Page
