import './spinner.scss'

import React, { Component } from 'react'

class Spinner extends Component {
  render () {
    return (
      <p className='spinner' data-test='spinner'>Loading content</p>
    )
  }
}

Spinner.propTypes = {}

export default Spinner
