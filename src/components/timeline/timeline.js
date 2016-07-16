import './timeline.scss'

import React from 'react'
import Phase from './phase/phase'

class Timeline extends React.Component {
  render () {
    return (
      <div className='timeline'>
        <Phase />
      </div>
    )
  }
}

export default Timeline
