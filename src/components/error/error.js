import './error.scss'

import React from 'react'

class Error extends React.Component {
  render () {
    return (
      <div className='app-error'>
        <h3>Sorry, we are unable to retrieve the content at the moment. Please try again shortly.</h3>
      </div>
    )
  }
}

export default Error
