import './timeline.scss'

import React from 'react'
import Phase from './phase/phase'

export default React.createClass({
  render () {
    return (
      <div className='timeline'>
        <Phase />
      </div>
    )
  }
})
