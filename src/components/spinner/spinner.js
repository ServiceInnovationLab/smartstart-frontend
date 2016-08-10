import './spinner.scss'

import React from 'react'

class Spinner extends React.Component {
  render () {
    return (
      <p className='spinner' data-test='spinner'>Loading content</p>
    )
  }
}

export default Spinner
