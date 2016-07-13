import 'components/greeting/greeting.scss'

import React from 'react'

export default React.createClass({
  render () {
    return (
      <div className='greeting'>
        <h1>Hello, {this.props.name}!</h1>
      </div>
    )
  }
})
