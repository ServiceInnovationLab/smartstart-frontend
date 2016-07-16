import './phase.scss'

import React from 'react'
import Card from './card/card'

class Phase extends React.Component {
  render () {
    return (
      <div className='phase'>
        <h2>Phase name 1</h2>
        <Card />
      </div>
    )
  }
}

export default Phase
