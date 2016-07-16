import './phase.scss'

import React from 'react'
import Card from './card/card'

export default React.createClass({
  render () {
    return (
      <div className='phase'>
        <h2>Phase name 1</h2>
        <Card />
      </div>
    )
  }
})
